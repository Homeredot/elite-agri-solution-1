import type { NextFunction, Request, Response } from "express";
import { query } from "../config/database.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyAccessToken } from "../utils/security.js";

type CustomerRow = {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  account_status: "active" | "inactive" | "blocked";
  total_orders: number;
  total_spent: number;
};

export const resolveCustomerAuth = async (request: Request) => {
  if (request.customer) {
    return request.customer;
  }

  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError("Customer authentication required", 401);
  }

  const payload = verifyAccessToken(token);

  if (payload.scope !== "customer") {
    throw new AppError("Invalid customer token", 401);
  }

  const [customer] = await query<CustomerRow[]>(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        account_status,
        total_orders,
        total_spent
      FROM customers
      WHERE id = ?
        AND account_status = 'active'
      LIMIT 1
    `,
    [payload.id]
  );

  if (!customer) {
    throw new AppError("Customer account is invalid or inactive", 401);
  }

  request.customer = {
    id: customer.id,
    firstName: customer.first_name,
    lastName: customer.last_name,
    email: customer.email,
    phone: customer.phone,
    accountStatus: customer.account_status,
    totalOrders: Number(customer.total_orders ?? 0),
    totalSpent: Number(customer.total_spent ?? 0)
  };

  return request.customer;
};

export const requireCustomerAuth = asyncHandler(
  async (request: Request, _response: Response, next: NextFunction) => {
    await resolveCustomerAuth(request);
    next();
  }
);
