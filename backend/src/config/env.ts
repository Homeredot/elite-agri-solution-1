import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("ecommerce_admin"),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default("12h"),
  RESET_TOKEN_EXPIRES_MINUTES: z.coerce.number().default(30),
  UPLOAD_DIR: z.string().default("uploads"),
  APP_BASE_URL: z.string().url().default("http://localhost:4000"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  SMTP_USE_TLS: z.string().optional(),
  // PesaPal API 3.0
  PESAPAL_BASE_URL: z.string().url().default("https://pay.pesapal.com/v3"),
  PESAPAL_CONSUMER_KEY: z.string().default(""),
  PESAPAL_CONSUMER_SECRET: z.string().default(""),
  PESAPAL_IPN_URL: z.string().url().default("https://api.eliteagrisolution.com/api/store/payments/pesapal/ipn"),
  PESAPAL_CALLBACK_URL: z.string().url().default("https://eliteagrisolution.com/order-success"),
  PESAPAL_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(30000)
});

export const env = envSchema.parse(process.env);
