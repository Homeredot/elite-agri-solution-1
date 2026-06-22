import { Router } from "express";
import { z } from "zod";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { execute, query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getPagination } from "../../utils/pagination.js";

const couponSchema = z
  .object({
    code: z.string().min(2),
    name: z.string().min(2),
    description: z.string().optional().nullable(),
    discountType: z.enum(["percentage", "fixed", "free_delivery"]),
    discountValue: z.coerce.number().nonnegative(),
    minimumOrderAmount: z.coerce.number().nonnegative().default(0),
    usageLimit: z.coerce.number().int().optional().nullable(),
    usageLimitPerUser: z.coerce.number().int().optional().nullable(),
    startsAt: z.string().datetime().optional().nullable(),
    endsAt: z.string().datetime().optional().nullable(),
    isActive: z.boolean().default(true),
    appliesTo: z.enum(["all", "categories", "products"]).default("all"),
    categoryIds: z.array(z.coerce.number().int().positive()).default([]),
    productIds: z.array(z.coerce.number().int().positive()).default([])
  })
  .superRefine((payload, context) => {
    if (payload.discountType !== "free_delivery" && payload.discountValue <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Discount value must be greater than zero"
      });
    }

    if (payload.appliesTo === "categories" && payload.categoryIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryIds"],
        message: "Select at least one category"
      });
    }

    if (payload.appliesTo === "products" && payload.productIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productIds"],
        message: "Select at least one product"
      });
    }

    if (payload.startsAt && payload.endsAt && new Date(payload.endsAt) < new Date(payload.startsAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "End date must be after the start date"
      });
    }
  });

const syncCouponTargets = async (
  connection: PoolConnection,
  couponId: number,
  payload: z.infer<typeof couponSchema>
) => {
  await connection.execute("DELETE FROM coupon_categories WHERE coupon_id = ?", [couponId]);
  await connection.execute("DELETE FROM coupon_products WHERE coupon_id = ?", [couponId]);

  if (payload.appliesTo === "categories") {
    for (const categoryId of payload.categoryIds) {
      await connection.execute(
        "INSERT INTO coupon_categories (coupon_id, category_id) VALUES (?, ?)",
        [couponId, categoryId]
      );
    }
  }

  if (payload.appliesTo === "products") {
    for (const productId of payload.productIds) {
      await connection.execute(
        "INSERT INTO coupon_products (coupon_id, product_id) VALUES (?, ?)",
        [couponId, productId]
      );
    }
  }
};

export const promotionsRouter = Router();

promotionsRouter.get(
  "/targets",
  requirePermission("promotions.manage"),
  asyncHandler(async (_request, response) => {
    const [categories, products] = await Promise.all([
      query(
        `
          SELECT id, name, status
          FROM categories
          ORDER BY name ASC
        `
      ),
      query(
        `
          SELECT id, name, sku, stock_quantity, status
          FROM products
          WHERE deleted_at IS NULL
          ORDER BY name ASC, sku ASC
        `
      )
    ]);

    response.json({ categories, products });
  })
);

promotionsRouter.get(
  "/coupons",
  requirePermission("promotions.manage"),
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const data = await query(
      `
        SELECT *
        FROM coupons
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );
    const [{ total }] = await query<{ total: number }[]>("SELECT COUNT(*) AS total FROM coupons");
    response.json({ data, meta: { page, pageSize, total } });
  })
);

promotionsRouter.get(
  "/coupons/:id",
  requirePermission("promotions.manage"),
  asyncHandler(async (request, response) => {
    const couponId = Number(request.params.id);
    const [coupon] = await query<any[]>("SELECT * FROM coupons WHERE id = ? LIMIT 1", [couponId]);
    const [categories, products, usage] = await Promise.all([
      query("SELECT category_id FROM coupon_categories WHERE coupon_id = ?", [couponId]),
      query("SELECT product_id FROM coupon_products WHERE coupon_id = ?", [couponId]),
      query(
        `
          SELECT cu.*, o.order_number
          FROM coupon_usage cu
          INNER JOIN orders o ON o.id = cu.order_id
          WHERE cu.coupon_id = ?
          ORDER BY cu.used_at DESC
        `,
        [couponId]
      )
    ]);

    response.json({ data: { ...coupon, categories, products, usage } });
  })
);

promotionsRouter.post(
  "/coupons",
  requirePermission("promotions.manage"),
  validate(couponSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const couponId = await withTransaction(async (connection) => {
      const [result] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO coupons (
            code, name, description, discount_type, discount_value, minimum_order_amount,
            usage_limit, usage_limit_per_user, starts_at, ends_at, is_active, applies_to, created_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          payload.code,
          payload.name,
          payload.description ?? null,
          payload.discountType,
          payload.discountValue,
          payload.minimumOrderAmount,
          payload.usageLimit ?? null,
          payload.usageLimitPerUser ?? null,
          payload.startsAt ?? null,
          payload.endsAt ?? null,
          payload.isActive ? 1 : 0,
          payload.appliesTo,
          request.adminUser!.id
        ]
      );
      await syncCouponTargets(connection, result.insertId, payload);
      return result.insertId;
    });
    response.status(201).json({ id: couponId });
  })
);

promotionsRouter.put(
  "/coupons/:id",
  requirePermission("promotions.manage"),
  validate(couponSchema),
  asyncHandler(async (request, response) => {
    const couponId = Number(request.params.id);
    const payload = request.body;

    await withTransaction(async (connection) => {
      await connection.execute(
        `
          UPDATE coupons
          SET code = ?, name = ?, description = ?, discount_type = ?, discount_value = ?,
              minimum_order_amount = ?, usage_limit = ?, usage_limit_per_user = ?,
              starts_at = ?, ends_at = ?, is_active = ?, applies_to = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [
          payload.code,
          payload.name,
          payload.description ?? null,
          payload.discountType,
          payload.discountValue,
          payload.minimumOrderAmount,
          payload.usageLimit ?? null,
          payload.usageLimitPerUser ?? null,
          payload.startsAt ?? null,
          payload.endsAt ?? null,
          payload.isActive ? 1 : 0,
          payload.appliesTo,
          couponId
        ]
      );
      await syncCouponTargets(connection, couponId, payload);
    });

    response.json({ message: "Coupon updated" });
  })
);

promotionsRouter.delete(
  "/coupons/:id",
  requirePermission("promotions.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM coupons WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Coupon deleted" });
  })
);
