import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodEffects } from "zod";
import { AppError } from "../utils/app-error.js";

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

export const validate =
  (schema: Schema, target: "body" | "query" | "params" = "body") =>
  (request: Request, _response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request[target]);

    if (!parsed.success) {
      console.warn(`[Validation Failed] target: ${target}, errors:`, JSON.stringify(parsed.error.flatten(), null, 2));
      return next(new AppError("Validation failed", 422, parsed.error.flatten()));
    }

    (request as unknown as Record<string, unknown>)[target] = parsed.data;
    next();
  };
