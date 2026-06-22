import { Router } from "express";
import { query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const auditRouter = Router();

auditRouter.get(
  "/logs",
  requirePermission("audit.view"),
  asyncHandler(async (_request, response) => {
    response.json({
      data: await query(
        `
          SELECT al.*, CONCAT(au.first_name, ' ', COALESCE(au.last_name, '')) AS admin_name
          FROM audit_logs al
          LEFT JOIN admin_users au ON au.id = al.admin_user_id
          ORDER BY al.created_at DESC
          LIMIT 200
        `
      )
    });
  })
);

auditRouter.get(
  "/login-history",
  requirePermission("audit.view"),
  asyncHandler(async (_request, response) => {
    response.json({
      data: await query(
        `
          SELECT *
          FROM admin_login_history
          ORDER BY created_at DESC
          LIMIT 200
        `
      )
    });
  })
);

auditRouter.get(
  "/failed-logins",
  requirePermission("audit.view"),
  asyncHandler(async (_request, response) => {
    response.json({
      data: await query(
        `
          SELECT *
          FROM failed_login_attempts
          ORDER BY updated_at DESC
          LIMIT 200
        `
      )
    });
  })
);
