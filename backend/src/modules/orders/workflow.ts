import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { AppError } from "../../utils/app-error.js";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed"
  | "returned";

type PaymentProvider = "cash" | "manual" | "other" | "pesapal";

type OrderWorkflowRow = RowDataPacket & {
  order_id: number;
  order_number: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  payment_method_id: number | null;
  payment_provider: PaymentProvider | null;
  requires_manual_verification: number | boolean | null;
};

export type OrderWorkflowContext = {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentMethodId: number | null;
  paymentProvider: PaymentProvider | null;
  requiresManualVerification: boolean;
};

type OrderStatusPatchInput = {
  orderId: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: DeliveryStatus;
  note?: string | null;
  changedBy: number | null;
};

type PaymentSyncInput = {
  orderId: number;
  paymentStatus: PaymentStatus;
  note?: string | null;
  changedBy: number | null;
};

const ORDER_PROGRESS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

const getProgressIndex = (status: OrderStatus) => ORDER_PROGRESS.indexOf(status);

export const getOrderWorkflowContext = async (
  connection: PoolConnection,
  orderId: number
): Promise<OrderWorkflowContext> => {
  const [rows] = await connection.query<OrderWorkflowRow[]>(
    `
      SELECT
        o.id AS order_id,
        o.order_number,
        o.order_status,
        o.payment_status,
        o.delivery_status,
        pt.payment_method_id,
        pm.provider AS payment_provider,
        pm.requires_manual_verification
      FROM orders o
      LEFT JOIN payment_transactions pt ON pt.id = (
        SELECT latest.id
        FROM payment_transactions latest
        WHERE latest.order_id = o.id
          AND latest.transaction_type = 'charge'
        ORDER BY latest.created_at DESC, latest.id DESC
        LIMIT 1
      )
      LEFT JOIN payment_methods pm ON pm.id = pt.payment_method_id
      WHERE o.id = ?
      LIMIT 1
    `,
      [orderId]
    );

  const order = rows[0];

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return {
    orderId: order.order_id,
    orderNumber: order.order_number,
    orderStatus: order.order_status,
    paymentStatus: order.payment_status,
    deliveryStatus: order.delivery_status,
    paymentMethodId: order.payment_method_id,
    paymentProvider: order.payment_provider,
    requiresManualVerification: Boolean(order.requires_manual_verification)
  };
};

const validateOrderStateTransition = (
  current: OrderWorkflowContext,
  next: Pick<OrderWorkflowContext, "orderStatus" | "paymentStatus" | "deliveryStatus">
) => {
  if (current.orderStatus === "cancelled" && next.orderStatus !== "cancelled") {
    throw new AppError("Cancelled orders cannot be reopened", 400);
  }

  if (current.orderStatus === "refunded" && next.orderStatus !== "refunded") {
    throw new AppError("Refunded orders cannot be moved back into fulfillment", 400);
  }

  const currentProgressIndex = getProgressIndex(current.orderStatus);
  const nextProgressIndex = getProgressIndex(next.orderStatus);

  if (currentProgressIndex >= 0 && nextProgressIndex >= 0 && nextProgressIndex < currentProgressIndex) {
    throw new AppError("Order fulfillment cannot move backwards", 400);
  }

  if (next.orderStatus === "processing" && !["confirmed", "processing"].includes(current.orderStatus)) {
    throw new AppError("Only confirmed orders can move into processing", 400);
  }

  if (next.orderStatus === "shipped" && !["processing", "shipped"].includes(current.orderStatus)) {
    throw new AppError("Only processing orders can be marked shipped", 400);
  }

  if (next.orderStatus === "delivered" && !["shipped", "delivered"].includes(current.orderStatus)) {
    throw new AppError("Only shipped orders can be marked delivered", 400);
  }

  if (next.orderStatus === "cancelled" && ["delivered", "refunded"].includes(current.orderStatus)) {
    throw new AppError("Delivered or refunded orders cannot be cancelled", 400);
  }

  if (next.orderStatus === "shipped" && next.deliveryStatus !== "in_transit") {
    throw new AppError("Shipped orders must also be in transit", 400);
  }

  if (next.orderStatus === "delivered" && next.deliveryStatus !== "delivered") {
    throw new AppError("Delivered orders must also be marked delivered for delivery", 400);
  }

  if (next.deliveryStatus === "in_transit" && !["shipped", "delivered"].includes(next.orderStatus)) {
    throw new AppError("Delivery cannot be in transit before the order is shipped", 400);
  }

  if (next.deliveryStatus === "delivered" && next.orderStatus !== "delivered") {
    throw new AppError("Delivery can only be marked delivered when the order is delivered", 400);
  }

  const canFulfillBeforePaid = current.paymentProvider === "cash";
  const requiresPaidForFulfillment =
    ["processing", "shipped"].includes(next.orderStatus) && !canFulfillBeforePaid;

  if (requiresPaidForFulfillment && next.paymentStatus !== "paid") {
    throw new AppError("Payment must be verified before fulfillment can continue", 400);
  }

  if (next.orderStatus === "delivered" && next.paymentStatus !== "paid") {
    throw new AppError("Orders cannot be marked delivered before payment is complete", 400);
  }

  if (next.paymentStatus === "failed" && ["shipped", "delivered"].includes(next.orderStatus)) {
    throw new AppError("Failed payments cannot stay in shipped or delivered state", 400);
  }
};

const insertTimelineEntries = async (
  connection: PoolConnection,
  orderId: number,
  current: OrderWorkflowContext,
  next: Pick<OrderWorkflowContext, "orderStatus" | "paymentStatus" | "deliveryStatus">,
  note: string | null | undefined,
  changedBy: number | null
) => {
  const timelineEntries = [
    ["order", current.orderStatus, next.orderStatus],
    ["payment", current.paymentStatus, next.paymentStatus],
    ["delivery", current.deliveryStatus, next.deliveryStatus]
  ].filter(
    (entry): entry is [string, string, string] => entry[1] !== entry[2]
  );

  for (const [statusType, oldStatus, newStatus] of timelineEntries) {
    await connection.execute(
      `
        INSERT INTO order_timeline (
          order_id, status_type, old_status, new_status, description, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        orderId,
        statusType,
        oldStatus,
        newStatus,
        note ?? `${statusType} status updated`,
        changedBy
      ]
    );
  }
};

export const applyOrderStatusPatch = async (
  connection: PoolConnection,
  input: OrderStatusPatchInput
): Promise<OrderWorkflowContext> => {
  const current = await getOrderWorkflowContext(connection, input.orderId);

  const next = {
    orderStatus:
      input.orderStatus ??
      (input.paymentStatus === "paid" && current.orderStatus === "pending"
        ? "confirmed"
        : current.orderStatus),
    paymentStatus: input.paymentStatus ?? current.paymentStatus,
    deliveryStatus: input.deliveryStatus ?? current.deliveryStatus
  };

  validateOrderStateTransition(current, next);

  const hasStateChange =
    next.orderStatus !== current.orderStatus ||
    next.paymentStatus !== current.paymentStatus ||
    next.deliveryStatus !== current.deliveryStatus;

  if (hasStateChange) {
    await connection.execute(
      `
        UPDATE orders
        SET order_status = ?, payment_status = ?, delivery_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [next.orderStatus, next.paymentStatus, next.deliveryStatus, input.orderId]
    );

    await insertTimelineEntries(connection, input.orderId, current, next, input.note, input.changedBy);
  }

  if (input.note) {
    await connection.execute(
      `
        INSERT INTO order_notes (order_id, admin_user_id, note, is_internal)
        VALUES (?, ?, ?, 1)
      `,
      [input.orderId, input.changedBy, input.note]
    );
  }

  return {
    ...current,
    orderStatus: next.orderStatus,
    paymentStatus: next.paymentStatus,
    deliveryStatus: next.deliveryStatus
  };
};

export const syncOrderPaymentStatus = async (
  connection: PoolConnection,
  input: PaymentSyncInput
) => {
  return applyOrderStatusPatch(connection, {
    orderId: input.orderId,
    paymentStatus: input.paymentStatus,
    note: input.note,
    changedBy: input.changedBy
  });
};
