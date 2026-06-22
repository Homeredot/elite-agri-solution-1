import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

type MysqlLikeError = Error & {
  code?: string;
  errno?: number;
  sqlMessage?: string;
};

export const notFoundHandler = (_request: Request, _response: Response, next: NextFunction) => {
  next(new AppError("Resource not found", 404));
};

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null
    });
  }

  const mysqlError = error as MysqlLikeError;

  if (mysqlError.code === "ER_DUP_ENTRY") {
    return response.status(409).json({
      message: "A product with this SKU or slug already exists."
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Internal server error"
  });
};
