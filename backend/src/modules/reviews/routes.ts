import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";

const reviewUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "spam"]),
  isFeatured: z.boolean().default(false),
  adminReply: z.string().optional().nullable()
});

export const reviewsRouter = Router();

reviewsRouter.get(
  "/",
  requirePermission("reviews.manage"),
  asyncHandler(async (_request, response) => {
    const data = await query(
      `
        SELECT
          r.*,
          p.name AS product_name,
          CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
        FROM reviews r
        INNER JOIN products p ON p.id = r.product_id
        INNER JOIN customers c ON c.id = r.customer_id
        ORDER BY r.created_at DESC
      `
    );
    response.json({ data });
  })
);

reviewsRouter.patch(
  "/:id",
  requirePermission("reviews.manage"),
  validate(reviewUpdateSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE reviews
        SET status = ?, is_featured = ?, admin_reply = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.status,
        payload.isFeatured ? 1 : 0,
        payload.adminReply ?? null,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Review updated" });
  })
);

reviewsRouter.delete(
  "/:id",
  requirePermission("reviews.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM reviews WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Review deleted" });
  })
);
