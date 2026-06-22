import type { JwtPayload } from "../utils/security.js";

declare global {
  namespace Express {
    interface Request {
      adminUser?: JwtPayload & {
        firstName: string;
        lastName: string | null;
        email: string;
        roleName: string;
        permissions: string[];
        sessionToken: string;
      };
      customer?: {
        id: number;
        firstName: string;
        lastName: string | null;
        email: string;
        phone: string | null;
        accountStatus: string;
        totalOrders: number;
        totalSpent: number;
      };
    }
  }
}

export {};
