import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";

const zoneSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  sector: z.string().optional().nullable(),
  baseFee: z.coerce.number().nonnegative(),
  estimatedDeliveryHours: z.coerce.number().int().optional().nullable(),
  freeDeliveryThreshold: z.coerce.number().nonnegative().optional().nullable(),
  deliveryPartnerName: z.string().optional().nullable(),
  deliveryPartnerPhone: z.string().optional().nullable(),
  isActive: z.boolean().default(true)
});

const ruleSchema = z.object({
  deliveryZoneId: z.coerce.number().int().positive(),
  ruleName: z.string().min(2),
  minOrderAmount: z.coerce.number().nonnegative().optional().nullable(),
  maxOrderAmount: z.coerce.number().nonnegative().optional().nullable(),
  shippingFee: z.coerce.number().nonnegative(),
  freeShipping: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const shippingRouter = Router();

shippingRouter.get(
  "/zones",
  requirePermission("orders.view", "settings.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM delivery_zones ORDER BY name ASC") });
  })
);

shippingRouter.post(
  "/zones",
  requirePermission("settings.manage"),
  validate(zoneSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO delivery_zones (
          name, code, country, city, district, sector, base_fee, estimated_delivery_hours,
          free_delivery_threshold, delivery_partner_name, delivery_partner_phone, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.name,
        payload.code,
        payload.country ?? null,
        payload.city ?? null,
        payload.district ?? null,
        payload.sector ?? null,
        payload.baseFee,
        payload.estimatedDeliveryHours ?? null,
        payload.freeDeliveryThreshold ?? null,
        payload.deliveryPartnerName ?? null,
        payload.deliveryPartnerPhone ?? null,
        payload.isActive ? 1 : 0
      ]
    );
    response.status(201).json({ message: "Delivery zone created" });
  })
);

shippingRouter.put(
  "/zones/:id",
  requirePermission("settings.manage"),
  validate(zoneSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE delivery_zones
        SET name = ?, code = ?, country = ?, city = ?, district = ?, sector = ?, base_fee = ?,
            estimated_delivery_hours = ?, free_delivery_threshold = ?, delivery_partner_name = ?,
            delivery_partner_phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.name,
        payload.code,
        payload.country ?? null,
        payload.city ?? null,
        payload.district ?? null,
        payload.sector ?? null,
        payload.baseFee,
        payload.estimatedDeliveryHours ?? null,
        payload.freeDeliveryThreshold ?? null,
        payload.deliveryPartnerName ?? null,
        payload.deliveryPartnerPhone ?? null,
        payload.isActive ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Delivery zone updated" });
  })
);

shippingRouter.delete(
  "/zones/:id",
  requirePermission("settings.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM delivery_zones WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Delivery zone deleted" });
  })
);

shippingRouter.get(
  "/rules",
  requirePermission("orders.view", "settings.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM shipping_rules ORDER BY created_at DESC") });
  })
);

shippingRouter.post(
  "/rules",
  requirePermission("settings.manage"),
  validate(ruleSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO shipping_rules (
          delivery_zone_id, rule_name, min_order_amount, max_order_amount, shipping_fee, free_shipping, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.deliveryZoneId,
        payload.ruleName,
        payload.minOrderAmount ?? null,
        payload.maxOrderAmount ?? null,
        payload.shippingFee,
        payload.freeShipping ? 1 : 0,
        payload.isActive ? 1 : 0
      ]
    );
    response.status(201).json({ message: "Shipping rule created" });
  })
);

shippingRouter.put(
  "/rules/:id",
  requirePermission("settings.manage"),
  validate(ruleSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE shipping_rules
        SET delivery_zone_id = ?, rule_name = ?, min_order_amount = ?, max_order_amount = ?,
            shipping_fee = ?, free_shipping = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.deliveryZoneId,
        payload.ruleName,
        payload.minOrderAmount ?? null,
        payload.maxOrderAmount ?? null,
        payload.shippingFee,
        payload.freeShipping ? 1 : 0,
        payload.isActive ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Shipping rule updated" });
  })
);

shippingRouter.delete(
  "/rules/:id",
  requirePermission("settings.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM shipping_rules WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Shipping rule deleted" });
  })
);
