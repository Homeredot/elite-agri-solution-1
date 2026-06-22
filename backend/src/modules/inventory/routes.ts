import { Router } from "express";
import { z } from "zod";
import { query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";

const adjustmentSchema = z.object({
  productId: z.coerce.number().int().positive(),
  movementType: z.enum(["adjustment", "restock", "damage", "return"]),
  quantityChange: z.coerce.number().int(),
  notes: z.string().optional().nullable()
});

const bulkStockSchema = z.object({
  items: z.array(
    z.object({
      productId: z.coerce.number().int().positive(),
      stockQuantity: z.coerce.number().int().nonnegative()
    })
  )
});

export const inventoryRouter = Router();

inventoryRouter.get(
  "/products",
  requirePermission("inventory.view"),
  asyncHandler(async (_request, response) => {
    const data = await query(
      `
        SELECT id, name, sku, stock_quantity, status
        FROM products
        WHERE deleted_at IS NULL
        ORDER BY name ASC, sku ASC
      `
    );

    response.json({ data });
  })
);

inventoryRouter.get(
  "/overview",
  requirePermission("inventory.view"),
  asyncHandler(async (_request, response) => {
    const [summary] = await query<any[]>(
      `
        SELECT
          COUNT(*) AS total_products,
          SUM(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 ELSE 0 END) AS low_stock_products,
          SUM(CASE WHEN stock_quantity <= 0 THEN 1 ELSE 0 END) AS out_of_stock_products,
          SUM(stock_quantity) AS total_units_in_stock
        FROM products
        WHERE deleted_at IS NULL
      `
    );

    const lowStock = await query("SELECT * FROM vw_low_stock_products LIMIT 20");

    response.json({
      summary,
      lowStock
    });
  })
);

inventoryRouter.get(
  "/movements",
  requirePermission("inventory.view"),
  asyncHandler(async (_request, response) => {
    const data = await query(
      `
        SELECT
          sm.*,
          p.name AS product_name,
          p.sku,
          CONCAT(au.first_name, ' ', COALESCE(au.last_name, '')) AS created_by_name
        FROM stock_movements sm
        INNER JOIN products p ON p.id = sm.product_id
        LEFT JOIN admin_users au ON au.id = sm.created_by
        ORDER BY sm.created_at DESC
        LIMIT 200
      `
    );
    response.json({ data });
  })
);

inventoryRouter.post(
  "/adjustments",
  requirePermission("inventory.manage"),
  validate(adjustmentSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;

    await withTransaction(async (connection) => {
      const [products] = await connection.execute<any[]>(
        "SELECT id, stock_quantity FROM products WHERE id = ? LIMIT 1",
        [payload.productId]
      );
      const product = products[0];

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      const quantityBefore = product.stock_quantity;
      const quantityAfter = quantityBefore + payload.quantityChange;

      await connection.execute(
        "UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [quantityAfter, payload.productId]
      );

      await connection.execute(
        `
          INSERT INTO stock_movements (
            product_id, movement_type, quantity_change, quantity_before, quantity_after,
            notes, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          payload.productId,
          payload.movementType,
          payload.quantityChange,
          quantityBefore,
          quantityAfter,
          payload.notes ?? null,
          request.adminUser!.id
        ]
      );
    });

    response.status(201).json({ message: "Stock adjustment recorded" });
  })
);

inventoryRouter.post(
  "/bulk-update",
  requirePermission("inventory.manage"),
  validate(bulkStockSchema),
  asyncHandler(async (request, response) => {
    await withTransaction(async (connection) => {
      for (const item of request.body.items) {
        const [products] = await connection.execute<any[]>(
          "SELECT stock_quantity FROM products WHERE id = ? LIMIT 1",
          [item.productId]
        );
        const product = products[0];

        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, 404);
        }

        await connection.execute(
          "UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [item.stockQuantity, item.productId]
        );
        await connection.execute(
          `
            INSERT INTO stock_movements (
              product_id, movement_type, quantity_change, quantity_before, quantity_after, notes, created_by
            ) VALUES (?, 'adjustment', ?, ?, ?, ?, ?)
          `,
          [
            item.productId,
            item.stockQuantity - product.stock_quantity,
            product.stock_quantity,
            item.stockQuantity,
            "Bulk stock update from admin",
            request.adminUser!.id
          ]
        );
      }
    });

    response.json({ message: "Bulk stock update completed" });
  })
);
