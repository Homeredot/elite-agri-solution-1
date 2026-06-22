import { env } from "../../../config/env.js";
import { AppError } from "../../../utils/app-error.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type PesaPalMethodConfig = {
  base_url?: string;
  consumer_key?: string;
  consumer_secret?: string;
  ipn_url?: string;
  callback_url?: string;
};

type PaymentMethodRecord = {
  id: number;
  name: string;
  code: string;
  provider: "urubuto" | "vpay" | "cash" | "manual" | "other" | "pesapal";
  requires_manual_verification: boolean | number;
  config_json: unknown;
};

export type PesaPalCheckoutInput = {
  orderId: number;
  orderNumber: string;
  transactionId: number;
  totalAmount: number;
  currencyCode: string;
  customer: {
    email: string;
    phone?: string | null;
    firstName: string;
    lastName?: string | null;
  };
  paymentMethod: PaymentMethodRecord;
};

export type PesaPalCheckoutResult = {
  merchantReference: string;
  providerReference: string | null; // order_tracking_id from PesaPal
  redirectUrl: string | null;
  ipnId: string | null;
  callbackUrl: string;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown> | null;
};

export type PesaPalIpnPayload = {
  orderTrackingId: string | null;
  merchantReference: string | null;
  notificationType: string | null;
  raw: Record<string, unknown>;
};

export type PesaPalStatusResult = {
  providerReference: string | null;
  merchantReference: string | null;
  status: "success" | "failed" | "pending";
  raw: Record<string, unknown>;
};

// ─── Token Cache ──────────────────────────────────────────────────────────────

type TokenCache = {
  token: string;
  expiresAt: number; // epoch ms
};

// Cache per consumer_key so multiple configs can coexist
const tokenCache = new Map<string, TokenCache>();

// ─── IPN ID Cache ─────────────────────────────────────────────────────────────

// Maps ipnUrl → notification_id (registered once per process lifetime)
const ipnIdCache = new Map<string, string>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseConfig = (value: unknown): PesaPalMethodConfig => {
  if (!value) return {};
  if (typeof value === "string") {
    try { return JSON.parse(value) as PesaPalMethodConfig; } catch { return {}; }
  }
  return typeof value === "object" ? (value as PesaPalMethodConfig) : {};
};

const getBaseUrl = (config: PesaPalMethodConfig) =>
  (config.base_url ?? env.PESAPAL_BASE_URL).replace(/\/$/, "");

const getConsumerKey = (config: PesaPalMethodConfig) =>
  config.consumer_key ?? env.PESAPAL_CONSUMER_KEY;

const getConsumerSecret = (config: PesaPalMethodConfig) =>
  config.consumer_secret ?? env.PESAPAL_CONSUMER_SECRET;

const pesapalFetch = async (
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Record<string, unknown>> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const body = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      const errMsg =
        (body?.error as Record<string, unknown>)?.message ??
        (body?.message as string) ??
        `PesaPal API error ${response.status}`;
      throw new AppError(String(errMsg), response.status, body);
    }

    return body;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "PesaPal API request failed",
      502,
      error instanceof Error ? error.message : error
    );
  } finally {
    clearTimeout(timeout);
  }
};

// ─── Authentication ───────────────────────────────────────────────────────────

/**
 * Get a valid PesaPal bearer token.
 * Tokens are valid for ~5 minutes. We cache and re-use them until 30s before expiry.
 */
const getPesaPalToken = async (config: PesaPalMethodConfig): Promise<string> => {
  const consumerKey = getConsumerKey(config);
  const consumerSecret = getConsumerSecret(config);
  const baseUrl = getBaseUrl(config);

  if (!consumerKey || !consumerSecret) {
    throw new AppError(
      "PesaPal payment method is missing consumer_key or consumer_secret",
      400
    );
  }

  const cacheKey = consumerKey;
  const cached = tokenCache.get(cacheKey);
  const now = Date.now();

  // Re-use if still valid (with 30 second buffer)
  if (cached && cached.expiresAt - 30_000 > now) {
    return cached.token;
  }

  const body = await pesapalFetch(
    `${baseUrl}/api/Auth/RequestToken`,
    {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret })
    },
    env.PESAPAL_REQUEST_TIMEOUT_MS
  );

  const token = body.token as string | undefined;
  const expiryDate = body.expiryDate as string | undefined;

  if (!token) {
    throw new AppError("PesaPal authentication did not return a token", 502, body);
  }

  // expiryDate is UTC ISO string — parse it, default to 4.5 min if missing
  const expiresAt = expiryDate ? new Date(expiryDate).getTime() : now + 4.5 * 60_000;

  tokenCache.set(cacheKey, { token, expiresAt });

  return token;
};

// ─── IPN Registration ─────────────────────────────────────────────────────────

/**
 * Register the IPN URL with PesaPal once and cache the returned notification_id.
 * PesaPal requires a `notification_id` to be sent with every SubmitOrderRequest.
 */
const getOrRegisterIpnId = async (
  baseUrl: string,
  ipnUrl: string,
  token: string
): Promise<string> => {
  const cached = ipnIdCache.get(ipnUrl);
  if (cached) return cached;

  const body = await pesapalFetch(
    `${baseUrl}/api/URLSetup/RegisterIPN`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "GET" })
    },
    env.PESAPAL_REQUEST_TIMEOUT_MS
  );

  const ipnId = (body.ipn_id ?? body.notification_id) as string | undefined;

  if (!ipnId) {
    throw new AppError("PesaPal IPN registration did not return an ipn_id", 502, body);
  }

  ipnIdCache.set(ipnUrl, ipnId);
  return ipnId;
};

// ─── Checkout ─────────────────────────────────────────────────────────────────

export const initiatePesaPalCheckout = async (
  input: PesaPalCheckoutInput
): Promise<PesaPalCheckoutResult> => {
  const config = parseConfig(input.paymentMethod.config_json);
  const baseUrl = getBaseUrl(config);
  const ipnUrl = config.ipn_url ?? env.PESAPAL_IPN_URL;
  const callbackUrl = config.callback_url ?? env.PESAPAL_CALLBACK_URL;

  // Merchant reference must be ≤50 chars, alphanumeric + dashes/underscores/dots/colons only
  const merchantReference = `PP-${input.orderNumber}-${input.transactionId}`.slice(0, 50);

  const token = await getPesaPalToken(config);
  const ipnId = await getOrRegisterIpnId(baseUrl, ipnUrl, token);

  // Build a callback URL that includes our order context so we can redirect back properly
  const callbackWithContext = (() => {
    const url = new URL(callbackUrl);
    url.searchParams.set("orderId", String(input.orderId));
    url.searchParams.set("orderNumber", input.orderNumber);
    url.searchParams.set("ref", merchantReference);
    return url.toString();
  })();

  const requestPayload: Record<string, unknown> = {
    id: merchantReference,
    currency: input.currencyCode,
    amount: input.totalAmount,
    description: `Payment for order ${input.orderNumber}`.slice(0, 100),
    callback_url: callbackWithContext,
    redirect_mode: "TOP_WINDOW",
    notification_id: ipnId,
    branch: "Elite Agri Solution",
    billing_address: {
      email_address: input.customer.email,
      phone_number: input.customer.phone ?? "",
      country_code: "RW",
      first_name: input.customer.firstName,
      middle_name: "",
      last_name: input.customer.lastName ?? "",
      line_1: "",
      line_2: "",
      city: "",
      state: "",
      postal_code: "",
      zip_code: ""
    }
  };

  const responsePayload = await pesapalFetch(
    `${baseUrl}/api/Transactions/SubmitOrderRequest`,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestPayload)
    },
    env.PESAPAL_REQUEST_TIMEOUT_MS
  );

  const orderTrackingId = responsePayload.order_tracking_id as string | undefined;
  const redirectUrl = responsePayload.redirect_url as string | undefined;

  return {
    merchantReference,
    providerReference: orderTrackingId ?? null,
    redirectUrl: redirectUrl ?? null,
    ipnId,
    callbackUrl: callbackWithContext,
    requestPayload,
    responsePayload
  };
};

// ─── Transaction Status ───────────────────────────────────────────────────────

const normalizePesaPalStatus = (statusCode: string | undefined): "success" | "failed" | "pending" => {
  const s = (statusCode ?? "").toLowerCase();
  if (s === "completed") return "success";
  if (["failed", "invalid", "reversed"].includes(s)) return "failed";
  return "pending";
};

export const fetchPesaPalTransactionStatus = async (
  paymentMethod: PaymentMethodRecord,
  orderTrackingId: string
): Promise<PesaPalStatusResult> => {
  const config = parseConfig(paymentMethod.config_json);
  const baseUrl = getBaseUrl(config);
  const token = await getPesaPalToken(config);

  const url = `${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`;

  const body = await pesapalFetch(
    url,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    },
    env.PESAPAL_REQUEST_TIMEOUT_MS
  );

  return {
    providerReference: (body.order_tracking_id as string) ?? orderTrackingId,
    merchantReference: (body.merchant_reference as string) ?? null,
    status: normalizePesaPalStatus(body.payment_status_description as string | undefined),
    raw: body
  };
};

// ─── IPN / Callback Payload Normalization ─────────────────────────────────────

export const normalizePesaPalIpnPayload = (
  payload: Record<string, unknown>
): PesaPalIpnPayload => ({
  orderTrackingId:
    (payload.OrderTrackingId as string | undefined) ??
    (payload.orderTrackingId as string | undefined) ??
    null,
  merchantReference:
    (payload.OrderMerchantReference as string | undefined) ??
    (payload.orderMerchantReference as string | undefined) ??
    null,
  notificationType:
    (payload.OrderNotificationType as string | undefined) ??
    (payload.orderNotificationType as string | undefined) ??
    null,
  raw: payload
});
