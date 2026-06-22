import type { PoolConnection } from "mysql2/promise";
import { execute } from "../config/database.js";

type AuditPayload = {
  adminUserId?: number | null;
  actionType: string;
  moduleName: string;
  targetType?: string | null;
  targetId?: number | null;
  description?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export const createAuditLog = async (
  payload: AuditPayload,
  connection?: PoolConnection
) => {
  const params = [
    payload.adminUserId ?? null,
    payload.actionType,
    payload.moduleName,
    payload.targetType ?? null,
    payload.targetId ?? null,
    payload.description ?? null,
    payload.oldValues ? JSON.stringify(payload.oldValues) : null,
    payload.newValues ? JSON.stringify(payload.newValues) : null,
    payload.ipAddress ?? null,
    payload.userAgent ?? null
  ];

  const sql = `
    INSERT INTO audit_logs (
      admin_user_id, action_type, module_name, target_type, target_id,
      description, old_values, new_values, ip_address, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  if (connection) {
    await connection.execute(sql, params);
    return;
  }

  await execute(sql, params);
};
