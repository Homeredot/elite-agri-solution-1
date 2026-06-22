import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { optionalLocalImageSchema } from "../../utils/media.js";

const websiteSettingsSchema = z.object({
  websiteName: z.string().min(2),
  websiteLogoUrl: optionalLocalImageSchema,
  faviconUrl: optionalLocalImageSchema,
  supportEmail: z.string().email().optional().nullable(),
  supportPhone: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  contactAddress: z.string().optional().nullable(),
  currencyCode: z.string().min(1),
  currencySymbol: z.string().min(1),
  taxPercent: z.coerce.number().nonnegative(),
  timezone: z.string().min(2),
  languageCode: z.string().min(2),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().optional().nullable()
});

const themeSettingsSchema = z.object({
  themeMode: z.enum(["light", "dark", "system"]).default("system"),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  buttonColor: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  backgroundColor: z.string().optional().nullable(),
  glassmorphismEnabled: z.boolean().default(true)
});

const seoSchema = z.object({
  pageKey: z.string().min(2),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImageUrl: optionalLocalImageSchema,
  canonicalUrl: z.string().optional().nullable()
});

export const settingsRouter = Router();

settingsRouter.get(
  "/overview",
  requirePermission("settings.manage"),
  asyncHandler(async (_request, response) => {
    const [websiteSettings, themeSettings, seoSettings, paymentMethods] = await Promise.all([
      query("SELECT * FROM website_settings ORDER BY id DESC LIMIT 1"),
      query("SELECT * FROM theme_settings ORDER BY id DESC LIMIT 1"),
      query("SELECT * FROM seo_settings ORDER BY page_key ASC"),
      query("SELECT * FROM payment_methods ORDER BY name ASC")
    ]);

    response.json({
      data: {
        websiteSettings: websiteSettings[0] ?? null,
        themeSettings: themeSettings[0] ?? null,
        seoSettings,
        paymentMethods
      }
    });
  })
);

settingsRouter.put(
  "/website",
  requirePermission("settings.manage"),
  validate(websiteSettingsSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const settingsRows = await query<any[]>("SELECT * FROM website_settings ORDER BY id DESC LIMIT 1");
    const activeId = settingsRows[0]?.id ?? 1;
    const existing = settingsRows[0] ?? {};

    await execute(
      `
        UPDATE website_settings
        SET website_name = ?, website_logo_url = ?, favicon_url = ?, support_email = ?, support_phone = ?,
            whatsapp_number = ?, contact_address = ?, currency_code = ?, currency_symbol = ?, tax_percent = ?,
            timezone = ?, language_code = ?, maintenance_mode = ?, maintenance_message = ?,
            updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.websiteName !== undefined ? payload.websiteName : (existing.website_name ?? "Store"),
        payload.websiteLogoUrl !== undefined ? payload.websiteLogoUrl : (existing.website_logo_url ?? null),
        payload.faviconUrl !== undefined ? payload.faviconUrl : (existing.favicon_url ?? null),
        payload.supportEmail !== undefined ? payload.supportEmail : (existing.support_email ?? null),
        payload.supportPhone !== undefined ? payload.supportPhone : (existing.support_phone ?? null),
        payload.whatsappNumber !== undefined ? payload.whatsappNumber : (existing.whatsapp_number ?? null),
        payload.contactAddress !== undefined ? payload.contactAddress : (existing.contact_address ?? null),
        payload.currencyCode !== undefined ? payload.currencyCode : (existing.currency_code ?? "RWF"),
        payload.currencySymbol !== undefined ? payload.currencySymbol : (existing.currency_symbol ?? "FRw"),
        payload.taxPercent !== undefined ? payload.taxPercent : (existing.tax_percent ?? 0),
        payload.timezone !== undefined ? payload.timezone : (existing.timezone ?? "Africa/Kigali"),
        payload.languageCode !== undefined ? payload.languageCode : (existing.language_code ?? "en"),
        payload.maintenanceMode !== undefined ? (payload.maintenanceMode ? 1 : 0) : (existing.maintenance_mode ? 1 : 0),
        payload.maintenanceMessage !== undefined ? payload.maintenanceMessage : (existing.maintenance_message ?? null),
        request.adminUser!.id,
        activeId
      ]
    );
    response.json({ message: "Website settings updated" });
  })
);

settingsRouter.put(
  "/theme",
  requirePermission("settings.manage"),
  validate(themeSettingsSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const themeRows = await query<any[]>("SELECT * FROM theme_settings ORDER BY id DESC LIMIT 1");
    const activeId = themeRows[0]?.id ?? 1;
    const existing = themeRows[0] ?? {};

    await execute(
      `
        UPDATE theme_settings
        SET theme_mode = ?, primary_color = ?, secondary_color = ?, button_color = ?, text_color = ?,
            background_color = ?, glassmorphism_enabled = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.themeMode !== undefined ? payload.themeMode : (existing.theme_mode ?? "system"),
        payload.primaryColor !== undefined ? payload.primaryColor : (existing.primary_color ?? null),
        payload.secondaryColor !== undefined ? payload.secondaryColor : (existing.secondary_color ?? null),
        payload.buttonColor !== undefined ? payload.buttonColor : (existing.button_color ?? null),
        payload.textColor !== undefined ? payload.textColor : (existing.text_color ?? null),
        payload.backgroundColor !== undefined ? payload.backgroundColor : (existing.background_color ?? null),
        payload.glassmorphismEnabled !== undefined ? (payload.glassmorphismEnabled ? 1 : 0) : (existing.glassmorphism_enabled ? 1 : 0),
        request.adminUser!.id,
        activeId
      ]
    );
    response.json({ message: "Theme settings updated" });
  })
);

settingsRouter.get(
  "/seo",
  requirePermission("settings.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM seo_settings ORDER BY page_key ASC") });
  })
);

settingsRouter.put(
  "/seo/:pageKey",
  requirePermission("settings.manage"),
  validate(seoSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO seo_settings (page_key, meta_title, meta_description, og_image_url, canonical_url, updated_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          meta_title = VALUES(meta_title),
          meta_description = VALUES(meta_description),
          og_image_url = VALUES(og_image_url),
          canonical_url = VALUES(canonical_url),
          updated_by = VALUES(updated_by),
          updated_at = CURRENT_TIMESTAMP
      `,
      [
        request.params.pageKey,
        payload.metaTitle ?? null,
        payload.metaDescription ?? null,
        payload.ogImageUrl ?? null,
        payload.canonicalUrl ?? null,
        request.adminUser!.id
      ]
    );
    response.json({ message: "SEO settings updated" });
  })
);
