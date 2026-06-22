import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export const requirePermission =
  (...permissionKeys: string[]) =>
  (request: Request, _response: Response, next: NextFunction) => {
    const currentUser = request.adminUser;

    if (!currentUser) {
      return next(new AppError("Authentication required", 401));
    }

    const allowed = permissionKeys.some((permissionKey) =>
      currentUser.permissions.includes(permissionKey)
    );

    if (!allowed) {
      return next(new AppError("You do not have permission for this action", 403));
    }

    next();
  };
