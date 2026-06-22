import type { NextFunction, Request, Response } from "express";
import { query } from "../config/database.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyAccessToken } from "../utils/security.js";

type SessionRow = {
  id: number;
  admin_user_id: number;
  role_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  role_name: string;
  session_token: string;
};

type PermissionRow = {
  permission_key: string;
};

export const requireAuth = asyncHandler(async (request: Request, _response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  const payload = verifyAccessToken(token);

  if (payload.scope && payload.scope !== "admin") {
    throw new AppError("Invalid admin token", 401);
  }

  const sessions = await query<SessionRow[]>(
    `
      SELECT
        s.id,
        s.admin_user_id,
        s.session_token,
        u.role_id,
        u.first_name,
        u.last_name,
        u.email,
        r.name AS role_name
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.admin_user_id
      INNER JOIN roles r ON r.id = u.role_id
      WHERE s.admin_user_id = ?
        AND s.session_token = ?
        AND s.is_active = 1
        AND s.expires_at > NOW()
        AND u.status = 'active'
      LIMIT 1
    `,
    [payload.id, token]
  );

  const session = sessions[0];

  if (!session) {
    throw new AppError("Session is invalid or expired", 401);
  }

  const permissions = await query<PermissionRow[]>(
    `
      SELECT p.permission_key
      FROM role_permissions rp
      INNER JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = ?
        AND rp.allowed = 1
    `,
    [session.role_id]
  );

  request.adminUser = {
    id: session.admin_user_id,
    roleId: session.role_id,
    firstName: session.first_name,
    lastName: session.last_name,
    email: session.email,
    roleName: session.role_name,
    permissions: permissions.map((item) => item.permission_key),
    sessionToken: session.session_token
  };

  await query(
    "UPDATE admin_sessions SET last_seen_at = NOW() WHERE id = ?",
    [session.id]
  );

  next();
});
