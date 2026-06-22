import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { getPagination } from "../../utils/pagination.js";
import { hashPassword } from "../../utils/security.js";

const statusSchema = z.object({
  accountStatus: z.enum(["active", "blocked", "inactive"])
});

const noteSchema = z.object({
  note: z.string().min(2)
});

export const customersRouter = Router();

customersRouter.get(
  "/",
  requirePermission("customers.view"),
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const status = typeof request.query.status === "string" ? request.query.status : "";
    const params: unknown[] = [];
    const conditions = ["deleted_at IS NULL"];

    if (search) {
      const like = `%${search}%`;
      conditions.push("(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)");
      params.push(like, like, like, like);
    }

    if (status) {
      conditions.push("account_status = ?");
      params.push(status);
    }

    const whereSql = `WHERE ${conditions.join(" AND ")}`;

    const data = await query(
      `
        SELECT
          id, first_name, last_name, email, phone, account_status,
          total_spent, total_orders, last_login_at, created_at
        FROM customers
        ${whereSql}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `SELECT COUNT(*) AS total FROM customers ${whereSql}`,
      params
    );

    response.json({ data, meta: { page, pageSize, total } });
  })
);

customersRouter.get(
  "/:id",
  requirePermission("customers.view"),
  asyncHandler(async (request, response) => {
    const customerId = Number(request.params.id);
    const [customer] = await query<any[]>(
      `
        SELECT *
        FROM customers
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1
      `,
      [customerId]
    );

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    const [orders, notes] = await Promise.all([
      query(
        `
          SELECT id, order_number, order_status, payment_status, total_amount, placed_at
          FROM orders
          WHERE customer_id = ?
          ORDER BY placed_at DESC
        `,
        [customerId]
      ),
      query(
        `
          SELECT cn.*, au.first_name, au.last_name
          FROM customer_notes cn
          INNER JOIN admin_users au ON au.id = cn.admin_user_id
          WHERE cn.customer_id = ?
          ORDER BY cn.created_at DESC
        `,
        [customerId]
      )
    ]);

    response.json({
      data: {
        ...customer,
        orders,
        notes
      }
    });
  })
);

customersRouter.patch(
  "/:id/status",
  requirePermission("customers.manage"),
  validate(statusSchema),
  asyncHandler(async (request, response) => {
    await execute(
      `
        UPDATE customers
        SET account_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [request.body.accountStatus, Number(request.params.id)]
    );
    response.json({ message: "Customer status updated" });
  })
);

customersRouter.post(
  "/:id/notes",
  requirePermission("customers.manage"),
  validate(noteSchema),
  asyncHandler(async (request, response) => {
    await execute(
      `
        INSERT INTO customer_notes (customer_id, admin_user_id, note)
        VALUES (?, ?, ?)
      `,
      [Number(request.params.id), request.adminUser!.id, request.body.note]
    );
    response.status(201).json({ message: "Customer note added" });
  })
);

customersRouter.post(
  "/:id/reset-password",
  requirePermission("customers.manage"),
  asyncHandler(async (request, response) => {
    const customerId = Number(request.params.id);
    const temporaryPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(temporaryPassword);

    await execute(
      `
        UPDATE customers
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [passwordHash, customerId]
    );

    response.json({
      message: "Customer password reset",
      temporaryPassword
    });
  })
);
