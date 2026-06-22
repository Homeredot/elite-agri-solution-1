import { Router } from "express";
import { z } from "zod";
import { execute, query, withTransaction } from "../../config/database.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import {
  comparePassword,
  createResetToken,
  hashPassword,
  hashToken,
  signAccessToken
} from "../../utils/security.js";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { createAuditLog } from "../../utils/audit.js";

type AdminUserRow = {
  id: number;
  role_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  password_hash: string;
  status: "active" | "inactive" | "suspended";
  must_change_password: number;
  role_name: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const forgotSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8)
});

const setupAccountSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  password: z.string().min(8)
});

export const authRouter = Router();

authRouter.post(
  "/setup-account",
  validate(setupAccountSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;

    const [superAdminRole] = await query<{ id: number }[]>(
      "SELECT id FROM roles WHERE code = 'super_admin' LIMIT 1"
    );

    if (!superAdminRole) {
      throw new AppError("Super admin role was not found", 500);
    }

    const [{ totalAdmins }] = await query<{ totalAdmins: number }[]>(
      "SELECT COUNT(*) AS totalAdmins FROM admin_users"
    );

    const placeholderHash = "$2y$10$CHANGE_THIS_HASH_IN_APP_LAYER";
    const [placeholderAdmin] = await query<
      {
        id: number;
        email: string;
        first_name: string;
        last_name: string | null;
        must_change_password: number;
        last_login_at: Date | null;
        created_by: number | null;
      }[]
    >(
      `
        SELECT id, email, first_name, last_name, must_change_password, last_login_at, created_by
        FROM admin_users
        WHERE password_hash = ?
        ORDER BY id ASC
        LIMIT 1
      `,
      [placeholderHash]
    );

    const [bootstrapCandidate] = await query<
      {
        id: number;
        email: string;
        first_name: string;
        last_name: string | null;
        must_change_password: number;
        last_login_at: Date | null;
        created_by: number | null;
      }[]
    >(
      `
        SELECT id, email, first_name, last_name, must_change_password, last_login_at, created_by
        FROM admin_users
        WHERE created_by IS NULL
          AND last_login_at IS NULL
          AND must_change_password = 1
        ORDER BY id ASC
        LIMIT 1
      `
    );

    const claimableAdmin = placeholderAdmin ?? bootstrapCandidate;

    const [existingAdmin] = await query<{ id: number }[]>(
      "SELECT id FROM admin_users WHERE email = ? LIMIT 1",
      [payload.email]
    );

    if (existingAdmin && existingAdmin.id !== claimableAdmin?.id) {
      throw new AppError("An admin account with this email already exists", 409);
    }

    if (totalAdmins > 0 && !claimableAdmin) {
      throw new AppError(
        "Admin account creation is closed. Sign in with an existing admin account.",
        403
      );
    }

    const passwordHash = await hashPassword(payload.password);

    let adminUserId: number;

    if (claimableAdmin) {
      await execute(
        `
          UPDATE admin_users
          SET role_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, password_hash = ?,
              status = 'active', must_change_password = 0, email_verified_at = NOW(),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [
          superAdminRole.id,
          payload.firstName,
          payload.lastName ?? null,
          payload.email,
          payload.phone ?? null,
          passwordHash,
          claimableAdmin.id
        ]
      );
      adminUserId = claimableAdmin.id;
    } else {
      const result = await execute(
        `
          INSERT INTO admin_users (
            role_id, first_name, last_name, email, phone, password_hash,
            status, must_change_password, email_verified_at
          ) VALUES (?, ?, ?, ?, ?, ?, 'active', 0, NOW())
        `,
        [
          superAdminRole.id,
          payload.firstName,
          payload.lastName ?? null,
          payload.email,
          payload.phone ?? null,
          passwordHash
        ]
      );
      adminUserId = (result as { insertId: number }).insertId;
    }

    await createAuditLog({
      actionType: "setup_account_created",
      moduleName: "auth",
      targetType: "admin_user",
      targetId: adminUserId,
      description: `Initial admin account created for ${payload.email}`,
      ipAddress: request.ip ?? null,
      userAgent: request.get("user-agent") ?? null,
      newValues: {
        email: payload.email,
        roleCode: "super_admin"
      }
    });

    response.status(201).json({
      message: "Admin account created successfully"
    });
  })
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (request, response) => {
    const { email, password } = request.body;
    const ipAddress = request.ip ?? null;
    const userAgent = request.get("user-agent") ?? null;

    const blockedRows = await query<
      { attempts: number; blocked_until: Date | null }[]
    >(
      `
        SELECT attempts, blocked_until
        FROM failed_login_attempts
        WHERE email = ? AND ip_address = ?
        LIMIT 1
      `,
      [email, ipAddress]
    );

    if (blockedRows[0]?.blocked_until && new Date(blockedRows[0].blocked_until) > new Date()) {
      await execute(
        `
          INSERT INTO admin_login_history (
            email_attempted, ip_address, user_agent, login_status, failure_reason
          ) VALUES (?, ?, ?, 'blocked', ?)
        `,
        [email, ipAddress, userAgent, "Too many failed login attempts"]
      );
      throw new AppError("Account temporarily blocked. Try again later.", 429);
    }

    const users = await query<AdminUserRow[]>(
      `
        SELECT
          u.id,
          u.role_id,
          u.first_name,
          u.last_name,
          u.email,
          u.password_hash,
          u.status,
          u.must_change_password,
          r.name AS role_name
        FROM admin_users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.email = ?
        LIMIT 1
      `,
      [email]
    );

    const user = users[0];

    if (!user || !(await comparePassword(password, user.password_hash))) {
      await execute(
        `
          INSERT INTO admin_login_history (
            email_attempted, ip_address, user_agent, login_status, failure_reason
          ) VALUES (?, ?, ?, 'failed', ?)
          ON DUPLICATE KEY UPDATE email_attempted = VALUES(email_attempted)
        `,
        [email, ipAddress, userAgent, "Invalid credentials"]
      );

      await execute(
        `
          INSERT INTO failed_login_attempts (email, ip_address, attempts, last_attempt_at, blocked_until)
          VALUES (?, ?, 1, NOW(), NULL)
          ON DUPLICATE KEY UPDATE
            attempts = attempts + 1,
            last_attempt_at = NOW(),
            blocked_until = IF(attempts + 1 >= 5, DATE_ADD(NOW(), INTERVAL 15 MINUTE), blocked_until)
        `,
        [email, ipAddress]
      );

      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== "active") {
      throw new AppError("Admin account is not active", 403);
    }

    const accessToken = signAccessToken({ id: user.id, roleId: user.role_id });

    await withTransaction(async (connection) => {
      await connection.execute(
        `
          INSERT INTO admin_sessions (
            admin_user_id, session_token, ip_address, user_agent, is_active, expires_at, last_seen_at
          ) VALUES (?, ?, ?, ?, 1, DATE_ADD(NOW(), INTERVAL 12 HOUR), NOW())
        `,
        [user.id, accessToken, ipAddress, userAgent]
      );

      await connection.execute(
        `
          UPDATE admin_users
          SET last_login_at = NOW(), last_login_ip = ?
          WHERE id = ?
        `,
        [ipAddress, user.id]
      );

      await connection.execute(
        `
          DELETE FROM failed_login_attempts
          WHERE email = ? AND ip_address = ?
        `,
        [email, ipAddress]
      );

      await connection.execute(
        `
          INSERT INTO admin_login_history (
            admin_user_id, email_attempted, ip_address, user_agent, login_status
          ) VALUES (?, ?, ?, ?, 'success')
        `,
        [user.id, email, ipAddress, userAgent]
      );
    });

    response.json({
      token: accessToken,
      mustChangePassword: Boolean(user.must_change_password),
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        roleName: user.role_name
      }
    });
  })
);

authRouter.post(
  "/forgot-password",
  validate(forgotSchema),
  asyncHandler(async (request, response) => {
    const { email } = request.body;
    const users = await query<{ id: number }[]>(
      "SELECT id FROM admin_users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length) {
      const rawToken = createResetToken();
      const tokenHash = hashToken(rawToken);

      await execute(
        `
          INSERT INTO password_resets (
            user_type, email, token_hash, expires_at
          ) VALUES ('admin', ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))
        `,
        [email, tokenHash]
      );

      await createAuditLog({
        actionType: "password_reset_requested",
        moduleName: "auth",
        targetType: "admin_user",
        targetId: users[0].id,
        description: `Password reset requested for ${email}`,
        ipAddress: request.ip ?? null,
        userAgent: request.get("user-agent") ?? null,
        newValues: { resetTokenPreview: rawToken }
      });

      response.json({
        message: "Password reset token generated",
        resetToken: rawToken
      });
      return;
    }

    response.json({
      message: "If the account exists, a reset token has been generated"
    });
  })
);

authRouter.post(
  "/reset-password",
  validate(resetSchema),
  asyncHandler(async (request, response) => {
    const { token, password } = request.body;
    const tokenHash = hashToken(token);

    const rows = await query<{ email: string }[]>(
      `
        SELECT email
        FROM password_resets
        WHERE token_hash = ?
          AND user_type = 'admin'
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY id DESC
        LIMIT 1
      `,
      [tokenHash]
    );

    if (!rows[0]) {
      throw new AppError("Reset token is invalid or expired", 400);
    }

    const passwordHash = await hashPassword(password);

    await withTransaction(async (connection) => {
      await connection.execute(
        `
          UPDATE admin_users
          SET password_hash = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP
          WHERE email = ?
        `,
        [passwordHash, rows[0].email]
      );

      await connection.execute(
        `
          UPDATE password_resets
          SET used_at = NOW()
          WHERE token_hash = ?
        `,
        [tokenHash]
      );
    });

    response.json({ message: "Password has been reset successfully" });
  })
);

authRouter.use(requireAuth);

authRouter.get(
  "/me",
  asyncHandler(async (request, response) => {
    response.json({ user: request.adminUser });
  })
);

authRouter.get(
  "/sessions",
  asyncHandler(async (request, response) => {
    const sessions = await query(
      `
        SELECT id, ip_address, user_agent, is_active, expires_at, last_seen_at, created_at
        FROM admin_sessions
        WHERE admin_user_id = ? AND is_active = 1
        ORDER BY created_at DESC
      `,
      [request.adminUser!.id]
    );

    response.json({ data: sessions });
  })
);

authRouter.post(
  "/logout",
  asyncHandler(async (request, response) => {
    await execute(
      "UPDATE admin_sessions SET is_active = 0 WHERE session_token = ?",
      [request.adminUser!.sessionToken]
    );

    response.json({ message: "Logged out successfully" });
  })
);
