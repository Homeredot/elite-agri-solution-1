import { Router } from "express";
import { z } from "zod";
import { execute, query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { createAuditLog } from "../../utils/audit.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { getPagination } from "../../utils/pagination.js";
import { hashPassword } from "../../utils/security.js";

const adminSchema = z.object({
  roleId: z.coerce.number().int().positive(),
  firstName: z.string().min(2),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  password: z.string().min(8).optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  mustChangePassword: z.boolean().default(false)
});

const permissionsSchema = z.object({
  permissionIds: z.array(z.coerce.number().int().positive())
});

export const adminRouter = Router();

adminRouter.get(
  "/users",
  requirePermission("admins.manage"),
  asyncHandler(async (request, response) => {
    const { page, limit, offset, pageSize } = getPagination(request.query);
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const like = `%${search}%`;

    const whereSql = search
      ? "WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR r.name LIKE ?"
      : "";
    const params = search ? [like, like, like, like] : [];

    const data = await query(
      `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.status,
          u.must_change_password,
          u.last_login_at,
          r.name AS role_name
        FROM admin_users u
        INNER JOIN roles r ON r.id = u.role_id
        ${whereSql}
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `
        SELECT COUNT(*) AS total
        FROM admin_users u
        INNER JOIN roles r ON r.id = u.role_id
        ${whereSql}
      `,
      params
    );

    response.json({
      data,
      meta: {
        page,
        pageSize,
        total
      }
    });
  })
);

adminRouter.post(
  "/users",
  requirePermission("admins.manage"),
  validate(adminSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const passwordHash = await hashPassword(payload.password ?? "ChangeMe123!");

    const result = await execute(
      `
        INSERT INTO admin_users (
          role_id, first_name, last_name, email, phone,
          password_hash, status, must_change_password, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.roleId,
        payload.firstName,
        payload.lastName ?? null,
        payload.email,
        payload.phone ?? null,
        passwordHash,
        payload.status,
        payload.mustChangePassword ? 1 : 0,
        request.adminUser!.id
      ]
    );

    await createAuditLog({
      adminUserId: request.adminUser!.id,
      actionType: "create",
      moduleName: "admins",
      targetType: "admin_user",
      targetId: (result as { insertId: number }).insertId,
      description: `Created admin user ${payload.email}`,
      ipAddress: request.ip ?? null,
      userAgent: request.get("user-agent") ?? null,
      newValues: payload
    });

    response.status(201).json({ message: "Admin user created" });
  })
);

adminRouter.get(
  "/users/:id",
  requirePermission("admins.manage"),
  asyncHandler(async (request, response) => {
    const rows = await query(
      `
        SELECT
          u.id,
          u.role_id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.avatar_url,
          u.status,
          u.must_change_password,
          u.last_login_at,
          r.name AS role_name
        FROM admin_users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = ?
        LIMIT 1
      `,
      [Number(request.params.id)]
    );

    if (!rows[0]) {
      throw new AppError("Admin user not found", 404);
    }

    response.json({ data: rows[0] });
  })
);

adminRouter.put(
  "/users/:id",
  requirePermission("admins.manage"),
  validate(adminSchema.omit({ password: true })),
  asyncHandler(async (request, response) => {
    const adminId = Number(request.params.id);
    const payload = request.body;

    await execute(
      `
        UPDATE admin_users
        SET role_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
            status = ?, must_change_password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.roleId,
        payload.firstName,
        payload.lastName ?? null,
        payload.email,
        payload.phone ?? null,
        payload.status,
        payload.mustChangePassword ? 1 : 0,
        adminId
      ]
    );

    response.json({ message: "Admin user updated" });
  })
);

adminRouter.post(
  "/users/:id/reset-password",
  requirePermission("admins.manage"),
  asyncHandler(async (request, response) => {
    const adminId = Number(request.params.id);
    const temporaryPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(temporaryPassword);

    await execute(
      `
        UPDATE admin_users
        SET password_hash = ?, must_change_password = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [passwordHash, adminId]
    );

    response.json({
      message: "Password reset successfully",
      temporaryPassword
    });
  })
);

adminRouter.get(
  "/roles",
  requirePermission("roles.manage", "admins.manage"),
  asyncHandler(async (_request, response) => {
    const roles = await query(
      `
        SELECT id, name, code, description, is_system_role
        FROM roles
        ORDER BY name ASC
      `
    );
    response.json({ data: roles });
  })
);

adminRouter.get(
  "/permissions",
  requirePermission("roles.manage", "admins.manage"),
  asyncHandler(async (_request, response) => {
    const permissions = await query(
      `
        SELECT id, module, action, permission_key, description
        FROM permissions
        ORDER BY module ASC, action ASC
      `
    );
    response.json({ data: permissions });
  })
);

adminRouter.get(
  "/roles/:id/permissions",
  requirePermission("roles.manage"),
  asyncHandler(async (request, response) => {
    const permissions = await query(
      `
        SELECT rp.permission_id
        FROM role_permissions rp
        WHERE rp.role_id = ? AND rp.allowed = 1
      `,
      [Number(request.params.id)]
    );

    response.json({
      data: permissions.map((item) => (item as { permission_id: number }).permission_id)
    });
  })
);

adminRouter.put(
  "/roles/:id/permissions",
  requirePermission("roles.manage"),
  validate(permissionsSchema),
  asyncHandler(async (request, response) => {
    const roleId = Number(request.params.id);
    const { permissionIds } = request.body;

    await withTransaction(async (connection) => {
      await connection.execute("DELETE FROM role_permissions WHERE role_id = ?", [roleId]);

      for (const permissionId of permissionIds) {
        await connection.execute(
          `
            INSERT INTO role_permissions (role_id, permission_id, allowed)
            VALUES (?, ?, 1)
          `,
          [roleId, permissionId]
        );
      }
    });

    response.json({ message: "Role permissions updated" });
  })
);
