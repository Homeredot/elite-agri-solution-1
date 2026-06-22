import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { sendEmail } from "../../utils/email.js";

const notificationSchema = z
  .object({
    notificationType: z.string().min(2),
    title: z.string().min(2),
    message: z.string().min(2),
    channel: z.enum(["in_app", "email"]).default("in_app"),
    audience: z.enum(["admin_self", "specific_customer", "all_customers"]).default("admin_self"),
    recipientCustomerId: z.coerce.number().int().positive().optional().nullable(),
    relatedType: z.string().optional().nullable(),
    relatedId: z.coerce.number().int().positive().optional().nullable()
  })
  .superRefine((value, context) => {
    if (value.audience === "specific_customer" && !value.recipientCustomerId) {
      context.addIssue({
        code: "custom",
        path: ["recipientCustomerId"],
        message: "Choose a customer for a targeted notification"
      });
    }

    if (value.channel === "email" && value.audience === "admin_self") {
      context.addIssue({
        code: "custom",
        path: ["audience"],
        message: "Email notifications must target a customer or all customers"
      });
    }
  });

type CustomerTarget = {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
};

const getCustomerDisplayName = (customer: CustomerTarget) =>
  `${customer.first_name} ${customer.last_name ?? ""}`.trim();

const buildNotificationEmail = (title: string, message: string) => ({
  subject: title,
  text: `${title}\n\n${message}`,
  html: `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h2 style="margin:0 0 12px;">${title}</h2>
      <p style="margin:0;white-space:pre-wrap;">${message}</p>
    </div>
  `
});

const insertNotificationRecord = async ({
  recipientType,
  recipientAdminUserId,
  recipientCustomerId,
  notificationType,
  title,
  message,
  channel,
  status,
  relatedType,
  relatedId,
  sentAt
}: {
  recipientType: "admin" | "customer";
  recipientAdminUserId?: number | null;
  recipientCustomerId?: number | null;
  notificationType: string;
  title: string;
  message: string;
  channel: "in_app" | "email";
  status: "sent" | "failed";
  relatedType?: string | null;
  relatedId?: number | null;
  sentAt?: Date | null;
}) => {
  await execute(
    `
      INSERT INTO notifications (
        recipient_type, recipient_admin_user_id, recipient_customer_id, notification_type,
        title, message, channel, status, related_type, related_id, sent_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      recipientType,
      recipientAdminUserId ?? null,
      recipientCustomerId ?? null,
      notificationType,
      title,
      message,
      channel,
      status,
      relatedType ?? null,
      relatedId ?? null,
      sentAt ?? null
    ]
  );
};

const getActiveCustomers = () =>
  query<CustomerTarget[]>(
    `
      SELECT id, first_name, last_name, email
      FROM customers
      WHERE deleted_at IS NULL
        AND account_status = 'active'
      ORDER BY first_name ASC, last_name ASC, email ASC
    `
  );

export const notificationsRouter = Router();

notificationsRouter.get(
  "/",
  requirePermission("notifications.manage"),
  asyncHandler(async (request, response) => {
    const adminOnly = request.query.scope !== "all";
    const sql = `
      SELECT
        n.*,
        CASE
          WHEN n.recipient_type = 'admin' THEN TRIM(CONCAT(COALESCE(au.first_name, ''), ' ', COALESCE(au.last_name, '')))
          WHEN n.recipient_customer_id IS NULL THEN 'All customers / visitors'
          ELSE TRIM(CONCAT(COALESCE(c.first_name, ''), ' ', COALESCE(c.last_name, '')))
        END AS recipient_name,
        CASE
          WHEN n.recipient_type = 'admin' THEN au.email
          ELSE c.email
        END AS recipient_email
      FROM notifications n
      LEFT JOIN admin_users au ON au.id = n.recipient_admin_user_id
      LEFT JOIN customers c ON c.id = n.recipient_customer_id
      ${adminOnly ? "WHERE n.recipient_type = 'admin' AND n.recipient_admin_user_id = ?" : ""}
      ORDER BY n.created_at DESC
      LIMIT ${adminOnly ? 100 : 200}
    `;

    const data = await query(sql, adminOnly ? [request.adminUser!.id] : []);
    response.json({ data });
  })
);

notificationsRouter.get(
  "/targets/customers",
  requirePermission("notifications.manage"),
  asyncHandler(async (_request, response) => {
    const customers = await getActiveCustomers();
    response.json({
      data: customers.map((customer) => ({
        id: customer.id,
        name: getCustomerDisplayName(customer),
        email: customer.email
      }))
    });
  })
);

notificationsRouter.post(
  "/",
  requirePermission("notifications.manage"),
  validate(notificationSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;

    if (payload.audience === "admin_self") {
      await insertNotificationRecord({
        recipientType: "admin",
        recipientAdminUserId: request.adminUser!.id,
        notificationType: payload.notificationType,
        title: payload.title,
        message: payload.message,
        channel: "in_app",
        status: "sent",
        relatedType: payload.relatedType ?? null,
        relatedId: payload.relatedId ?? null,
        sentAt: new Date()
      });

      response.status(201).json({ message: "Admin notification created." });
      return;
    }

    if (payload.audience === "specific_customer") {
      const [customer] = await query<CustomerTarget[]>(
        `
          SELECT id, first_name, last_name, email
          FROM customers
          WHERE id = ?
            AND deleted_at IS NULL
            AND account_status = 'active'
          LIMIT 1
        `,
        [payload.recipientCustomerId]
      );

      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      let status: "sent" | "failed" = "sent";
      let message = "Customer notification sent.";

      if (payload.channel === "email") {
        try {
          await sendEmail({
            to: customer.email,
            ...buildNotificationEmail(payload.title, payload.message)
          });
        } catch (error) {
          status = "failed";
          message =
            error instanceof Error ? error.message : "Failed to send customer email notification";
        }
      }

      await insertNotificationRecord({
        recipientType: "customer",
        recipientCustomerId: customer.id,
        notificationType: payload.notificationType,
        title: payload.title,
        message: payload.message,
        channel: payload.channel,
        status,
        relatedType: payload.relatedType ?? null,
        relatedId: payload.relatedId ?? null,
        sentAt: status === "sent" ? new Date() : null
      });

      if (status === "failed") {
        throw new AppError(message, 500);
      }

      response
        .status(201)
        .json({ message: `${payload.channel === "email" ? "Email" : "In-app notification"} sent to ${getCustomerDisplayName(customer)}.` });
      return;
    }

    const customers = await getActiveCustomers();
    if (!customers.length) {
      throw new AppError("No active customers are available", 400);
    }

    if (payload.channel === "in_app") {
      await insertNotificationRecord({
        recipientType: "customer",
        recipientCustomerId: null,
        notificationType: payload.notificationType,
        title: payload.title,
        message: payload.message,
        channel: "in_app",
        status: "sent",
        relatedType: payload.relatedType ?? null,
        relatedId: payload.relatedId ?? null,
        sentAt: new Date()
      });

      response.status(201).json({
        message: "Broadcast notification sent to storefront customers and visitors."
      });
      return;
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const customer of customers) {
      try {
        await sendEmail({
          to: customer.email,
          ...buildNotificationEmail(payload.title, payload.message)
        });

        await insertNotificationRecord({
          recipientType: "customer",
          recipientCustomerId: customer.id,
          notificationType: payload.notificationType,
          title: payload.title,
          message: payload.message,
          channel: "email",
          status: "sent",
          relatedType: payload.relatedType ?? null,
          relatedId: payload.relatedId ?? null,
          sentAt: new Date()
        });

        sentCount += 1;
      } catch {
        await insertNotificationRecord({
          recipientType: "customer",
          recipientCustomerId: customer.id,
          notificationType: payload.notificationType,
          title: payload.title,
          message: payload.message,
          channel: "email",
          status: "failed",
          relatedType: payload.relatedType ?? null,
          relatedId: payload.relatedId ?? null,
          sentAt: null
        });

        failedCount += 1;
      }
    }

    if (!sentCount) {
      throw new AppError("Failed to send email to active customers", 500, {
        sentCount,
        failedCount
      });
    }

    response.status(201).json({
      message:
        failedCount > 0
          ? `Email sent to ${sentCount} customers. ${failedCount} deliveries failed.`
          : `Email sent to ${sentCount} customers.`
    });
  })
);

notificationsRouter.patch(
  "/:id/read",
  requirePermission("notifications.manage"),
  asyncHandler(async (request, response) => {
    await execute(
      `
        UPDATE notifications
        SET status = 'read', read_at = NOW()
        WHERE id = ?
      `,
      [Number(request.params.id)]
    );
    response.json({ message: "Notification marked as read" });
  })
);
