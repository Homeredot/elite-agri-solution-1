import { Router } from "express";
import { z } from "zod";
import { execute, query } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { localImageSchema } from "../../utils/media.js";

const emptyStringToNull = (value: unknown) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const nullableOptionalStringSchema = z.preprocess(
  emptyStringToNull,
  z.string().optional().nullable()
);

const nullableDateTimeSchema = z.preprocess(
  emptyStringToNull,
  z.string().datetime().optional().nullable()
);

const BANNER_POSITION_OPTIONS = [
  {
    code: "homepage_hero",
    label: "Homepage Hero",
    description: "Primary hero rotation at the top of the storefront home page.",
    maxSlots: 3
  },
  {
    code: "homepage_feature_strip",
    label: "Feature Strip",
    description: "Secondary highlight area for short campaign banners below the hero.",
    maxSlots: 2
  },
  {
    code: "homepage_mid_promo",
    label: "Mid-Page Promo",
    description: "A promotional banner area deeper in the home page content flow.",
    maxSlots: 2
  },
  {
    code: "catalog_spotlight",
    label: "Catalog Spotlight",
    description: "A banner reserved for merchandising messages in the catalog experience.",
    maxSlots: 2
  }
] as const;

const CTA_POSITION_OPTIONS = [
  {
    code: "top_left",
    label: "Top Left",
    description: "Place the CTA near the top-left edge of the banner."
  },
  {
    code: "top_center",
    label: "Top Center",
    description: "Center the CTA across the top of the banner."
  },
  {
    code: "top_right",
    label: "Top Right",
    description: "Place the CTA near the top-right edge of the banner."
  },
  {
    code: "bottom_left",
    label: "Bottom Left",
    description: "Place the CTA near the bottom-left edge of the banner."
  },
  {
    code: "bottom_center",
    label: "Bottom Center",
    description: "Center the CTA across the bottom of the banner."
  },
  {
    code: "bottom_right",
    label: "Bottom Right",
    description: "Place the CTA near the bottom-right edge of the banner."
  }
] as const;

const bannerSchema = z
  .object({
    title: nullableOptionalStringSchema,
    subtitle: nullableOptionalStringSchema,
    imageUrl: localImageSchema,
    ctaText: nullableOptionalStringSchema,
    ctaLink: nullableOptionalStringSchema,
    ctaPosition: z.enum(CTA_POSITION_OPTIONS.map((item) => item.code) as [string, ...string[]]).default("bottom_left"),
    positionCode: z
      .enum(BANNER_POSITION_OPTIONS.map((item) => item.code) as [string, ...string[]])
      .default("homepage_hero"),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
    startsAt: nullableDateTimeSchema,
    endsAt: nullableDateTimeSchema
  })
  .superRefine((payload, context) => {
    const hasCtaText = Boolean(payload.ctaText?.trim());
    const hasCtaLink = Boolean(payload.ctaLink?.trim());
    const selectedPosition = BANNER_POSITION_OPTIONS.find((item) => item.code === payload.positionCode);

    if (hasCtaText !== hasCtaLink) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [hasCtaText ? "ctaLink" : "ctaText"],
        message: "CTA text and CTA link must be provided together"
      });
    }

    if (payload.startsAt && payload.endsAt && new Date(payload.endsAt) < new Date(payload.startsAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "End time must be after the start time"
      });
    }

    if (selectedPosition && (payload.sortOrder < 0 || payload.sortOrder >= selectedPosition.maxSlots)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sortOrder"],
        message: "Selected slot is not available for this banner position"
      });
    }
  });

const announcementSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
  backgroundColor: nullableOptionalStringSchema,
  textColor: nullableOptionalStringSchema,
  ctaText: nullableOptionalStringSchema,
  ctaLink: nullableOptionalStringSchema,
  isActive: z.boolean().default(true),
  startsAt: nullableDateTimeSchema,
  endsAt: nullableDateTimeSchema
});

const homepageSectionSchema = z.object({
  sectionKey: z.string().min(2),
  title: nullableOptionalStringSchema,
  subtitle: nullableOptionalStringSchema,
  content: nullableOptionalStringSchema,
  contentJson: z.record(z.any()).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  showOnHomepage: z.boolean().default(true)
});

const linkSchema = z.object({
  platform: z.string().optional(),
  sectionName: z.string().optional(),
  label: z.string().optional(),
  url: z.string().min(1),
  icon: nullableOptionalStringSchema,
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0)
});

const legalPageParamsSchema = z.object({
  pageKey: z.enum(["about", "terms", "privacy"])
});

const legalPageSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
  metaTitle: nullableOptionalStringSchema,
  metaDescription: nullableOptionalStringSchema
});

const faqSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  category: nullableOptionalStringSchema,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});

const getBannerPositionConfig = (positionCode: string) => {
  const position = BANNER_POSITION_OPTIONS.find((item) => item.code === positionCode);

  if (!position) {
    throw new AppError("Invalid banner position", 400);
  }

  return position;
};

const assertBannerSlotAvailable = async ({
  positionCode,
  sortOrder,
  bannerId
}: {
  positionCode: string;
  sortOrder: number;
  bannerId?: number;
}) => {
  const position = getBannerPositionConfig(positionCode);

  if (sortOrder < 0 || sortOrder >= position.maxSlots) {
    throw new AppError("Selected banner spot does not exist", 400);
  }

  const conflicts = await query<any[]>(
    `
      SELECT id, title, is_active
      FROM banners
      WHERE position_code = ?
        AND sort_order = ?
        ${bannerId ? "AND id <> ?" : ""}
      LIMIT 1
    `,
    bannerId ? [positionCode, sortOrder, bannerId] : [positionCode, sortOrder]
  );

  if (conflicts[0]) {
    const label = conflicts[0].title ? `"${conflicts[0].title}"` : `banner #${conflicts[0].id}`;
    throw new AppError(`This spot is already taken by ${label}`, 409);
  }
};

export const contentRouter = Router();

contentRouter.get(
  "/banners/layout",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    const banners = await query<any[]>(
      `
        SELECT id, title, position_code, sort_order, is_active, starts_at, ends_at
        FROM banners
        ORDER BY position_code ASC, sort_order ASC, created_at DESC
      `
    );

    response.json({
      positions: BANNER_POSITION_OPTIONS.map((position) => ({
        ...position,
        slots: Array.from({ length: position.maxSlots }, (_, index) => {
          const occupant = banners.find(
            (banner) => banner.position_code === position.code && Number(banner.sort_order) === index
          );

          return {
            sortOrder: index,
            label: `Spot ${index + 1}`,
            isTaken: Boolean(occupant),
            banner: occupant
              ? {
                  id: occupant.id,
                  title: occupant.title,
                  isActive: Boolean(occupant.is_active),
                  startsAt: occupant.starts_at,
                  endsAt: occupant.ends_at
                }
              : null
          };
        })
      })),
      ctaPositions: CTA_POSITION_OPTIONS
    });
  })
);

contentRouter.get(
  "/overview",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    const [banners, announcements, sections, featuredCategories, featuredProducts] =
      await Promise.all([
        query("SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC"),
        query("SELECT * FROM announcements ORDER BY updated_at DESC"),
        query("SELECT * FROM homepage_sections ORDER BY sort_order ASC"),
        query(
          `
            SELECT id, name, image_url, show_on_homepage, is_featured
            FROM categories
            WHERE show_on_homepage = 1 OR is_featured = 1
            ORDER BY sort_order ASC
          `
        ),
        query(
          `
            SELECT id, name, sku, featured_product, best_seller, new_arrival
            FROM products
            WHERE deleted_at IS NULL AND (featured_product = 1 OR best_seller = 1 OR new_arrival = 1)
            ORDER BY updated_at DESC
            LIMIT 20
          `
        )
      ]);

    response.json({
      data: {
        banners,
        announcements,
        sections,
        featuredCategories,
        featuredProducts
      }
    });
  })
);

contentRouter.get(
  "/banners",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC") });
  })
);

contentRouter.post(
  "/banners",
  requirePermission("content.manage"),
  validate(bannerSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await assertBannerSlotAvailable({
      positionCode: payload.positionCode,
      sortOrder: payload.sortOrder
    });
    await execute(
      `
        INSERT INTO banners (
          title, subtitle, image_url, cta_text, cta_link, cta_position, position_code,
          sort_order, is_active, starts_at, ends_at, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.title ?? null,
        payload.subtitle ?? null,
        payload.imageUrl,
        payload.ctaText ?? null,
        payload.ctaLink ?? null,
        payload.ctaPosition,
        payload.positionCode,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        payload.startsAt ?? null,
        payload.endsAt ?? null,
        request.adminUser!.id,
        request.adminUser!.id
      ]
    );
    response.status(201).json({ message: "Banner created" });
  })
);

contentRouter.put(
  "/banners/:id",
  requirePermission("content.manage"),
  validate(bannerSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const bannerId = Number(request.params.id);
    await assertBannerSlotAvailable({
      positionCode: payload.positionCode,
      sortOrder: payload.sortOrder,
      bannerId
    });
    await execute(
      `
        UPDATE banners
        SET title = ?, subtitle = ?, image_url = ?, cta_text = ?, cta_link = ?, cta_position = ?, position_code = ?,
            sort_order = ?, is_active = ?, starts_at = ?, ends_at = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.title ?? null,
        payload.subtitle ?? null,
        payload.imageUrl,
        payload.ctaText ?? null,
        payload.ctaLink ?? null,
        payload.ctaPosition,
        payload.positionCode,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        payload.startsAt ?? null,
        payload.endsAt ?? null,
        request.adminUser!.id,
        bannerId
      ]
    );
    response.json({ message: "Banner updated" });
  })
);

contentRouter.delete(
  "/banners/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM banners WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Banner deleted" });
  })
);

contentRouter.get(
  "/announcements",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM announcements ORDER BY updated_at DESC") });
  })
);

contentRouter.post(
  "/announcements",
  requirePermission("content.manage"),
  validate(announcementSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO announcements (
          title, content, background_color, text_color, cta_text, cta_link, is_active, starts_at, ends_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.title,
        payload.content,
        payload.backgroundColor ?? null,
        payload.textColor ?? null,
        payload.ctaText ?? null,
        payload.ctaLink ?? null,
        payload.isActive ? 1 : 0,
        payload.startsAt ?? null,
        payload.endsAt ?? null
      ]
    );
    response.status(201).json({ message: "Announcement created" });
  })
);

contentRouter.put(
  "/announcements/:id",
  requirePermission("content.manage"),
  validate(announcementSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE announcements
        SET title = ?, content = ?, background_color = ?, text_color = ?, cta_text = ?, cta_link = ?,
            is_active = ?, starts_at = ?, ends_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.title,
        payload.content,
        payload.backgroundColor ?? null,
        payload.textColor ?? null,
        payload.ctaText ?? null,
        payload.ctaLink ?? null,
        payload.isActive ? 1 : 0,
        payload.startsAt ?? null,
        payload.endsAt ?? null,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Announcement updated" });
  })
);

contentRouter.delete(
  "/announcements/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM announcements WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Announcement deleted" });
  })
);

contentRouter.get(
  "/homepage-sections",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM homepage_sections ORDER BY sort_order ASC") });
  })
);

contentRouter.post(
  "/homepage-sections",
  requirePermission("content.manage"),
  validate(homepageSectionSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO homepage_sections (
          section_key, title, subtitle, content, content_json, sort_order, is_active, show_on_homepage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.sectionKey,
        payload.title ?? null,
        payload.subtitle ?? null,
        payload.content ?? null,
        payload.contentJson ? JSON.stringify(payload.contentJson) : null,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        payload.showOnHomepage ? 1 : 0
      ]
    );
    response.status(201).json({ message: "Homepage section created" });
  })
);

contentRouter.put(
  "/homepage-sections/:id",
  requirePermission("content.manage"),
  validate(homepageSectionSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE homepage_sections
        SET section_key = ?, title = ?, subtitle = ?, content = ?, content_json = ?,
            sort_order = ?, is_active = ?, show_on_homepage = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.sectionKey,
        payload.title ?? null,
        payload.subtitle ?? null,
        payload.content ?? null,
        payload.contentJson ? JSON.stringify(payload.contentJson) : null,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        payload.showOnHomepage ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Homepage section updated" });
  })
);

contentRouter.delete(
  "/homepage-sections/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM homepage_sections WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Homepage section deleted" });
  })
);

contentRouter.get(
  "/social-links",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM social_links ORDER BY sort_order ASC, created_at ASC") });
  })
);

contentRouter.post(
  "/social-links",
  requirePermission("content.manage"),
  validate(linkSchema.extend({ platform: z.string().min(2) })),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO social_links (platform, url, icon, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `,
      [payload.platform, payload.url, payload.icon ?? null, payload.isActive ? 1 : 0, payload.sortOrder]
    );
    response.status(201).json({ message: "Social link created" });
  })
);

contentRouter.put(
  "/social-links/:id",
  requirePermission("content.manage"),
  validate(linkSchema.extend({ platform: z.string().min(2) })),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE social_links
        SET platform = ?, url = ?, icon = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.platform,
        payload.url,
        payload.icon ?? null,
        payload.isActive ? 1 : 0,
        payload.sortOrder,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Social link updated" });
  })
);

contentRouter.delete(
  "/social-links/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM social_links WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Social link deleted" });
  })
);

contentRouter.get(
  "/footer-links",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM footer_links ORDER BY section_name ASC, sort_order ASC") });
  })
);

contentRouter.post(
  "/footer-links",
  requirePermission("content.manage"),
  validate(linkSchema.extend({ sectionName: z.string().min(2), label: z.string().min(2) })),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO footer_links (section_name, label, url, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `,
      [payload.sectionName, payload.label, payload.url, payload.sortOrder, payload.isActive ? 1 : 0]
    );
    response.status(201).json({ message: "Footer link created" });
  })
);

contentRouter.put(
  "/footer-links/:id",
  requirePermission("content.manage"),
  validate(linkSchema.extend({ sectionName: z.string().min(2), label: z.string().min(2) })),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE footer_links
        SET section_name = ?, label = ?, url = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.sectionName,
        payload.label,
        payload.url,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Footer link updated" });
  })
);

contentRouter.delete(
  "/footer-links/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM footer_links WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Footer link deleted" });
  })
);

contentRouter.get(
  "/legal-pages",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM legal_pages ORDER BY page_key ASC") });
  })
);

contentRouter.put(
  "/legal-pages/:pageKey",
  requirePermission("content.manage"),
  validate(legalPageParamsSchema, "params"),
  validate(legalPageSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO legal_pages (page_key, title, content, meta_title, meta_description, updated_by)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          content = VALUES(content),
          meta_title = VALUES(meta_title),
          meta_description = VALUES(meta_description),
          updated_by = VALUES(updated_by),
          updated_at = CURRENT_TIMESTAMP
      `,
      [
        request.params.pageKey,
        payload.title,
        payload.content,
        payload.metaTitle ?? null,
        payload.metaDescription ?? null,
        request.adminUser!.id
      ]
    );
    response.json({ message: "Legal page saved" });
  })
);

contentRouter.get(
  "/faqs",
  requirePermission("content.manage"),
  asyncHandler(async (_request, response) => {
    response.json({ data: await query("SELECT * FROM faqs ORDER BY sort_order ASC, created_at DESC") });
  })
);

contentRouter.post(
  "/faqs",
  requirePermission("content.manage"),
  validate(faqSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        INSERT INTO faqs (question, answer, category, sort_order, is_active, updated_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        payload.question,
        payload.answer,
        payload.category ?? null,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        request.adminUser!.id
      ]
    );
    response.status(201).json({ message: "FAQ created" });
  })
);

contentRouter.put(
  "/faqs/:id",
  requirePermission("content.manage"),
  validate(faqSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE faqs
        SET question = ?, answer = ?, category = ?, sort_order = ?, is_active = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.question,
        payload.answer,
        payload.category ?? null,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        request.adminUser!.id,
        Number(request.params.id)
      ]
    );
    response.json({ message: "FAQ updated" });
  })
);

contentRouter.delete(
  "/faqs/:id",
  requirePermission("content.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM faqs WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "FAQ deleted" });
  })
);
