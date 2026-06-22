import { Router } from "express";
import { z } from "zod";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { execute, query, withTransaction } from "../../config/database.js";
import { requireCustomerAuth, resolveCustomerAuth } from "../../middleware/customer-auth.js";
import {
  initiatePesaPalCheckout,
  normalizePesaPalIpnPayload,
  fetchPesaPalTransactionStatus
} from "../payments/providers/pesapal.js";
import { syncOrderPaymentStatus } from "../orders/workflow.js";
import { validate } from "../../middleware/validate.js";
import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { comparePassword, hashPassword, signAccessToken } from "../../utils/security.js";
import { getPagination } from "../../utils/pagination.js";

const customerRegisterSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  password: z.string().min(8)
});

const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const customerProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable()
});

const customerCartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive()
});

const customerCartSyncSchema = z.object({
  items: z.array(customerCartItemSchema).max(100)
});

const customerWishlistItemSchema = z.object({
  productId: z.coerce.number().int().positive()
});

const customerWishlistSyncSchema = z.object({
  productIds: z.array(z.coerce.number().int().positive()).max(100)
});

const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional().nullable(),
    email: z.string().email(),
    phone: z.string().optional().nullable()
  }),
  billing: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional().nullable(),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    country: z.string().optional().nullable()
  }),
  shipping: z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    region: z.string().optional().nullable(),
    country: z.string().optional().nullable()
  }),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive()
      })
    )
    .min(1),
  deliveryZoneId: z.coerce.number().int().positive().optional().nullable(),
  couponCode: z.string().optional().nullable(),
  paymentMethodId: z.coerce.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable()
});

const buildOrderNumber = () => {
  const now = new Date();
  const parts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${parts}-${random}`;
};

const getEffectivePrice = (product: { discount_price: number | null; price: number }) =>
  product.discount_price && product.discount_price > 0 && product.discount_price < product.price
    ? product.discount_price
    : product.price;

type StorefrontPaymentMethod = {
  id: number;
  name: string;
  code: string;
  provider: "cash" | "manual" | "other" | "pesapal";
  is_enabled: number | boolean;
  requires_manual_verification: number | boolean;
  config_json: unknown;
};

type BaseCallbackTransactionRow = RowDataPacket & {
  id: number;
  order_id: number;
};

type PaymentTransactionStatusRow = RowDataPacket & {
  id: number;
  order_id: number;
  merchant_reference: string | null;
  provider_reference: string | null;
  payment_method_name: string;
  payment_provider: "cash" | "manual" | "other" | "pesapal";
  config_json: unknown;
};

const getStoreProductSelectSql = () => `
  p.id,
  p.name,
  p.slug,
  p.short_description,
  p.price,
  p.discount_price,
  p.stock_quantity,
  p.average_rating,
  p.total_reviews,
  COALESCE(
    p.og_image_url,
    (
      SELECT pi.image_url
      FROM product_images pi
      WHERE pi.product_id = p.id
      ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
      LIMIT 1
    )
  ) AS og_image_url
`;

const getCustomerCart = async (customerId: number) =>
  query(
    `
      SELECT
        ci.product_id AS productId,
        ci.quantity,
        ${getStoreProductSelectSql()}
      FROM cart_items ci
      INNER JOIN products p ON p.id = ci.product_id
      WHERE ci.customer_id = ?
        AND p.deleted_at IS NULL
        AND p.status = 'active'
        AND p.visibility = 'public'
      ORDER BY ci.updated_at DESC, ci.id DESC
    `,
    [customerId]
  );

const getCustomerWishlist = async (customerId: number) =>
  query<{ productId: number }[]>(
    `
      SELECT wi.product_id AS productId
      FROM wishlist_items wi
      INNER JOIN products p ON p.id = wi.product_id
      WHERE wi.customer_id = ?
        AND p.deleted_at IS NULL
        AND p.status = 'active'
        AND p.visibility = 'public'
      ORDER BY wi.created_at DESC, wi.id DESC
    `,
    [customerId]
  );

const getCheckoutProduct = async (productId: number) => {
  const [product] = await query<any[]>(
    `
      SELECT id, name, slug, sku, price, discount_price, stock_quantity
      FROM products
      WHERE id = ?
        AND deleted_at IS NULL
        AND status = 'active'
        AND visibility = 'public'
      LIMIT 1
    `,
    [productId]
  );

  if (!product) {
    throw new AppError("Product is unavailable", 404);
  }

  return product;
};

export const storefrontRouter = Router();

storefrontRouter.get(
  "/settings",
  asyncHandler(async (_request, response) => {
    const [websiteSettings, themeSettings] = await Promise.all([
      query<any[]>("SELECT * FROM website_settings ORDER BY id DESC LIMIT 1"),
      query<any[]>("SELECT * FROM theme_settings ORDER BY id DESC LIMIT 1")
    ]);

    response.json({
      data: {
        websiteSettings: websiteSettings[0] ?? null,
        themeSettings: themeSettings[0] ?? null
      }
    });
  })
);

storefrontRouter.get(
  "/home",
  asyncHandler(async (_request, response) => {
    const [banners, announcements, sections, categories, featuredProducts, bestSellers, newArrivals, discountedProducts] =
      await Promise.all([
        query(
          `
            SELECT *
            FROM banners
            WHERE is_active = 1
              AND (starts_at IS NULL OR starts_at <= NOW())
              AND (ends_at IS NULL OR ends_at >= NOW())
            ORDER BY sort_order ASC, created_at DESC
          `
        ),
        query(
          `
            SELECT *
            FROM announcements
            WHERE is_active = 1
              AND (starts_at IS NULL OR starts_at <= NOW())
              AND (ends_at IS NULL OR ends_at >= NOW())
            ORDER BY updated_at DESC
          `
        ),
        query(
          `
            SELECT *
            FROM homepage_sections
            WHERE is_active = 1 AND show_on_homepage = 1
            ORDER BY sort_order ASC
          `
        ),
        query(
          `
            SELECT id, name, slug, image_url, icon, description
            FROM categories
            WHERE status = 'active' AND (show_on_homepage = 1 OR is_featured = 1)
            ORDER BY sort_order ASC, name ASC
            LIMIT 12
          `
        ),
        query(
          `
            SELECT
              p.id,
              p.name,
              p.slug,
              p.short_description,
              p.price,
              p.discount_price,
              p.stock_quantity,
              p.average_rating,
              COALESCE(
                p.og_image_url,
                (
                  SELECT pi.image_url
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                  ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                  LIMIT 1
                )
              ) AS og_image_url
            FROM products p
            WHERE deleted_at IS NULL AND status = 'active' AND visibility = 'public' AND featured_product = 1
            ORDER BY updated_at DESC
            LIMIT 12
          `
        ),
        query(
          `
            SELECT
              p.id,
              p.name,
              p.slug,
              p.short_description,
              p.price,
              p.discount_price,
              p.stock_quantity,
              p.average_rating,
              COALESCE(
                p.og_image_url,
                (
                  SELECT pi.image_url
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                  ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                  LIMIT 1
                )
              ) AS og_image_url
            FROM products p
            WHERE deleted_at IS NULL AND status = 'active' AND visibility = 'public' AND best_seller = 1
            ORDER BY total_sales DESC, updated_at DESC
            LIMIT 12
          `
        ),
        query(
          `
            SELECT
              p.id,
              p.name,
              p.slug,
              p.short_description,
              p.price,
              p.discount_price,
              p.stock_quantity,
              p.average_rating,
              COALESCE(
                p.og_image_url,
                (
                  SELECT pi.image_url
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                  ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                  LIMIT 1
                )
              ) AS og_image_url
            FROM products p
            WHERE deleted_at IS NULL AND status = 'active' AND visibility = 'public' AND new_arrival = 1
            ORDER BY published_at DESC, updated_at DESC
            LIMIT 12
          `
        ),
        query(
          `
            SELECT
              p.id,
              p.name,
              p.slug,
              p.short_description,
              p.price,
              p.discount_price,
              p.stock_quantity,
              p.average_rating,
              COALESCE(
                p.og_image_url,
                (
                  SELECT pi.image_url
                  FROM product_images pi
                  WHERE pi.product_id = p.id
                  ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                  LIMIT 1
                )
              ) AS og_image_url
            FROM products p
            WHERE deleted_at IS NULL AND status = 'active' AND visibility = 'public'
              AND discount_price IS NOT NULL AND discount_price > 0 AND discount_price < price
            ORDER BY updated_at DESC
            LIMIT 12
          `
        )
      ]);

    response.json({
      data: {
        banners,
        announcements,
        sections,
        featuredCategories: categories,
        featuredProducts,
        bestSellers,
        newArrivals,
        discountedProducts
      }
    });
  })
);

storefrontRouter.get(
  "/categories",
  asyncHandler(async (_request, response) => {
    const [categories, subcategories] = await Promise.all([
      query<any[]>(
        `
          SELECT
            c.id,
            c.name,
            c.slug,
            c.image_url,
            c.icon,
            c.description
          FROM categories c
          WHERE c.status = 'active'
          ORDER BY c.sort_order ASC, c.name ASC
        `
      ),
      query<any[]>(
        `
          SELECT
            s.id,
            s.category_id,
            s.name,
            s.slug,
            s.image_url
          FROM subcategories s
          WHERE s.status = 'active'
          ORDER BY s.sort_order ASC, s.name ASC
        `
      )
    ]);

    const subcategoriesByCategory = new Map<number, any[]>();

    subcategories.forEach((subcategory) => {
      const current = subcategoriesByCategory.get(subcategory.category_id) ?? [];
      current.push({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        imageUrl: subcategory.image_url
      });
      subcategoriesByCategory.set(subcategory.category_id, current);
    });

    response.json({
      data: categories.map((category) => ({
        ...category,
        subcategories: subcategoriesByCategory.get(category.id) ?? []
      }))
    });
  })
);

storefrontRouter.get(
  "/filters",
  asyncHandler(async (_request, response) => {
    const [groups, options] = await Promise.all([
      query<any[]>(
        `
          SELECT
            fg.id,
            fg.name,
            fg.code,
            fg.sort_order
          FROM filter_groups fg
          WHERE fg.display_on_frontend = 1
          ORDER BY fg.sort_order ASC, fg.name ASC
        `
      ),
      query<any[]>(
        `
          SELECT
            fo.id,
            fo.filter_group_id,
            fo.label,
            fo.value
          FROM filter_options fo
          WHERE fo.is_active = 1
          ORDER BY fo.sort_order ASC, fo.label ASC
        `
      )
    ]);

    const optionsByGroup = new Map<number, any[]>();

    options.forEach((option) => {
      const current = optionsByGroup.get(option.filter_group_id) ?? [];
      current.push({
        id: option.id,
        label: option.label,
        value: option.value
      });
      optionsByGroup.set(option.filter_group_id, current);
    });

    response.json({
      data: groups.map((group) => ({
        ...group,
        options: optionsByGroup.get(group.id) ?? []
      }))
    });
  })
);

storefrontRouter.get(
  "/products",
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const categoryId = request.query.categoryId ? Number(request.query.categoryId) : null;
    const subcategoryId = request.query.subcategoryId ? Number(request.query.subcategoryId) : null;
    const featured = request.query.featured === "1";
    const bestSeller = request.query.bestSeller === "1";
    const newArrival = request.query.newArrival === "1";
    const discounted = request.query.discounted === "1";
    const inStock = request.query.inStock === "1";
    const sort = typeof request.query.sort === "string" ? request.query.sort : "newest";
    const minPrice = request.query.minPrice ? Number(request.query.minPrice) : null;
    const maxPrice = request.query.maxPrice ? Number(request.query.maxPrice) : null;

    const conditions = [
      "p.deleted_at IS NULL",
      "p.status = 'active'",
      "p.visibility = 'public'",
      "p.is_searchable = 1"
    ];
    const params: unknown[] = [];

    if (search) {
      const like = `%${search}%`;
      conditions.push(
        "(p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR t.name LIKE ?)"
      );
      params.push(like, like, like, like, like);
    }

    if (categoryId) {
      conditions.push("pc.category_id = ?");
      params.push(categoryId);
    }

    if (subcategoryId) {
      conditions.push("pc.subcategory_id = ?");
      params.push(subcategoryId);
    }

    if (featured) {
      conditions.push("p.featured_product = 1");
    }

    if (bestSeller) {
      conditions.push("p.best_seller = 1");
    }

    if (newArrival) {
      conditions.push("p.new_arrival = 1");
    }

    if (discounted) {
      conditions.push("p.discount_price IS NOT NULL AND p.discount_price > 0 AND p.discount_price < p.price");
    }

    if (inStock) {
      conditions.push("p.stock_quantity > 0");
    }

    if (minPrice !== null) {
      conditions.push("COALESCE(NULLIF(p.discount_price, 0), p.price) >= ?");
      params.push(minPrice);
    }

    if (maxPrice !== null) {
      conditions.push("COALESCE(NULLIF(p.discount_price, 0), p.price) <= ?");
      params.push(maxPrice);
    }

    const orderBy =
      sort === "price_low"
        ? "COALESCE(NULLIF(p.discount_price, 0), p.price) ASC"
        : sort === "price_high"
          ? "COALESCE(NULLIF(p.discount_price, 0), p.price) DESC"
          : sort === "popular"
            ? "p.total_sales DESC, p.view_count DESC"
            : "COALESCE(p.published_at, p.created_at) DESC";

    const whereSql = `WHERE ${conditions.join(" AND ")}`;

    const data = await query(
      `
        SELECT DISTINCT
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.discount_price,
          p.stock_quantity,
          p.average_rating,
          p.total_reviews,
          COALESCE(p.published_at, p.created_at) AS sort_date,
          COALESCE(
            p.og_image_url,
            (
              SELECT pi.image_url
              FROM product_images pi
              WHERE pi.product_id = p.id
              ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
              LIMIT 1
            )
          ) AS og_image_url,
          c.name AS category_name
        FROM products p
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        LEFT JOIN categories c ON c.id = pc.category_id
        LEFT JOIN product_tags_map ptm ON ptm.product_id = p.id
        LEFT JOIN tags t ON t.id = ptm.tag_id
        ${whereSql}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `
        SELECT COUNT(DISTINCT p.id) AS total
        FROM products p
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        LEFT JOIN product_tags_map ptm ON ptm.product_id = p.id
        LEFT JOIN tags t ON t.id = ptm.tag_id
        ${whereSql}
      `,
      params
    );

    response.json({
      data,
      meta: { page, pageSize, total }
    });
  })
);

storefrontRouter.get(
  "/products/batch",
  asyncHandler(async (request, response) => {
    const idsParam = typeof request.query.ids === "string" ? request.query.ids : "";
    const ids = Array.from(
      new Set(
        idsParam
          .split(",")
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isInteger(value) && value > 0)
      )
    ).slice(0, 100);

    if (!ids.length) {
      response.json({ data: [] });
      return;
    }

    const products = await query(
      `
        SELECT
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.discount_price,
          p.stock_quantity,
          p.average_rating,
          p.total_reviews,
          COALESCE(
            p.og_image_url,
            (
              SELECT pi.image_url
              FROM product_images pi
              WHERE pi.product_id = p.id
              ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
              LIMIT 1
            )
          ) AS og_image_url
        FROM products p
        WHERE p.id IN (${ids.map(() => "?").join(",")})
          AND p.deleted_at IS NULL
          AND p.status = 'active'
          AND p.visibility = 'public'
      `,
      ids
    );

    response.json({ data: products });
  })
);

storefrontRouter.get(
  "/products/:identifier",
  asyncHandler(async (request, response) => {
    const identifier = request.params.identifier;
    const [product] = await query<any[]>(
      `
        SELECT *
        FROM products
        WHERE deleted_at IS NULL
          AND status = 'active'
          AND visibility = 'public'
          AND (slug = ? OR id = ?)
        LIMIT 1
      `,
      [identifier, Number(identifier) || 0]
    );

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const [images, categories, tags, reviews, relatedProducts] = await Promise.all([
      query(
        `
          SELECT image_url, alt_text, sort_order, is_primary
          FROM product_images
          WHERE product_id = ?
          ORDER BY sort_order ASC, id ASC
        `,
        [product.id]
      ),
      query(
        `
          SELECT c.id, c.name, c.slug, sc.id AS subcategory_id, sc.name AS subcategory_name, sc.slug AS subcategory_slug
          FROM product_categories pc
          INNER JOIN categories c ON c.id = pc.category_id
          LEFT JOIN subcategories sc ON sc.id = pc.subcategory_id
          WHERE pc.product_id = ?
        `,
        [product.id]
      ),
      query(
        `
          SELECT t.id, t.name, t.slug
          FROM product_tags_map ptm
          INNER JOIN tags t ON t.id = ptm.tag_id
          WHERE ptm.product_id = ?
        `,
        [product.id]
      ),
      query(
        `
          SELECT r.rating, r.title, r.review_text, r.created_at, CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name
          FROM reviews r
          INNER JOIN customers c ON c.id = r.customer_id
          WHERE r.product_id = ? AND r.status = 'approved'
          ORDER BY r.created_at DESC
        `,
        [product.id]
      ),
      query(
        `
          SELECT DISTINCT
            p2.id,
            p2.name,
            p2.slug,
            p2.price,
            p2.discount_price,
            COALESCE(
              p2.og_image_url,
              (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = p2.id
                ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                LIMIT 1
              )
            ) AS og_image_url
          FROM product_categories pc
          INNER JOIN product_categories pc2 ON pc2.category_id = pc.category_id AND pc2.product_id <> pc.product_id
          INNER JOIN products p2 ON p2.id = pc2.product_id
          WHERE pc.product_id = ?
            AND p2.deleted_at IS NULL
            AND p2.status = 'active'
            AND p2.visibility = 'public'
          LIMIT 8
        `,
        [product.id]
      )
    ]);

    await execute("UPDATE products SET view_count = view_count + 1 WHERE id = ?", [product.id]);

    response.json({
      data: {
        ...product,
        images,
        categories,
        tags,
        reviews,
        relatedProducts
      }
    });
  })
);

storefrontRouter.get(
  "/delivery-zones",
  asyncHandler(async (_request, response) => {
    const zones = await query(
      `
        SELECT id, name, code, city, district, sector, base_fee, estimated_delivery_hours, free_delivery_threshold
        FROM delivery_zones
        WHERE is_active = 1
        ORDER BY name ASC
      `
    );
    response.json({ data: zones });
  })
);

storefrontRouter.get(
  "/payment-methods",
  asyncHandler(async (_request, response) => {
    const methods = await query(
      `
        SELECT id, name, code, provider, requires_manual_verification
        FROM payment_methods
        WHERE is_enabled = 1
        ORDER BY name ASC
      `
    );
    response.json({ data: methods });
  })
);


// Helper function to update payment transactions and orders from provider result
const updatePaymentTransactionFromProviderResult = async (
  connection: PoolConnection,
  transactionId: number,
  orderId: number,
  result: {
    merchantReference: string | null;
    providerReference: string | null;
    status: "success" | "failed" | "pending";
    raw: Record<string, unknown>;
  },
  providerName: string
) => {
  const transactionStatus = result.status;
  const failureMessage =
    result.status === "failed" ? `${providerName} marked transaction as failed` : null;

  await connection.execute(
    `
      UPDATE payment_transactions
      SET provider_reference = COALESCE(?, provider_reference),
          merchant_reference = COALESCE(?, merchant_reference),
          status = ?,
          response_payload = ?,
          failure_message = ?,
          verified_at = CASE WHEN ? = 'success' THEN NOW() ELSE verified_at END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      result.providerReference,
      result.merchantReference,
      transactionStatus,
      JSON.stringify(result.raw),
      failureMessage,
      transactionStatus,
      transactionId
    ]
  );

  if (transactionStatus === "success") {
    await syncOrderPaymentStatus(connection, {
      orderId,
      paymentStatus: "paid",
      note: `${providerName} confirmed payment`,
      changedBy: null
    });
  } else if (transactionStatus === "failed") {
    await syncOrderPaymentStatus(connection, {
      orderId,
      paymentStatus: "failed",
      note: `${providerName} reported payment failure`,
      changedBy: null
    });
  }
};

// ─── PesaPal IPN (server-to-server notification) ───────────────────────────

const handlePesaPalIpn = asyncHandler(async (request, response) => {
  const payload =
    request.method === "GET"
      ? (Object.fromEntries(Object.entries(request.query)) as Record<string, unknown>)
      : ((request.body ?? {}) as Record<string, unknown>);

  const normalized = normalizePesaPalIpnPayload(payload);

  if (!normalized.orderTrackingId && !normalized.merchantReference) {
    throw new AppError("PesaPal IPN did not include a recognizable transaction reference", 400);
  }

  await withTransaction(async (connection) => {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (normalized.merchantReference) {
      conditions.push("pt.merchant_reference = ?");
      params.push(normalized.merchantReference);
    }

    if (normalized.orderTrackingId) {
      conditions.push("pt.provider_reference = ?");
      params.push(normalized.orderTrackingId);
    }

    const [rows] = await connection.query<BaseCallbackTransactionRow[]>(
      `
        SELECT pt.id, pt.order_id
        FROM payment_transactions pt
        WHERE ${conditions.join(" OR ")}
        ORDER BY pt.created_at DESC, pt.id DESC
        LIMIT 1
      `,
      params
    );
    const transaction = rows[0];

    if (!transaction) {
      throw new AppError("Payment transaction not found for PesaPal IPN", 404);
    }

    // Fetch real payment status from PesaPal
    const [methodRow] = await query<PaymentTransactionStatusRow[]>(
      `
        SELECT pm.id, pm.name AS payment_method_name, pm.provider AS payment_provider,
               pm.config_json, pt.merchant_reference, pt.provider_reference, pt.order_id
        FROM payment_transactions pt
        INNER JOIN payment_methods pm ON pm.id = pt.payment_method_id
        WHERE pt.id = ?
        LIMIT 1
      `,
      [transaction.id]
    );

    const orderTrackingId =
      normalized.orderTrackingId ??
      (methodRow?.provider_reference as string | null) ??
      "";

    if (!orderTrackingId) {
      throw new AppError("No PesaPal order tracking ID available for status check", 400);
    }

    const statusResult = await fetchPesaPalTransactionStatus(
      {
        id: 0,
        name: methodRow?.payment_method_name ?? "PesaPal",
        code: "pesapal",
        provider: "pesapal",
        requires_manual_verification: false,
        config_json: methodRow?.config_json ?? {}
      },
      orderTrackingId
    );

    await updatePaymentTransactionFromProviderResult(
      connection,
      transaction.id,
      transaction.order_id,
      {
        merchantReference: statusResult.merchantReference,
        providerReference: statusResult.providerReference,
        status: statusResult.status,
        raw: statusResult.raw
      },
      "PesaPal"
    );
  });

  // PesaPal expects this exact response format for IPN acknowledgement
  response.json({
    orderNotificationType: normalized.notificationType ?? "IPNCHANGE",
    orderTrackingId: normalized.orderTrackingId,
    orderMerchantReference: normalized.merchantReference
  });
});

storefrontRouter.get("/payments/pesapal/ipn", handlePesaPalIpn);
storefrontRouter.post("/payments/pesapal/ipn", handlePesaPalIpn);

// ─── PesaPal redirect callback (customer browser redirect) ───────────────────

storefrontRouter.get(
  "/payments/pesapal/callback",
  asyncHandler(async (request, response) => {
    const orderTrackingId =
      typeof request.query.OrderTrackingId === "string" ? request.query.OrderTrackingId : null;
    const merchantReference =
      typeof request.query.OrderMerchantReference === "string" ? request.query.OrderMerchantReference : null;
    const orderId =
      typeof request.query.orderId === "string" ? request.query.orderId : null;
    const orderNumber =
      typeof request.query.orderNumber === "string" ? request.query.orderNumber : null;

    if (!orderTrackingId && !merchantReference) {
      throw new AppError("PesaPal callback is missing required parameters", 400);
    }

    // Look up the transaction
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (merchantReference) {
      conditions.push("pt.merchant_reference = ?");
      params.push(merchantReference);
    }
    if (orderTrackingId) {
      conditions.push("pt.provider_reference = ?");
      params.push(orderTrackingId);
    }

    const [rows] = await query<PaymentTransactionStatusRow[]>(
      `
        SELECT pt.id, pt.order_id, pt.merchant_reference, pt.provider_reference,
               pm.name AS payment_method_name, pm.provider AS payment_provider,
               pm.config_json
        FROM payment_transactions pt
        INNER JOIN payment_methods pm ON pm.id = pt.payment_method_id
        WHERE ${conditions.join(" OR ")}
        ORDER BY pt.created_at DESC, pt.id DESC
        LIMIT 1
      `,
      params
    );
    const transaction = rows[0];

    if (transaction && orderTrackingId) {
      try {
        const statusResult = await fetchPesaPalTransactionStatus(
          {
            id: 0,
            name: transaction.payment_method_name,
            code: "pesapal",
            provider: "pesapal",
            requires_manual_verification: false,
            config_json: transaction.config_json
          },
          orderTrackingId
        );

        await withTransaction(async (connection) => {
          await updatePaymentTransactionFromProviderResult(
            connection,
            transaction.id,
            transaction.order_id,
            {
              merchantReference: statusResult.merchantReference,
              providerReference: statusResult.providerReference,
              status: statusResult.status,
              raw: statusResult.raw
            },
            "PesaPal"
          );
        });
      } catch {
        // Non-fatal: still redirect customer even if status check fails
      }
    }

    // Build the storefront redirect URL
    const params2 = new URLSearchParams();
    if (orderNumber) params2.set("orderNumber", orderNumber);
    if (orderId) params2.set("orderId", orderId);
    if (merchantReference) params2.set("reference", merchantReference);

    const frontendOrderSuccess = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/order-success`
      : "https://eliteagrisolution.com/order-success";

    response.redirect(`${frontendOrderSuccess}?${params2.toString()}`);
  })
);

storefrontRouter.get(
  "/content",
  asyncHandler(async (_request, response) => {
    const [faqs, legalPages, socialLinks, footerLinks] = await Promise.all([
      query("SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC"),
      query("SELECT * FROM legal_pages ORDER BY page_key ASC"),
      query("SELECT * FROM social_links WHERE is_active = 1 ORDER BY sort_order ASC"),
      query("SELECT * FROM footer_links WHERE is_active = 1 ORDER BY sort_order ASC")
    ]);

    response.json({
      data: {
        faqs,
        legalPages,
        socialLinks,
        footerLinks
      }
    });
  })
);

storefrontRouter.post(
  "/customers/register",
  validate(customerRegisterSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const [existing] = await query<{ id: number }[]>(
      "SELECT id FROM customers WHERE email = ? LIMIT 1",
      [payload.email]
    );

    if (existing) {
      throw new AppError("Customer account already exists", 409);
    }

    const passwordHash = await hashPassword(payload.password);
    const result = await execute(
      `
        INSERT INTO customers (
          first_name, last_name, email, phone, password_hash, account_status, email_verified_at
        ) VALUES (?, ?, ?, ?, ?, 'active', NOW())
      `,
      [payload.firstName, payload.lastName ?? null, payload.email, payload.phone ?? null, passwordHash]
    );

    response.status(201).json({
      message: "Customer account created",
      customerId: (result as ResultSetHeader).insertId
    });
  })
);

storefrontRouter.post(
  "/customers/login",
  validate(customerLoginSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const [customer] = await query<any[]>(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          phone,
          password_hash,
          account_status,
          total_orders,
          total_spent
        FROM customers
        WHERE email = ?
        LIMIT 1
      `,
      [payload.email]
    );

    if (!customer || !customer.password_hash || !(await comparePassword(payload.password, customer.password_hash))) {
      throw new AppError("Invalid email or password", 401);
    }

    if (customer.account_status !== "active") {
      throw new AppError("Customer account is not active", 403);
    }

    const token = signAccessToken({ id: customer.id, roleId: 0, scope: "customer" });

    await execute("UPDATE customers SET last_login_at = NOW() WHERE id = ?", [customer.id]);

    response.json({
      token,
      customer: {
        id: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        accountStatus: customer.account_status,
        totalOrders: Number(customer.total_orders ?? 0),
        totalSpent: Number(customer.total_spent ?? 0)
      }
    });
  })
);

storefrontRouter.get(
  "/notifications",
  asyncHandler(async (request, response) => {
    let customerId: number | null = null;

    try {
      const customer = await resolveCustomerAuth(request);
      customerId = customer.id;
    } catch {
      customerId = null;
    }

    const data = await query(
      `
        SELECT
          id,
          notification_type,
          title,
          message,
          channel,
          related_type,
          related_id,
          sent_at,
          created_at,
          CASE WHEN recipient_customer_id IS NULL THEN 1 ELSE 0 END AS is_broadcast
        FROM notifications
        WHERE recipient_type = 'customer'
          AND channel = 'in_app'
          AND status IN ('sent', 'read')
          AND (
            recipient_customer_id IS NULL
            ${customerId ? "OR recipient_customer_id = ?" : ""}
          )
        ORDER BY created_at DESC
        LIMIT 20
      `,
      customerId ? [customerId] : []
    );

    response.json({ data });
  })
);

storefrontRouter.get(
  "/customers/me",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    response.json({
      data: request.customer
    });
  })
);

storefrontRouter.patch(
  "/customers/me",
  requireCustomerAuth,
  validate(customerProfileSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const customer = request.customer!;

    const [existing] = await query<{ id: number }[]>(
      "SELECT id FROM customers WHERE email = ? AND id <> ? LIMIT 1",
      [payload.email, customer.id]
    );

    if (existing) {
      throw new AppError("Another customer already uses this email address", 409);
    }

    await execute(
      `
        UPDATE customers
        SET first_name = ?, last_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.firstName,
        payload.lastName ?? null,
        payload.email,
        payload.phone ?? null,
        customer.id
      ]
    );

    response.json({
      message: "Profile updated successfully",
      data: {
        ...customer,
        firstName: payload.firstName,
        lastName: payload.lastName ?? null,
        email: payload.email,
        phone: payload.phone ?? null
      }
    });
  })
);

storefrontRouter.get(
  "/customers/orders",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    const { page, pageSize, limit, offset } = getPagination(request.query);
    const customerId = request.customer!.id;

    const data = await query(
      `
        SELECT
          o.id,
          o.order_number,
          o.order_status,
          o.payment_status,
          o.delivery_status,
          o.total_amount,
          o.currency_code,
          o.placed_at,
          (
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM order_items oi
            WHERE oi.order_id = o.id
          ) AS item_count
        FROM orders o
        WHERE o.customer_id = ?
        ORDER BY o.placed_at DESC
        LIMIT ? OFFSET ?
      `,
      [customerId, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `
        SELECT COUNT(*) AS total
        FROM orders
        WHERE customer_id = ?
      `,
      [customerId]
    );

    response.json({
      data,
      meta: { page, pageSize, total }
    });
  })
);

storefrontRouter.get(
  "/customers/orders/:identifier",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    const identifier = request.params.identifier;
    const customerId = request.customer!.id;

    const [order] = await query<any[]>(
      `
        SELECT
          o.*,
          dz.name AS delivery_zone_name
        FROM orders o
        LEFT JOIN delivery_zones dz ON dz.id = o.delivery_zone_id
        WHERE o.customer_id = ?
          AND (o.id = ? OR o.order_number = ?)
        LIMIT 1
      `,
      [customerId, Number(identifier) || 0, identifier]
    );

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const [items, timeline, payments, refunds] = await Promise.all([
      query(
        `
          SELECT
            oi.*,
            p.slug,
            COALESCE(
              p.og_image_url,
              (
                SELECT pi.image_url
                FROM product_images pi
                WHERE pi.product_id = p.id
                ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                LIMIT 1
              )
            ) AS image_url
          FROM order_items oi
          LEFT JOIN products p ON p.id = oi.product_id
          WHERE oi.order_id = ?
          ORDER BY oi.id ASC
        `,
        [order.id]
      ),
      query(
        `
          SELECT status_type, old_status, new_status, description, changed_at
          FROM order_timeline
          WHERE order_id = ?
          ORDER BY changed_at DESC
        `,
        [order.id]
      ),
      query(
        `
          SELECT
            pt.id,
            COALESCE(pt.provider_reference, pt.merchant_reference) AS transaction_reference,
            pt.transaction_type,
            pt.amount,
            pt.currency_code,
            pt.status,
            pt.verified_at AS processed_at,
            pm.name AS payment_method_name
          FROM payment_transactions pt
          LEFT JOIN payment_methods pm ON pm.id = pt.payment_method_id
          WHERE pt.order_id = ?
          ORDER BY pt.created_at DESC
        `,
        [order.id]
      ),
      query(
        `
          SELECT id, amount, status, reason, processed_at, created_at
          FROM refunds
          WHERE order_id = ?
          ORDER BY created_at DESC
        `,
        [order.id]
      )
    ]);

    response.json({
      data: {
        ...order,
        items,
        timeline,
        payments,
        refunds
      }
    });
  })
);

storefrontRouter.get(
  "/customers/cart",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    response.json({
      data: await getCustomerCart(request.customer!.id)
    });
  })
);

storefrontRouter.post(
  "/customers/cart/items",
  requireCustomerAuth,
  validate(customerCartItemSchema),
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    const payload = request.body;
    const product = await getCheckoutProduct(payload.productId);

    if (product.stock_quantity <= 0) {
      throw new AppError("This product is out of stock", 400);
    }

    const [existing] = await query<{ quantity: number }[]>(
      "SELECT quantity FROM cart_items WHERE customer_id = ? AND product_id = ? LIMIT 1",
      [customerId, payload.productId]
    );

    const nextQuantity = Math.min(
      Number(existing?.quantity ?? 0) + payload.quantity,
      Number(product.stock_quantity)
    );

    await execute(
      `
        INSERT INTO cart_items (customer_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_at = CURRENT_TIMESTAMP
      `,
      [customerId, payload.productId, nextQuantity]
    );

    response.status(201).json({
      data: await getCustomerCart(customerId)
    });
  })
);

storefrontRouter.put(
  "/customers/cart/items/:productId",
  requireCustomerAuth,
  validate(z.object({ quantity: z.coerce.number().int().positive() })),
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    const productId = Number(request.params.productId);
    const { quantity } = request.body;
    const product = await getCheckoutProduct(productId);

    await execute(
      `
        INSERT INTO cart_items (customer_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_at = CURRENT_TIMESTAMP
      `,
      [customerId, productId, Math.min(quantity, Number(product.stock_quantity))]
    );

    response.json({
      data: await getCustomerCart(customerId)
    });
  })
);

storefrontRouter.delete(
  "/customers/cart/items/:productId",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    await execute("DELETE FROM cart_items WHERE customer_id = ? AND product_id = ?", [
      customerId,
      Number(request.params.productId)
    ]);

    response.json({
      data: await getCustomerCart(customerId)
    });
  })
);

storefrontRouter.post(
  "/customers/cart/sync",
  requireCustomerAuth,
  validate(customerCartSyncSchema),
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    const payload = request.body;

    for (const item of payload.items) {
      const product = await getCheckoutProduct(item.productId);

      await execute(
        `
          INSERT INTO cart_items (customer_id, product_id, quantity)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), updated_at = CURRENT_TIMESTAMP
        `,
        [customerId, item.productId, Math.min(item.quantity, Number(product.stock_quantity))]
      );
    }

    response.json({
      data: await getCustomerCart(customerId)
    });
  })
);

storefrontRouter.delete(
  "/customers/cart",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM cart_items WHERE customer_id = ?", [request.customer!.id]);
    response.json({ data: [] });
  })
);

storefrontRouter.get(
  "/customers/wishlist",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    response.json({
      data: (await getCustomerWishlist(request.customer!.id)).map((entry) => entry.productId)
    });
  })
);

storefrontRouter.post(
  "/customers/wishlist/items",
  requireCustomerAuth,
  validate(customerWishlistItemSchema),
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    const payload = request.body;

    await getCheckoutProduct(payload.productId);

    await execute(
      `
        INSERT IGNORE INTO wishlist_items (customer_id, product_id)
        VALUES (?, ?)
      `,
      [customerId, payload.productId]
    );

    response.status(201).json({
      data: (await getCustomerWishlist(customerId)).map((entry) => entry.productId)
    });
  })
);

storefrontRouter.delete(
  "/customers/wishlist/items/:productId",
  requireCustomerAuth,
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;

    await execute("DELETE FROM wishlist_items WHERE customer_id = ? AND product_id = ?", [
      customerId,
      Number(request.params.productId)
    ]);

    response.json({
      data: (await getCustomerWishlist(customerId)).map((entry) => entry.productId)
    });
  })
);

storefrontRouter.post(
  "/customers/wishlist/sync",
  requireCustomerAuth,
  validate(customerWishlistSyncSchema),
  asyncHandler(async (request, response) => {
    const customerId = request.customer!.id;
    const uniqueIds = Array.from(new Set<number>(request.body.productIds as number[]));

    for (const productId of uniqueIds) {
      await getCheckoutProduct(productId);
      await execute(
        `
          INSERT IGNORE INTO wishlist_items (customer_id, product_id)
          VALUES (?, ?)
        `,
        [customerId, productId]
      );
    }

    response.json({
      data: (await getCustomerWishlist(customerId)).map((entry) => entry.productId)
    });
  })
);

storefrontRouter.post(
  "/checkout",
  validate(checkoutSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const authenticatedCustomer = request.headers.authorization
      ? await resolveCustomerAuth(request)
      : null;

    const productIds = payload.items.map((item: { productId: number }) => item.productId);
    const products = await query<any[]>(
      `
        SELECT id, name, sku, price, discount_price, stock_quantity
        FROM products
        WHERE id IN (${productIds.map(() => "?").join(",")})
          AND deleted_at IS NULL
          AND status = 'active'
          AND visibility = 'public'
      `,
      productIds
    );

    if (products.length !== productIds.length) {
      throw new AppError("One or more products are unavailable", 400);
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    let subtotal = 0;
    for (const item of payload.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new AppError("Product not found in checkout", 400);
      }
      if (product.stock_quantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }
      subtotal += getEffectivePrice(product) * item.quantity;
    }

    let deliveryZone: any = null;
    let shippingAmount = 0;
    if (payload.deliveryZoneId) {
      const [zone] = await query<any[]>(
        "SELECT * FROM delivery_zones WHERE id = ? AND is_active = 1 LIMIT 1",
        [payload.deliveryZoneId]
      );
      if (!zone) {
        throw new AppError("Delivery zone not found", 400);
      }
      deliveryZone = zone;
      shippingAmount =
        zone.free_delivery_threshold && subtotal >= zone.free_delivery_threshold ? 0 : zone.base_fee;
    }

    let coupon: any = null;
    let discountAmount = 0;
    if (payload.couponCode) {
      const [couponRow] = await query<any[]>(
        `
          SELECT *
          FROM coupons
          WHERE code = ?
            AND is_active = 1
            AND (starts_at IS NULL OR starts_at <= NOW())
            AND (ends_at IS NULL OR ends_at >= NOW())
          LIMIT 1
        `,
        [payload.couponCode]
      );

      if (couponRow) {
        if (subtotal < couponRow.minimum_order_amount) {
          throw new AppError("Coupon minimum order amount not met", 400);
        }

        coupon = couponRow;
        if (coupon.discount_type === "percentage") {
          discountAmount = (subtotal * coupon.discount_value) / 100;
        } else if (coupon.discount_type === "fixed") {
          discountAmount = Math.min(subtotal, coupon.discount_value);
        } else if (coupon.discount_type === "free_delivery") {
          shippingAmount = 0;
        }
      }
    }

    const totalAmount = Math.max(subtotal - discountAmount, 0) + shippingAmount;
    let paymentMethod: StorefrontPaymentMethod | null = null;

    if (payload.paymentMethodId) {
      const [method] = await query<StorefrontPaymentMethod[]>(
        `
          SELECT *
          FROM payment_methods
          WHERE id = ?
            AND is_enabled = 1
          LIMIT 1
        `,
        [payload.paymentMethodId]
      );

      if (!method) {
        throw new AppError("Payment method is not available", 400);
      }

      paymentMethod = method;
    }

    const result = await withTransaction(async (connection) => {
      const [existingCustomers] = await connection.execute<any[]>(
        "SELECT id, total_spent, total_orders FROM customers WHERE email = ? LIMIT 1",
        [authenticatedCustomer?.email ?? payload.customer.email]
      );

      let customerId: number;
      let currentTotalSpent = 0;
      let currentTotalOrders = 0;

      if (existingCustomers[0]) {
        customerId = existingCustomers[0].id;
        currentTotalSpent = Number(existingCustomers[0].total_spent ?? 0);
        currentTotalOrders = Number(existingCustomers[0].total_orders ?? 0);

        await connection.execute(
          `
            UPDATE customers
            SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [
            authenticatedCustomer?.firstName ?? payload.customer.firstName,
            authenticatedCustomer?.lastName ?? payload.customer.lastName ?? null,
            authenticatedCustomer?.phone ?? payload.customer.phone ?? null,
            customerId
          ]
        );
      } else {
        const [customerResult] = await connection.execute<ResultSetHeader>(
          `
            INSERT INTO customers (
              first_name, last_name, email, phone, account_status
            ) VALUES (?, ?, ?, ?, 'active')
          `,
          [
            authenticatedCustomer?.firstName ?? payload.customer.firstName,
            authenticatedCustomer?.lastName ?? payload.customer.lastName ?? null,
            authenticatedCustomer?.email ?? payload.customer.email,
            authenticatedCustomer?.phone ?? payload.customer.phone ?? null
          ]
        );
        customerId = customerResult.insertId;
      }

      const orderNumber = buildOrderNumber();
      const [orderResult] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO orders (
            order_number, customer_id, delivery_zone_id, coupon_id, order_status, payment_status, delivery_status,
            currency_code, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, refund_amount,
            customer_notes, admin_notes, billing_first_name, billing_last_name, billing_email, billing_phone,
            billing_address_line1, billing_address_line2, billing_city, billing_region, billing_country,
            shipping_first_name, shipping_last_name, shipping_phone, shipping_address_line1, shipping_address_line2,
            shipping_city, shipping_region, shipping_country, placed_at
          ) VALUES (?, ?, ?, ?, 'pending', 'pending', 'pending', 'RWF', ?, ?, ?, 0, ?, 0, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          orderNumber,
          customerId,
          payload.deliveryZoneId ?? null,
          coupon?.id ?? null,
          subtotal,
          discountAmount,
          shippingAmount,
          totalAmount,
          payload.notes ?? null,
          payload.billing.firstName,
          payload.billing.lastName ?? null,
          payload.billing.email,
          payload.billing.phone ?? null,
          payload.billing.addressLine1,
          payload.billing.addressLine2 ?? null,
          payload.billing.city ?? null,
          payload.billing.region ?? null,
          payload.billing.country ?? null,
          payload.shipping.firstName,
          payload.shipping.lastName ?? null,
          payload.shipping.phone ?? null,
          payload.shipping.addressLine1,
          payload.shipping.addressLine2 ?? null,
          payload.shipping.city ?? null,
          payload.shipping.region ?? null,
          payload.shipping.country ?? null
        ]
      );

      const orderId = orderResult.insertId;

      for (const item of payload.items) {
        const product = productMap.get(item.productId)!;
        const unitPrice = getEffectivePrice(product);
        const lineTotal = unitPrice * item.quantity;
        const quantityAfter = product.stock_quantity - item.quantity;

        await connection.execute(
          `
            INSERT INTO order_items (
              order_id, product_id, product_name, sku, quantity, unit_price, discount_amount, tax_amount, line_total
            ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)
          `,
          [orderId, product.id, product.name, product.sku, item.quantity, unitPrice, lineTotal]
        );

        await connection.execute(
          `
            UPDATE products
            SET stock_quantity = stock_quantity - ?, total_sales = total_sales + ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [item.quantity, item.quantity, product.id]
        );

        await connection.execute(
          `
            INSERT INTO stock_movements (
              product_id, movement_type, quantity_change, quantity_before, quantity_after,
              reference_type, reference_id, notes
            ) VALUES (?, 'sale', ?, ?, ?, 'order', ?, ?)
          `,
          [
            product.id,
            -item.quantity,
            product.stock_quantity,
            quantityAfter,
            orderId,
            `Storefront checkout ${orderNumber}`
          ]
        );
      }

      await connection.execute(
        `
          INSERT INTO order_timeline (
            order_id, status_type, old_status, new_status, description, changed_by, changed_at
          ) VALUES (?, 'order', NULL, 'pending', 'Order placed from storefront checkout', NULL, NOW())
        `,
        [orderId]
      );

      let payment: Record<string, unknown> | null = null;

      if (paymentMethod) {
        const [paymentTransactionResult] = await connection.execute<ResultSetHeader>(
          `
            INSERT INTO payment_transactions (
              order_id, payment_method_id, merchant_reference, transaction_type, amount, currency_code, status, request_payload
            ) VALUES (?, ?, ?, 'charge', ?, 'RWF', 'pending', ?)
          `,
          [
            orderId,
            paymentMethod.id,
            `${orderNumber}-${Date.now()}`,
            totalAmount,
            JSON.stringify({
              orderId,
              orderNumber,
              provider: paymentMethod.provider,
              customerEmail: payload.customer.email
            })
          ]
        );

        const transactionId = paymentTransactionResult.insertId;
        let merchantReference = `${paymentMethod.code.toUpperCase()}-${orderNumber}-${transactionId}`;
        let requestPayload: Record<string, unknown> = {
          orderId,
          orderNumber,
          provider: paymentMethod.provider,
          transactionId,
          amount: totalAmount,
          currencyCode: "RWF",
          customerEmail: payload.customer.email,
          customerPhone: payload.customer.phone ?? null
        };

        if (paymentMethod.provider === "pesapal") {
          const pesapalCheckout = await initiatePesaPalCheckout({
            orderId,
            orderNumber,
            transactionId,
            totalAmount,
            currencyCode: "RWF",
            customer: {
              email: payload.customer.email,
              phone: payload.customer.phone ?? null,
              firstName: payload.customer.firstName,
              lastName: payload.customer.lastName ?? null
            },
            paymentMethod
          });

          merchantReference = pesapalCheckout.merchantReference;
          requestPayload = {
            ...pesapalCheckout.requestPayload,
            providerResponse: pesapalCheckout.responsePayload
          };
          payment = {
            provider: paymentMethod.provider,
            transactionId,
            merchantReference,
            providerReference: pesapalCheckout.providerReference,
            redirectUrl: pesapalCheckout.redirectUrl,
            callbackUrl: pesapalCheckout.callbackUrl,
            status: pesapalCheckout.redirectUrl ? "redirect_required" : "provider_confirmation_pending"
          };

          await connection.execute(
            `
              UPDATE payment_transactions
              SET provider_reference = ?,
                  response_payload = ?,
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            [
              pesapalCheckout.providerReference,
              JSON.stringify(pesapalCheckout.responsePayload),
              transactionId
            ]
          );
        } else if (paymentMethod.provider === "cash") {
          payment = {
            provider: paymentMethod.provider,
            transactionId,
            merchantReference,
            redirectUrl: null,
            status: "pending_collection"
          };
        } else {
          payment = {
            provider: paymentMethod.provider,
            transactionId,
            merchantReference,
            redirectUrl: null,
            status: paymentMethod.requires_manual_verification
              ? "pending_manual_verification"
              : "pending_provider_confirmation"
          };
        }

        await connection.execute(
          `
            UPDATE payment_transactions
            SET merchant_reference = ?, request_payload = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          [merchantReference, JSON.stringify(requestPayload), transactionId]
        );

        await connection.execute(
          `
            INSERT INTO order_timeline (
              order_id, status_type, old_status, new_status, description, changed_by, changed_at
            ) VALUES (?, 'payment', NULL, 'pending', ?, NULL, NOW())
          `,
          [orderId, `${paymentMethod.name} payment initiated from storefront checkout`]
        );
      }

      if (coupon?.id) {
        await connection.execute(
          `
            INSERT INTO coupon_usage (
              coupon_id, customer_id, order_id, used_at, discount_amount
            ) VALUES (?, ?, ?, NOW(), ?)
          `,
          [coupon.id, customerId, orderId, discountAmount]
        );
      }

      await connection.execute(
        `
          UPDATE customers
          SET total_spent = ?, total_orders = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [currentTotalSpent + totalAmount, currentTotalOrders + 1, customerId]
      );

      if (authenticatedCustomer) {
        await connection.execute("DELETE FROM cart_items WHERE customer_id = ?", [authenticatedCustomer.id]);
      }

      return {
        orderId,
        orderNumber,
        totalAmount,
        shippingAmount,
        discountAmount,
        customerId,
        deliveryZoneName: deliveryZone?.name ?? null,
        payment
      };
    });

    response.status(201).json({
      message: "Order placed successfully",
      data: result
    });
  })
);
