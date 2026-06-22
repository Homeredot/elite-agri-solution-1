import { Router } from "express";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import { execute, query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getPagination } from "../../utils/pagination.js";
import { AppError } from "../../utils/app-error.js";
import { syncOrderPaymentStatus } from "../orders/workflow.js";

const paymentMethodSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  provider: z.enum(["cash", "manual", "other", "pesapal"]),
  isEnabled: z.boolean().default(true),
  requiresManualVerification: z.boolean().default(false),
  configJson: z.record(z.any()).default({})
});

const refundUpdateSchema = z.object({
  status: z.enum(["requested", "approved", "rejected", "processed", "failed"]),
  amount: z.coerce.number().positive().optional()
});

type ManualVerifyRow = RowDataPacket & {
  id: number;
  order_id: number;
  status: string;
  payment_method_name: string;
};

export const paymentsRouter = Router();

paymentsRouter.post(
  "/methods",
  requirePermission("payments.manage"),
  validate(paymentMethodSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO payment_methods (
          name, code, provider, is_enabled, requires_manual_verification, config_json
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        payload.name,
        payload.code,
        payload.provider,
        payload.isEnabled ? 1 : 0,
        payload.requiresManualVerification ? 1 : 0,
        JSON.stringify(payload.configJson)
      ]
    );
    response.status(201).json({ message: "Payment method created" });
  })
);

paymentsRouter.get(
  "/methods",
  requirePermission("payments.view", "payments.manage"),
  asyncHandler(async (_request, response) => {
    const methods = await query("SELECT * FROM payment_methods ORDER BY created_at ASC");
    response.json({ data: methods });
  })
);

paymentsRouter.put(
  "/methods/:id",
  requirePermission("payments.manage"),
  validate(paymentMethodSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE payment_methods
        SET name = ?, code = ?, provider = ?, is_enabled = ?, requires_manual_verification = ?,
            config_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.name,
        payload.code,
        payload.provider,
        payload.isEnabled ? 1 : 0,
        payload.requiresManualVerification ? 1 : 0,
        JSON.stringify(payload.configJson),
        Number(request.params.id)
      ]
    );
    response.json({ message: "Payment method updated" });
  })
);

paymentsRouter.delete(
  "/methods/:id",
  requirePermission("payments.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM payment_methods WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Payment method deleted" });
  })
);

paymentsRouter.get(
  "/transactions",
  requirePermission("payments.view"),
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const status = typeof request.query.status === "string" ? request.query.status : "";
    const whereSql = status ? "WHERE pt.status = ?" : "";
    const params = status ? [status] : [];

    const data = await query(
      `
        SELECT
          pt.*,
          pm.name AS payment_method_name,
          o.order_number
        FROM payment_transactions pt
        INNER JOIN payment_methods pm ON pm.id = pt.payment_method_id
        INNER JOIN orders o ON o.id = pt.order_id
        ${whereSql}
        ORDER BY pt.created_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM payment_transactions pt ${whereSql}`,
      params
    );

    response.json({ data, meta: { page, pageSize, total } });
  })
);

paymentsRouter.get(
  "/failed",
  requirePermission("payments.view"),
  asyncHandler(async (_request, response) => {
    const data = await query(
      `
        SELECT *
        FROM payment_transactions
        WHERE status = 'failed'
        ORDER BY created_at DESC
      `
    );
    response.json({ data });
  })
);

paymentsRouter.post(
  "/transactions/:id/manual-verify",
  requirePermission("payments.manage"),
  asyncHandler(async (request, response) => {
    const transactionId = Number(request.params.id);

    await withTransaction(async (connection) => {
      const [rows] = await connection.query<ManualVerifyRow[]>(
        `
          SELECT
            pt.id,
            pt.order_id,
            pt.status,
            pm.name AS payment_method_name
          FROM payment_transactions pt
          INNER JOIN payment_methods pm ON pm.id = pt.payment_method_id
          WHERE pt.id = ?
          LIMIT 1
        `,
        [transactionId]
      );
      const transaction = rows[0];

      if (!transaction) {
        throw new AppError("Transaction not found", 404);
      }

      await connection.execute(
        `
          UPDATE payment_transactions
          SET status = 'success', verified_manually_by = ?, verified_at = NOW(), updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [request.adminUser!.id, transactionId]
      );

      await syncOrderPaymentStatus(connection, {
        orderId: transaction.order_id,
        paymentStatus: "paid",
        note: `${transaction.payment_method_name} payment manually verified`,
        changedBy: request.adminUser!.id
      });
    });

    response.json({ message: "Transaction manually verified" });
  })
);

paymentsRouter.get(
  "/refunds",
  requirePermission("payments.view", "payments.manage"),
  asyncHandler(async (_request, response) => {
    const refunds = await query(
      `
        SELECT r.*, o.order_number
        FROM refunds r
        INNER JOIN orders o ON o.id = r.order_id
        ORDER BY r.created_at DESC
      `
    );
    response.json({ data: refunds });
  })
);

paymentsRouter.patch(
  "/refunds/:id",
  requirePermission("payments.manage"),
  validate(refundUpdateSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE refunds
        SET status = ?, amount = COALESCE(?, amount), processed_by = ?, processed_at = NOW(), updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [payload.status, payload.amount ?? null, request.adminUser!.id, Number(request.params.id)]
    );
    response.json({ message: "Refund updated" });
  })
);
