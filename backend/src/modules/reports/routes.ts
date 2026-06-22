import { Router } from "express";
import { query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";
          const text = String(value).replace(/"/g, "\"\"");
          return `"${text}"`;
        })
        .join(",")
    )
  ];

  return lines.join("\n");
};

export const reportsRouter = Router();

reportsRouter.get(
  "/summary",
  requirePermission("reports.view"),
  asyncHandler(async (_request, response) => {
    const [sales, topProducts, categoryPerformance, customerActivity, payments] = await Promise.all([
      query(
        `
          SELECT DATE(placed_at) AS label, COUNT(*) AS orders, SUM(total_amount) AS revenue
          FROM orders
          WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          GROUP BY DATE(placed_at)
          ORDER BY DATE(placed_at) ASC
        `
      ),
      query("SELECT * FROM vw_top_selling_products LIMIT 10"),
      query(
        `
          SELECT c.name, COUNT(DISTINCT pc.product_id) AS product_count, SUM(p.total_sales) AS total_sales
          FROM categories c
          LEFT JOIN product_categories pc ON pc.category_id = c.id
          LEFT JOIN products p ON p.id = pc.product_id
          GROUP BY c.id, c.name
          ORDER BY total_sales DESC, product_count DESC
        `
      ),
      query(
        `
          SELECT id, first_name, last_name, total_orders, total_spent, last_login_at
          FROM customers
          WHERE deleted_at IS NULL
          ORDER BY total_spent DESC, total_orders DESC
          LIMIT 20
        `
      ),
      query(
        `
          SELECT status, COUNT(*) AS transactions, SUM(amount) AS total_amount
          FROM payment_transactions
          GROUP BY status
        `
      )
    ]);

    response.json({
      data: {
        sales,
        topProducts,
        categoryPerformance,
        customerActivity,
        payments
      }
    });
  })
);

reportsRouter.get(
  "/export",
  requirePermission("reports.view"),
  asyncHandler(async (request, response) => {
    const report = typeof request.query.report === "string" ? request.query.report : "sales";
    let rows: Record<string, unknown>[] = [];

    if (report === "sales") {
      rows = await query<Record<string, unknown>[]>(
        `
          SELECT order_number, order_status, payment_status, delivery_status, total_amount, placed_at
          FROM orders
          ORDER BY placed_at DESC
        `
      );
    } else if (report === "products") {
      rows = await query<Record<string, unknown>[]>(
        `
          SELECT id, name, sku, price, stock_quantity, total_sales, average_rating, status
          FROM products
          WHERE deleted_at IS NULL
          ORDER BY created_at DESC
        `
      );
    } else if (report === "payments") {
      rows = await query<Record<string, unknown>[]>(
        `
          SELECT id, order_id, amount, currency_code, status, transaction_type, created_at
          FROM payment_transactions
          ORDER BY created_at DESC
        `
      );
    } else {
      rows = await query<Record<string, unknown>[]>(
        `
          SELECT id, first_name, last_name, email, total_orders, total_spent, account_status
          FROM customers
          WHERE deleted_at IS NULL
          ORDER BY created_at DESC
        `
      );
    }

    response.setHeader("Content-Type", "text/csv");
    response.setHeader("Content-Disposition", `attachment; filename=${report}-report.csv`);
    response.send(toCsv(rows));
  })
);
