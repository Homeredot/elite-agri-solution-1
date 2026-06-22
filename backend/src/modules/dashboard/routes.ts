import { Router } from "express";
import { query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/overview",
  requirePermission("dashboard.view"),
  asyncHandler(async (_request, response) => {
    const [summary] = await query<Record<string, number>[]>(
      "SELECT * FROM vw_dashboard_summary LIMIT 1"
    );

    const recentOrders = await query(
      `
        SELECT
          o.id,
          o.order_number,
          o.total_amount,
          o.order_status,
          o.payment_status,
          o.delivery_status,
          o.placed_at,
          CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        ORDER BY o.placed_at DESC
        LIMIT 10
      `
    );

    const lowStock = await query(
      `
        SELECT * FROM vw_low_stock_products
        LIMIT 10
      `
    );

    const topSelling = await query(
      `
        SELECT * FROM vw_top_selling_products
        LIMIT 10
      `
    );

    const salesAnalytics = await query(
      `
        SELECT
          DATE(placed_at) AS label,
          COUNT(*) AS total_orders,
          COALESCE(SUM(total_amount), 0) AS total_sales
        FROM orders
        WHERE placed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(placed_at)
        ORDER BY DATE(placed_at) ASC
      `
    );

    response.json({
      summary,
      recentOrders,
      lowStock,
      topSelling,
      salesAnalytics,
      quickActions: [
        { label: "Add Product", href: "/catalog" },
        { label: "Create Coupon", href: "/promotions" },
        { label: "Review Orders", href: "/orders" },
        { label: "Update Homepage", href: "/content" }
      ]
    });
  })
);
