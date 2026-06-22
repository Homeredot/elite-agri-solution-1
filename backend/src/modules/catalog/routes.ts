import { Router } from "express";
import { z } from "zod";
import type { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { execute, query, withTransaction } from "../../config/database.js";
import { requirePermission } from "../../middleware/permissions.js";
import { validate } from "../../middleware/validate.js";
import { createAuditLog } from "../../utils/audit.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-error.js";
import { localImageSchema, optionalLocalImageSchema } from "../../utils/media.js";
import { getPagination } from "../../utils/pagination.js";
import { slugify } from "../../utils/slugify.js";

const categorySchema = z.object({
  parentId: z.coerce.number().int().positive().optional().nullable(),
  name: z.string().min(2),
  slug: z.string().optional(),
  imageUrl: optionalLocalImageSchema,
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.coerce.number().int().default(0),
  showOnHomepage: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable()
});

const subcategorySchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  name: z.string().min(2),
  slug: z.string().optional(),
  imageUrl: optionalLocalImageSchema,
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.coerce.number().int().default(0),
  showOnHomepage: z.boolean().default(false)
});

const tagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional()
});

const filterGroupSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  displayOnFrontend: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0)
});

const filterOptionSchema = z.object({
  filterGroupId: z.coerce.number().int().positive(),
  label: z.string().min(1),
  value: z.string().min(1),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().min(2),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().nonnegative(),
  discountPrice: z.coerce.number().nonnegative().optional().nullable(),
  costPrice: z.coerce.number().nonnegative().optional().nullable(),
  stockQuantity: z.coerce.number().int().default(0),
  lowStockThreshold: z.coerce.number().int().default(5),
  weight: z.coerce.number().optional().nullable(),
  weightUnit: z.string().default("kg"),
  brand: z.string().optional().nullable(),
  status: z.enum(["draft", "active", "inactive", "archived"]).default("draft"),
  productCondition: z.enum(["new", "used", "refurbished"]).default("new"),
  featuredProduct: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  isSearchable: z.boolean().default(true),
  autoHideWhenOutOfStock: z.boolean().default(false),
  visibility: z.enum(["public", "hidden"]).default("public"),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  ogImageUrl: optionalLocalImageSchema,
  publishedAt: z.string().datetime().optional().nullable(),
  categoryAssignments: z
    .array(
      z.object({
        categoryId: z.coerce.number().int().positive(),
        subcategoryId: z.coerce.number().int().positive().optional().nullable(),
        isPrimary: z.boolean().default(false)
      })
    )
    .default([]),
  tagIds: z.array(z.coerce.number().int().positive()).default([]),
  filterOptionIds: z.array(z.coerce.number().int().positive()).default([]),
  images: z
    .array(
      z.object({
        imageUrl: localImageSchema,
        altText: z.string().optional().nullable(),
        sortOrder: z.coerce.number().int().default(0),
        isPrimary: z.boolean().default(false)
      })
    )
    .default([])
});

const bulkProductSchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1),
  action: z.enum(["delete", "activate", "deactivate"])
});

const toMySqlDateTime = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const syncProductRelations = async (
  connection: PoolConnection,
  productId: number,
  payload: z.infer<typeof productSchema>
) => {
  await connection.execute("DELETE FROM product_categories WHERE product_id = ?", [productId]);
  await connection.execute("DELETE FROM product_tags_map WHERE product_id = ?", [productId]);
  await connection.execute("DELETE FROM product_filters WHERE product_id = ?", [productId]);
  await connection.execute("DELETE FROM product_images WHERE product_id = ?", [productId]);

  for (const item of payload.categoryAssignments) {
    await connection.execute(
      `
        INSERT INTO product_categories (
          product_id, category_id, subcategory_id, is_primary
        ) VALUES (?, ?, ?, ?)
      `,
      [productId, item.categoryId, item.subcategoryId ?? null, item.isPrimary ? 1 : 0]
    );
  }

  for (const tagId of payload.tagIds) {
    await connection.execute(
      "INSERT INTO product_tags_map (product_id, tag_id) VALUES (?, ?)",
      [productId, tagId]
    );
  }

  for (const filterOptionId of payload.filterOptionIds) {
    await connection.execute(
      "INSERT INTO product_filters (product_id, filter_option_id) VALUES (?, ?)",
      [productId, filterOptionId]
    );
  }

  for (const image of payload.images) {
    await connection.execute(
      `
        INSERT INTO product_images (
          product_id, image_url, alt_text, sort_order, is_primary
        ) VALUES (?, ?, ?, ?, ?)
      `,
      [productId, image.imageUrl, image.altText ?? null, image.sortOrder, image.isPrimary ? 1 : 0]
    );
  }
};

const ensureSortOrderAvailable = async ({
  table,
  sortOrder,
  currentId,
  scope = {}
}: {
  table: "categories" | "subcategories" | "filter_groups" | "filter_options";
  sortOrder: number;
  currentId?: number;
  scope?: Record<string, number>;
}) => {
  const conditions = ["sort_order = ?"];
  const params: Array<number | string> = [sortOrder];

  for (const [column, value] of Object.entries(scope)) {
    conditions.push(`${column} = ?`);
    params.push(value);
  }

  if (currentId) {
    conditions.push("id <> ?");
    params.push(currentId);
  }

  const [existing] = await query<any[]>(
    `
      SELECT id
      FROM ${table}
      WHERE ${conditions.join(" AND ")}
      LIMIT 1
    `,
    params
  );

  if (existing) {
    throw new AppError("Selected sort order spot is already taken", 409);
  }
};

export const catalogRouter = Router();

catalogRouter.get(
  "/categories",
  requirePermission("categories.manage", "products.view"),
  asyncHandler(async (_request, response) => {
    const categories = await query(
      `
        SELECT *
        FROM categories
        ORDER BY sort_order ASC, name ASC
      `
    );
    response.json({ data: categories });
  })
);

catalogRouter.post(
  "/categories",
  requirePermission("categories.manage"),
  validate(categorySchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({ table: "categories", sortOrder: payload.sortOrder });
    const result = await execute(
      `
        INSERT INTO categories (
          parent_id, name, slug, image_url, icon, description, status, sort_order,
          show_on_homepage, is_featured, seo_title, seo_description, created_by, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.parentId ?? null,
        payload.name,
        payload.slug || slugify(payload.name),
        payload.imageUrl ?? null,
        payload.icon ?? null,
        payload.description ?? null,
        payload.status,
        payload.sortOrder,
        payload.showOnHomepage ? 1 : 0,
        payload.isFeatured ? 1 : 0,
        payload.seoTitle ?? null,
        payload.seoDescription ?? null,
        request.adminUser!.id,
        request.adminUser!.id
      ]
    );

    response.status(201).json({ id: (result as ResultSetHeader).insertId });
  })
);

catalogRouter.put(
  "/categories/:id",
  requirePermission("categories.manage"),
  validate(categorySchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "categories",
      sortOrder: payload.sortOrder,
      currentId: Number(request.params.id)
    });
    await execute(
      `
        UPDATE categories
        SET parent_id = ?, name = ?, slug = ?, image_url = ?, icon = ?, description = ?,
            status = ?, sort_order = ?, show_on_homepage = ?, is_featured = ?,
            seo_title = ?, seo_description = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.parentId ?? null,
        payload.name,
        payload.slug || slugify(payload.name),
        payload.imageUrl ?? null,
        payload.icon ?? null,
        payload.description ?? null,
        payload.status,
        payload.sortOrder,
        payload.showOnHomepage ? 1 : 0,
        payload.isFeatured ? 1 : 0,
        payload.seoTitle ?? null,
        payload.seoDescription ?? null,
        request.adminUser!.id,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Category updated" });
  })
);

catalogRouter.delete(
  "/categories/:id",
  requirePermission("categories.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM categories WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Category deleted" });
  })
);

catalogRouter.get(
  "/subcategories",
  requirePermission("categories.manage", "products.view"),
  asyncHandler(async (request, response) => {
    const categoryId = request.query.categoryId ? Number(request.query.categoryId) : null;
    const subcategories = await query(
      `
        SELECT *
        FROM subcategories
        ${categoryId ? "WHERE category_id = ?" : ""}
        ORDER BY sort_order ASC, name ASC
      `,
      categoryId ? [categoryId] : []
    );
    response.json({ data: subcategories });
  })
);

catalogRouter.post(
  "/subcategories",
  requirePermission("categories.manage"),
  validate(subcategorySchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "subcategories",
      sortOrder: payload.sortOrder,
      scope: { category_id: payload.categoryId }
    });
    const result = await execute(
      `
        INSERT INTO subcategories (
          category_id, name, slug, image_url, description, status, sort_order, show_on_homepage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.categoryId,
        payload.name,
        payload.slug || slugify(payload.name),
        payload.imageUrl ?? null,
        payload.description ?? null,
        payload.status,
        payload.sortOrder,
        payload.showOnHomepage ? 1 : 0
      ]
    );
    response.status(201).json({ id: (result as ResultSetHeader).insertId });
  })
);

catalogRouter.put(
  "/subcategories/:id",
  requirePermission("categories.manage"),
  validate(subcategorySchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "subcategories",
      sortOrder: payload.sortOrder,
      currentId: Number(request.params.id),
      scope: { category_id: payload.categoryId }
    });
    await execute(
      `
        UPDATE subcategories
        SET category_id = ?, name = ?, slug = ?, image_url = ?, description = ?,
            status = ?, sort_order = ?, show_on_homepage = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.categoryId,
        payload.name,
        payload.slug || slugify(payload.name),
        payload.imageUrl ?? null,
        payload.description ?? null,
        payload.status,
        payload.sortOrder,
        payload.showOnHomepage ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Subcategory updated" });
  })
);

catalogRouter.delete(
  "/subcategories/:id",
  requirePermission("categories.manage"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM subcategories WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Subcategory deleted" });
  })
);

catalogRouter.get(
  "/tags",
  requirePermission("products.view", "products.create", "products.update"),
  asyncHandler(async (_request, response) => {
    const tags = await query("SELECT * FROM tags ORDER BY name ASC");
    response.json({ data: tags });
  })
);

catalogRouter.post(
  "/tags",
  requirePermission("products.create", "products.update"),
  validate(tagSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const result = await execute(
      "INSERT INTO tags (name, slug) VALUES (?, ?)",
      [payload.name, payload.slug || slugify(payload.name)]
    );
    response.status(201).json({ id: (result as ResultSetHeader).insertId });
  })
);

catalogRouter.put(
  "/tags/:id",
  requirePermission("products.update"),
  validate(tagSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await execute(
      `
        UPDATE tags
        SET name = ?, slug = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [payload.name, payload.slug || slugify(payload.name), Number(request.params.id)]
    );
    response.json({ message: "Tag updated" });
  })
);

catalogRouter.delete(
  "/tags/:id",
  requirePermission("products.update"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM tags WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Tag deleted" });
  })
);

catalogRouter.get(
  "/filters/groups",
  requirePermission("products.view", "products.update"),
  asyncHandler(async (_request, response) => {
    const groups = await query(
      "SELECT * FROM filter_groups ORDER BY sort_order ASC, name ASC"
    );
    response.json({ data: groups });
  })
);

catalogRouter.post(
  "/filters/groups",
  requirePermission("products.update"),
  validate(filterGroupSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({ table: "filter_groups", sortOrder: payload.sortOrder });
    const result = await execute(
      `
        INSERT INTO filter_groups (name, code, display_on_frontend, sort_order)
        VALUES (?, ?, ?, ?)
      `,
      [payload.name, payload.code, payload.displayOnFrontend ? 1 : 0, payload.sortOrder]
    );
    response.status(201).json({ id: (result as ResultSetHeader).insertId });
  })
);

catalogRouter.put(
  "/filters/groups/:id",
  requirePermission("products.update"),
  validate(filterGroupSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "filter_groups",
      sortOrder: payload.sortOrder,
      currentId: Number(request.params.id)
    });
    await execute(
      `
        UPDATE filter_groups
        SET name = ?, code = ?, display_on_frontend = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [payload.name, payload.code, payload.displayOnFrontend ? 1 : 0, payload.sortOrder, Number(request.params.id)]
    );
    response.json({ message: "Filter group updated" });
  })
);

catalogRouter.delete(
  "/filters/groups/:id",
  requirePermission("products.update"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM filter_groups WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Filter group deleted" });
  })
);

catalogRouter.get(
  "/filters/options",
  requirePermission("products.view", "products.update"),
  asyncHandler(async (request, response) => {
    const filterGroupId = request.query.filterGroupId ? Number(request.query.filterGroupId) : null;
    const options = await query(
      `
        SELECT *
        FROM filter_options
        ${filterGroupId ? "WHERE filter_group_id = ?" : ""}
        ORDER BY sort_order ASC, label ASC
      `,
      filterGroupId ? [filterGroupId] : []
    );
    response.json({ data: options });
  })
);

catalogRouter.post(
  "/filters/options",
  requirePermission("products.update"),
  validate(filterOptionSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "filter_options",
      sortOrder: payload.sortOrder,
      scope: { filter_group_id: payload.filterGroupId }
    });
    const result = await execute(
      `
        INSERT INTO filter_options (filter_group_id, label, value, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        payload.filterGroupId,
        payload.label,
        payload.value,
        payload.sortOrder,
        payload.isActive ? 1 : 0
      ]
    );
    response.status(201).json({ id: (result as ResultSetHeader).insertId });
  })
);

catalogRouter.put(
  "/filters/options/:id",
  requirePermission("products.update"),
  validate(filterOptionSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    await ensureSortOrderAvailable({
      table: "filter_options",
      sortOrder: payload.sortOrder,
      currentId: Number(request.params.id),
      scope: { filter_group_id: payload.filterGroupId }
    });
    await execute(
      `
        UPDATE filter_options
        SET filter_group_id = ?, label = ?, value = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [
        payload.filterGroupId,
        payload.label,
        payload.value,
        payload.sortOrder,
        payload.isActive ? 1 : 0,
        Number(request.params.id)
      ]
    );
    response.json({ message: "Filter option updated" });
  })
);

catalogRouter.delete(
  "/filters/options/:id",
  requirePermission("products.update"),
  asyncHandler(async (request, response) => {
    await execute("DELETE FROM filter_options WHERE id = ?", [Number(request.params.id)]);
    response.json({ message: "Filter option deleted" });
  })
);

catalogRouter.get(
  "/products",
  requirePermission("products.view"),
  asyncHandler(async (request, response) => {
    const { page, limit, offset, pageSize } = getPagination(request.query);
    const search = typeof request.query.search === "string" ? request.query.search.trim() : "";
    const status = typeof request.query.status === "string" ? request.query.status : "";
    const categoryId = request.query.categoryId ? Number(request.query.categoryId) : null;
    const params: unknown[] = [];
    const conditions = ["p.deleted_at IS NULL"];

    if (search) {
      conditions.push("(p.name LIKE ? OR p.sku LIKE ? OR p.brand LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (status) {
      conditions.push("p.status = ?");
      params.push(status);
    }

    if (categoryId) {
      conditions.push("pc.category_id = ?");
      params.push(categoryId);
    }

    const whereSql = `WHERE ${conditions.join(" AND ")}`;

    const data = await query(
      `
        SELECT DISTINCT
          p.id,
          p.name,
          p.sku,
          p.price,
          p.discount_price,
          p.stock_quantity,
          p.status,
          p.featured_product,
          p.best_seller,
          p.new_arrival,
          p.visibility,
          p.created_at,
          c.name AS primary_category
        FROM products p
        LEFT JOIN product_categories pc ON pc.product_id = p.id AND pc.is_primary = 1
        LEFT JOIN categories c ON c.id = pc.category_id
        ${whereSql}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [{ total }] = await query<{ total: number }[]>(
      `
        SELECT COUNT(DISTINCT p.id) AS total
        FROM products p
        LEFT JOIN product_categories pc ON pc.product_id = p.id
        ${whereSql}
      `,
      params
    );

    response.json({
      data,
      meta: {
        page,
        pageSize,
        total
      }
    });
  })
);

catalogRouter.get(
  "/products/:id",
  requirePermission("products.view"),
  asyncHandler(async (request, response) => {
    const productId = Number(request.params.id);
    const [product] = await query<any[]>(
      `
        SELECT *
        FROM products
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1
      `,
      [productId]
    );

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const [categories, tags, filters, images] = await Promise.all([
      query(
        `
          SELECT category_id, subcategory_id, is_primary
          FROM product_categories
          WHERE product_id = ?
        `,
        [productId]
      ),
      query(
        `
          SELECT ptm.tag_id, t.name
          FROM product_tags_map ptm
          INNER JOIN tags t ON t.id = ptm.tag_id
          WHERE ptm.product_id = ?
        `,
        [productId]
      ),
      query(
        `
          SELECT pf.filter_option_id, fo.label, fo.value, fg.name AS group_name
          FROM product_filters pf
          INNER JOIN filter_options fo ON fo.id = pf.filter_option_id
          INNER JOIN filter_groups fg ON fg.id = fo.filter_group_id
          WHERE pf.product_id = ?
        `,
        [productId]
      ),
      query(
        `
          SELECT id, image_url, alt_text, sort_order, is_primary
          FROM product_images
          WHERE product_id = ?
          ORDER BY sort_order ASC
        `,
        [productId]
      )
    ]);

    response.json({
      data: {
        ...product,
        categories,
        tags,
        filters,
        images
      }
    });
  })
);

catalogRouter.post(
  "/products",
  requirePermission("products.create"),
  validate(productSchema),
  asyncHandler(async (request, response) => {
    const payload = request.body;
    const publishedAt = toMySqlDateTime(payload.publishedAt);

    const productId = await withTransaction(async (connection) => {
      const [result] = await connection.execute<ResultSetHeader>(
        `
          INSERT INTO products (
            name, slug, sku, short_description, description, price, discount_price, cost_price,
            stock_quantity, low_stock_threshold, weight, weight_unit, brand, status, product_condition,
            featured_product, best_seller, new_arrival, is_searchable, auto_hide_when_out_of_stock,
            visibility, meta_title, meta_description, og_image_url, published_at, created_by, updated_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          payload.name,
          payload.slug || slugify(payload.name),
          payload.sku,
          payload.shortDescription ?? null,
          payload.description ?? null,
          payload.price,
          payload.discountPrice ?? null,
          payload.costPrice ?? null,
          payload.stockQuantity,
          payload.lowStockThreshold,
          payload.weight ?? null,
          payload.weightUnit,
          payload.brand ?? null,
          payload.status,
          payload.productCondition,
          payload.featuredProduct ? 1 : 0,
          payload.bestSeller ? 1 : 0,
          payload.newArrival ? 1 : 0,
          payload.isSearchable ? 1 : 0,
          payload.autoHideWhenOutOfStock ? 1 : 0,
          payload.visibility,
          payload.metaTitle ?? null,
          payload.metaDescription ?? null,
          payload.ogImageUrl ?? null,
          publishedAt,
          request.adminUser!.id,
          request.adminUser!.id
        ]
      );

      await syncProductRelations(connection, result.insertId, payload);
      return result.insertId;
    });

    await createAuditLog({
      adminUserId: request.adminUser!.id,
      actionType: "create",
      moduleName: "products",
      targetType: "product",
      targetId: productId,
      description: `Created product ${payload.name}`,
      ipAddress: request.ip ?? null,
      userAgent: request.get("user-agent") ?? null,
      newValues: payload
    });

    response.status(201).json({ id: productId });
  })
);

catalogRouter.put(
  "/products/:id",
  requirePermission("products.update"),
  validate(productSchema),
  asyncHandler(async (request, response) => {
    const productId = Number(request.params.id);
    const payload = request.body;
    const publishedAt = toMySqlDateTime(payload.publishedAt);

    await withTransaction(async (connection) => {
      await connection.execute(
        `
          UPDATE products
          SET name = ?, slug = ?, sku = ?, short_description = ?, description = ?, price = ?, discount_price = ?,
              cost_price = ?, stock_quantity = ?, low_stock_threshold = ?, weight = ?, weight_unit = ?, brand = ?,
              status = ?, product_condition = ?, featured_product = ?, best_seller = ?, new_arrival = ?,
              is_searchable = ?, auto_hide_when_out_of_stock = ?, visibility = ?, meta_title = ?,
              meta_description = ?, og_image_url = ?, published_at = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND deleted_at IS NULL
        `,
        [
          payload.name,
          payload.slug || slugify(payload.name),
          payload.sku,
          payload.shortDescription ?? null,
          payload.description ?? null,
          payload.price,
          payload.discountPrice ?? null,
          payload.costPrice ?? null,
          payload.stockQuantity,
          payload.lowStockThreshold,
          payload.weight ?? null,
          payload.weightUnit,
          payload.brand ?? null,
          payload.status,
          payload.productCondition,
          payload.featuredProduct ? 1 : 0,
          payload.bestSeller ? 1 : 0,
          payload.newArrival ? 1 : 0,
          payload.isSearchable ? 1 : 0,
          payload.autoHideWhenOutOfStock ? 1 : 0,
          payload.visibility,
          payload.metaTitle ?? null,
          payload.metaDescription ?? null,
          payload.ogImageUrl ?? null,
          publishedAt,
          request.adminUser!.id,
          productId
        ]
      );

      await syncProductRelations(connection, productId, payload);
    });

    response.json({ message: "Product updated" });
  })
);

catalogRouter.delete(
  "/products/:id",
  requirePermission("products.delete"),
  asyncHandler(async (request, response) => {
    await execute(
      "UPDATE products SET deleted_at = NOW(), status = 'archived' WHERE id = ?",
      [Number(request.params.id)]
    );
    response.json({ message: "Product deleted" });
  })
);

catalogRouter.post(
  "/products/bulk",
  requirePermission("products.update", "products.delete"),
  validate(bulkProductSchema),
  asyncHandler(async (request, response) => {
    const { ids, action } = request.body;

    if (action === "delete") {
      await execute(
        `UPDATE products SET deleted_at = NOW(), status = 'archived' WHERE id IN (${ids.map(() => "?").join(",")})`,
        ids
      );
    } else {
      await execute(
        `UPDATE products SET status = ? WHERE id IN (${ids.map(() => "?").join(",")})`,
        [action === "activate" ? "active" : "inactive", ...ids]
      );
    }

    response.json({ message: "Bulk action completed" });
  })
);
