import PDFDocument from "pdfkit";
import { Router } from "express";
import { z } from "zod";
import { execute, query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { applyOrderStatusPatch } from "./workflow.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { getPagination } from "../../utils/pagination.js";

const statusSchema = z.object({
  orderStatus: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"])
    .optional(),
  paymentStatus: z
    .enum(["pending", "paid", "failed", "refunded", "partially_refunded"])
    .optional(),
  deliveryStatus: z
    .enum(["pending", "assigned", "in_transit", "delivered", "failed", "returned"])
    .optional(),
  note: z.string().optional().nullable()
});

const noteSchema = z.object({
  note: z.string().min(2),
  isInternal: z.boolean().default(true)
});

const refundSchema = z.object({
  amount: z.coerce.number().positive(),
  reason: z.string().optional().nullable(),
  status: z.enum(["requested", "approved", "rejected", "processed", "failed"]).default("requested")
});

export const ordersRouter = Router();

ordersRouter.get(
  "/",
  requirePermission("orders.view"),
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const orderStatus = typeof request.query.orderStatus === "string" ? request.query.orderStatus : "";
    const paymentStatus = typeof request.query.paymentStatus === "string" ? request.query.paymentStatus : "";
    const deliveryStatus =
      typeof request.query.deliveryStatus === "string" ? request.query.deliveryStatus : "";

    const params: unknown[] = [];
    const conditions = ["1 = 1"];

    if (search) {
      const like = `%${search}%`;
      conditions.push(
        "(o.order_number LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ? OR o.billing_email LIKE ?)"
      );
      params.push(like, like, like, like);
    }

    if (orderStatus) {
      conditions.push("o.order_status = ?");
      params.push(orderStatus);
    }

    if (paymentStatus) {
      conditions.push("o.payment_status = ?");
      params.push(paymentStatus);
    }

    if (deliveryStatus) {
      conditions.push("o.delivery_status = ?");
      params.push(deliveryStatus);
    }

    const whereSql = `WHERE ${conditions.join(" AND ")}`;

    const data = await query(
      `
        SELECT
          o.id,
          o.order_number,
          o.order_status,
          o.payment_status,
          o.delivery_status,
          o.total_amount,
          o.placed_at,
          CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        ${whereSql}
        ORDER BY o.placed_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `
        SELECT COUNT(*) AS total
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        ${whereSql}
      `,
      params
    );

    response.json({
      data,
      meta: { page, pageSize, total }
    });
  })
);

ordersRouter.get(
  "/:id",
  requirePermission("orders.view"),
  asyncHandler(async (request, response) => {
    const orderId = Number(request.params.id);
    const [order] = await query<any[]>(
      `
        SELECT
          o.*,
          CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name,
          c.email AS customer_email,
          c.phone AS customer_phone
        FROM orders o
        INNER JOIN customers c ON c.id = o.customer_id
        WHERE o.id = ?
        LIMIT 1
      `,
      [orderId]
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const [items, notes, timeline, payments, refunds] = await Promise.all([
      query("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC", [orderId]),
      query(
        `
          SELECT onote.*, au.first_name, au.last_name
          FROM order_notes onote
          INNER JOIN admin_users au ON au.id = onote.admin_user_id
          WHERE onote.order_id = ?
          ORDER BY onote.created_at DESC
        `,
        [orderId]
      ),
      query("SELECT * FROM order_timeline WHERE order_id = ? ORDER BY changed_at DESC", [orderId]),
      query(
        `
          SELECT pt.*, pm.name AS payment_method_name
          FROM payment_transactions pt
          INNER JOIN payment_methods pm ON pm.id = pt.payment_method_id
          WHERE pt.order_id = ?
          ORDER BY pt.created_at DESC
        `,
        [orderId]
      ),
      query("SELECT * FROM refunds WHERE order_id = ? ORDER BY created_at DESC", [orderId])
    ]);

    response.json({
      data: {
        ...order,
        items,
        notes,
        timeline,
        payments,
        refunds
      }
    });
  })
);

ordersRouter.patch(
  "/:id/status",
  requirePermission("orders.update"),
  validate(statusSchema),
  asyncHandler(async (request, response) => {
    const orderId = Number(request.params.id);
    const payload = request.body;

    await withTransaction(async (connection) => {
      await applyOrderStatusPatch(connection, {
        orderId,
        orderStatus: payload.orderStatus,
        paymentStatus: payload.paymentStatus,
        deliveryStatus: payload.deliveryStatus,
        note: payload.note,
        changedBy: request.adminUser!.id
      });
    });

    response.json({ message: "Order status updated" });
  })
);

ordersRouter.post(
  "/:id/notes",
  requirePermission("orders.update"),
  validate(noteSchema),
  asyncHandler(async (request, response) => {
    await execute(
      `
        INSERT INTO order_notes (order_id, admin_user_id, note, is_internal)
        VALUES (?, ?, ?, ?)
      `,
      [
        Number(request.params.id),
        request.adminUser!.id,
        request.body.note,
        request.body.isInternal ? 1 : 0
      ]
    );

    response.status(201).json({ message: "Order note added" });
  })
);

ordersRouter.post(
  "/:id/refunds",
  requirePermission("orders.update", "payments.manage"),
  validate(refundSchema),
  asyncHandler(async (request, response) => {
    const orderId = Number(request.params.id);
    const payload = request.body;

    await execute(
      `
        INSERT INTO refunds (
          order_id, requested_by, reason, status, amount, processed_by, processed_at
        ) VALUES (?, 'admin', ?, ?, ?, ?, ?)
      `,
      [
        orderId,
        payload.reason ?? null,
        payload.status,
        payload.amount,
        payload.status === "processed" ? request.adminUser!.id : null,
        payload.status === "processed" ? new Date() : null
      ]
    );

    response.status(201).json({ message: "Refund request recorded" });
  })
);

ordersRouter.get(
  "/:id/invoice",
  requirePermission("orders.view"),
  asyncHandler(async (request, response) => {
    const orderId = Number(request.params.id);
    const [order] = await query<any[]>(
      `
        SELECT *
        FROM orders
        WHERE id = ?
        LIMIT 1
      `,
      [orderId]
    );
    const items = await query<any[]>(
      "SELECT product_name, sku, quantity, unit_price, line_total FROM order_items WHERE order_id = ?",
      [orderId]
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (request.query.format === "pdf") {
      response.setHeader("Content-Type", "application/pdf");
      response.setHeader(
        "Content-Disposition",
        `inline; filename=invoice-${order.order_number}.pdf`
      );

      const doc = new PDFDocument({ margin: 40 });
      doc.pipe(response);
      doc.fontSize(20).text(`Invoice ${order.order_number}`);
      doc.moveDown();
      doc.fontSize(12).text(`Customer: ${order.billing_first_name} ${order.billing_last_name ?? ""}`);
      doc.text(`Email: ${order.billing_email}`);
      doc.text(`Placed at: ${order.placed_at}`);
      doc.moveDown();
      items.forEach((item) => {
        doc.text(
          `${item.product_name} (${item.sku}) x${item.quantity} - ${order.currency_code} ${item.line_total}`
        );
      });
      doc.moveDown();
      doc.fontSize(14).text(`Total: ${order.currency_code} ${order.total_amount}`);
      doc.end();
      return;
    }

    response.type("html").send(`
      <html>
        <head><title>Invoice ${order.order_number}</title></head>
        <body style="font-family:Arial,sans-serif;padding:24px;">
          <h1>Invoice ${order.order_number}</h1>
          <p><strong>Customer:</strong> ${order.billing_first_name} ${order.billing_last_name ?? ""}</p>
          <p><strong>Email:</strong> ${order.billing_email}</p>
          <p><strong>Status:</strong> ${order.order_status}</p>
          <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse;width:100%;">
            <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              ${items
                .map(
                  (item) =>
                    `<tr><td>${item.product_name}</td><td>${item.sku}</td><td>${item.quantity}</td><td>${order.currency_code} ${item.line_total}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <h3>Total: ${order.currency_code} ${order.total_amount}</h3>
        </body>
      </html>
    `);
  })
);
