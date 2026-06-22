import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

export type JwtPayload = {
  id: number;
  roleId: number;
  scope?: "admin" | "customer";
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new AppError("Session expired. Please sign in again.", 401);
    }

    if (error instanceof Error && error.name === "JsonWebTokenError") {
      throw new AppError("Invalid authentication token", 401);
    }

    throw error;
  }
};

export const createSessionToken = () => crypto.randomBytes(48).toString("hex");
export const createResetToken = () => crypto.randomBytes(32).toString("hex");
export const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");
