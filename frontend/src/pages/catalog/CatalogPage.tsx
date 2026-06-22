import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Filter,
  FolderTree,
  MousePointerClick,
  Package,
  PencilLine,
  Plus,
  Search,
  Tags,
  Trash2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ApiError, api, resolveMediaUrl } from "../../api/client";
import { DynamicForm, type FieldConfig } from "../../components/forms/DynamicForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { useAdminNotice } from "../../components/ui/AdminNoticeProvider";
import { useAdminStatusNotice } from "../../components/ui/useAdminStatusNotice";
import { CATEGORY_ICON_OPTIONS, categoryIconMap } from "../../utils/icons";

type OptionCard = {
  value: string;
  label: string;
  description?: string;
};

type SortSlot = {
  sortOrder: number;
  label: string;
  isTaken: boolean;
  occupant: any | null;
};

type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
};

type ProductFilters = {
  search: string;
  status: string;
  categoryId: string;
  pageSize: number;
};

const PRODUCT_FORM_FIELDS: FieldConfig[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "sku", label: "SKU", type: "text" },
  { name: "brand", label: "Brand", type: "text" },
  { name: "price", label: "Price", type: "number" },
  { name: "discountPrice", label: "Discount Price", type: "number" },
  { name: "costPrice", label: "Cost Price", type: "number" },
  { name: "stockQuantity", label: "Stock Quantity", type: "number" },
  { name: "lowStockThreshold", label: "Low Stock Threshold", type: "number" },
  { name: "weight", label: "Weight", type: "number" },
  {
    name: "weightUnit",
    label: "Weight Unit",
    type: "select",
    options: ["kg", "g", "lb"].map((value) => ({ label: value, value }))
  },
  { name: "shortDescription", label: "Short Description", type: "textarea" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["draft", "active", "inactive", "archived"].map((value) => ({ label: value, value }))
  },
  {
    name: "productCondition",
    label: "Condition",
    type: "select",
    options: ["new", "used", "refurbished"].map((value) => ({ label: value, value }))
  },
  {
    name: "visibility",
    label: "Visibility",
    type: "select",
    options: ["public", "hidden"].map((value) => ({ label: value, value }))
  },
  {
    name: "categoryAssignments",
    label: "Category Assignments",
    type: "category-assignments"
  },
  {
    name: "tagIds",
    label: "Tags",
    type: "multi-select"
  },
  {
    name: "filterOptionIds",
    label: "Filter Options",
    type: "multi-select"
  },
  { name: "images", label: "Product Images", type: "image-list", mediaFolder: "Products" },
  { name: "ogImageUrl", label: "Open Graph Image", type: "image", mediaFolder: "Products" },
  { name: "metaTitle", label: "Meta Title", type: "text" },
  { name: "metaDescription", label: "Meta Description", type: "textarea" },
  { name: "publishedAt", label: "Published At", type: "datetime-local" },
  { name: "featuredProduct", label: "Featured Product", type: "checkbox" },
  { name: "bestSeller", label: "Best Seller", type: "checkbox" },
  { name: "newArrival", label: "New Arrival", type: "checkbox" },
  { name: "isSearchable", label: "Searchable", type: "checkbox" },
  { name: "autoHideWhenOutOfStock", label: "Auto Hide Out of Stock", type: "checkbox" }
];

const CATEGORY_FORM_FIELDS: FieldConfig[] = [
  { name: "name", label: "Category Name", type: "text" },
  { name: "imageUrl", label: "Category Image", type: "image", mediaFolder: "Categories" },
  { name: "icon", label: "Icon", type: "icon", options: CATEGORY_ICON_OPTIONS },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["active", "inactive"].map((value) => ({ label: value, value }))
  },
  { name: "showOnHomepage", label: "Show On Homepage", type: "checkbox" },
  { name: "isFeatured", label: "Featured", type: "checkbox" },
  { name: "seoTitle", label: "SEO Title", type: "text" },
  { name: "seoDescription", label: "SEO Description", type: "textarea" }
];

const SUBCATEGORY_FORM_FIELDS: FieldConfig[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "imageUrl", label: "Subcategory Image", type: "image", mediaFolder: "Categories" },
  { name: "description", label: "Description", type: "textarea" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["active", "inactive"].map((value) => ({ label: value, value }))
  },
  { name: "showOnHomepage", label: "Show On Homepage", type: "checkbox" }
];

const TAG_FORM_FIELDS: FieldConfig[] = [{ name: "name", label: "Tag Name", type: "text" }];

const FILTER_GROUP_FORM_FIELDS: FieldConfig[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "code", label: "Code", type: "text" },
  { name: "displayOnFrontend", label: "Display On Frontend", type: "checkbox" }
];

const FILTER_OPTION_FORM_FIELDS: FieldConfig[] = [
  { name: "label", label: "Label", type: "text" },
  { name: "value", label: "Value", type: "text" },
  { name: "isActive", label: "Active", type: "checkbox" }
];

const EMPTY_PRODUCT_FORM = {
  name: "",
  sku: "",
  brand: "",
  price: "",
  discountPrice: "",
  costPrice: "",
  stockQuantity: 0,
  lowStockThreshold: 5,
  weight: "",
  weightUnit: "kg",
  shortDescription: "",
  description: "",
  status: "draft",
  productCondition: "new",
  visibility: "public",
  categoryAssignments: "[]",
  tagIds: "[]",
  filterOptionIds: "[]",
  images: "[]",
  ogImageUrl: "",
  metaTitle: "",
  metaDescription: "",
  publishedAt: "",
  featuredProduct: false,
  bestSeller: false,
  newArrival: false,
  isSearchable: true,
  autoHideWhenOutOfStock: false
};

const EMPTY_CATEGORY_FORM = {
  name: "",
  imageUrl: "",
  icon: "",
  description: "",
  status: "active",
  showOnHomepage: false,
  isFeatured: false,
  seoTitle: "",
  seoDescription: ""
};

const EMPTY_SUBCATEGORY_FORM = {
  name: "",
  imageUrl: "",
  description: "",
  status: "active",
  showOnHomepage: false
};

const EMPTY_TAG_FORM = {
  name: ""
};

const EMPTY_FILTER_GROUP_FORM = {
  name: "",
  code: "",
  displayOnFrontend: true
};

const EMPTY_FILTER_OPTION_FORM = {
  label: "",
  value: "",
  isActive: true
};

const parseJson = <T,>(value: unknown, fallback: T): T => {
  if (typeof value === "string") {
    if (!value.trim()) {
      return fallback;
    }

    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return value as T;
};

const stringifyJson = (value: unknown) => JSON.stringify(value ?? [], null, 2);

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback;
  }

  const details =
    error.details && typeof error.details === "object"
      ? (error.details as {
          fieldErrors?: Record<string, string[] | undefined>;
          formErrors?: string[];
        })
      : null;

  const fieldMessages = details?.fieldErrors
    ? Object.values(details.fieldErrors)
        .flat()
        .filter((message): message is string => Boolean(message))
    : [];
  const formMessages = details?.formErrors?.filter((message): message is string => Boolean(message)) ?? [];

  return fieldMessages[0] ?? formMessages[0] ?? error.message ?? fallback;
};

const formatDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoDateTime = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const toNullableNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const formatCurrency = (value: unknown) => {
  const numericValue = Number(value ?? 0);
  return `RWF ${numericValue.toLocaleString()}`;
};

const buildSortSlots = ({
  items,
  currentId,
  maxSlots,
  filter
}: {
  items: any[];
  currentId: number | null;
  maxSlots?: number;
  filter?: (item: any) => boolean;
}): SortSlot[] => {
  const filteredItems = (filter ? items.filter(filter) : items).sort(
    (left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0)
  );
  const slotCount = maxSlots ?? Math.max(filteredItems.length + 1, 4);

  return Array.from({ length: slotCount }, (_, index) => {
    const occupant = filteredItems.find((item) => Number(item.sort_order ?? 0) === index) ?? null;
    const isTaken = Boolean(occupant && Number(occupant.id) !== currentId);

    return {
      sortOrder: index,
      label: `Spot ${index + 1}`,
      isTaken,
      occupant
    };
  });
};

const getPreferredSortOrder = (slots: SortSlot[], currentId: number | null, preferredSortOrder?: number) => {
  const preferredSlot = slots.find(
    (slot) =>
      slot.sortOrder === preferredSortOrder &&
      (!slot.occupant || Number(slot.occupant.id) === currentId)
  );

  if (preferredSlot) {
    return preferredSlot.sortOrder;
  }

  return slots.find((slot) => !slot.occupant || Number(slot.occupant.id) === currentId)?.sortOrder ?? 0;
};

const getCategoryIconComponent = (iconName?: string | null) =>
  (iconName ? categoryIconMap[iconName] : null) ?? Package;

const loadProductEditValues = async (row: Record<string, any>) => {
  const response = await api.get<{ data: any }>(`/catalog/products/${row.id}`);
  const product = response.data;

  return {
    ...product,
    brand: product.brand ?? "",
    shortDescription: product.short_description ?? "",
    description: product.description ?? "",
    discountPrice: product.discount_price ?? "",
    costPrice: product.cost_price ?? "",
    stockQuantity: Number(product.stock_quantity ?? 0),
    lowStockThreshold: Number(product.low_stock_threshold ?? 5),
    weight: product.weight ?? "",
    weightUnit: product.weight_unit ?? "kg",
    status: product.status ?? "draft",
    productCondition: product.product_condition ?? "new",
    visibility: product.visibility ?? "public",
    metaTitle: product.meta_title ?? "",
    metaDescription: product.meta_description ?? "",
    ogImageUrl: product.og_image_url ?? "",
    publishedAt: formatDateTimeInputValue(product.published_at),
    featuredProduct: Boolean(product.featured_product),
    bestSeller: Boolean(product.best_seller),
    newArrival: Boolean(product.new_arrival),
    isSearchable: Boolean(product.is_searchable),
    autoHideWhenOutOfStock: Boolean(product.auto_hide_when_out_of_stock),
    categoryAssignments: stringifyJson(
      (product.categories ?? []).map((item: any) => ({
        categoryId: item.category_id,
        subcategoryId: item.subcategory_id,
        isPrimary: Boolean(item.is_primary)
      }))
    ),
    tagIds: stringifyJson((product.tags ?? []).map((item: any) => item.tag_id)),
    filterOptionIds: stringifyJson((product.filters ?? []).map((item: any) => item.filter_option_id)),
    images: stringifyJson(
      (product.images ?? []).map((item: any) => ({
        imageUrl: item.image_url,
        altText: item.alt_text,
        sortOrder: item.sort_order,
        isPrimary: Boolean(item.is_primary)
      }))
    )
  };
};

const StatusChip = ({
  label,
  active
}: {
  label: string;
  active: boolean;
}) => <span className={`banner-status-chip${active ? " active" : ""}`}>{label}</span>;

const OptionCardsField = ({
  label,
  options,
  selectedValue,
  onSelect,
  meta
}: {
  label: string;
  options: OptionCard[];
  selectedValue: string;
  onSelect: (value: string) => void;
  meta?: (option: OptionCard) => { note?: string; disabled?: boolean } | undefined;
}) => (
  <div className="field">
    <span>{label}</span>
    <div className="banner-slot-grid">
      {options.map((option) => {
        const details = meta?.(option);
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={details?.disabled}
            className={`banner-position-card${isSelected ? " selected" : ""}${details?.disabled ? " occupied" : ""}`}
            onClick={() => onSelect(option.value)}
          >
            <strong>{option.label}</strong>
            <span>{option.description || "Choose this option."}</span>
            {details?.note ? <small>{details.note}</small> : null}
          </button>
        );
      })}
    </div>
  </div>
);

const SortSlotsField = ({
  label,
  description,
  slots,
  selectedSortOrder,
  currentId,
  onSelect
}: {
  label: string;
  description?: string;
  slots: SortSlot[];
  selectedSortOrder: number;
  currentId: number | null;
  onSelect: (sortOrder: number) => void;
}) => (
  <div className="field">
    <div className="banner-slot-header">
      <span>{label}</span>
      {description ? <strong>{description}</strong> : null}
    </div>
    <div className="banner-slot-grid">
      {slots.map((slot) => {
        const occupiedByCurrent = Boolean(slot.occupant && Number(slot.occupant.id) === currentId);
        const isSelected = selectedSortOrder === slot.sortOrder;

        return (
          <button
            key={slot.sortOrder}
            type="button"
            disabled={slot.isTaken}
            className={`banner-slot-card${isSelected ? " selected" : ""}${slot.isTaken ? " occupied" : ""}`}
            onClick={() => onSelect(slot.sortOrder)}
          >
            <strong>{slot.label}</strong>
            <span>
              {occupiedByCurrent
                ? "Current item"
                : slot.isTaken
                  ? slot.occupant?.name || slot.occupant?.label || slot.occupant?.code || "Taken"
                  : "Available"}
            </span>
            <small>{slot.isTaken ? "Choose another spot" : "Ready for use"}</small>
          </button>
        );
      })}
    </div>
  </div>
);

const ProductManager = ({
  products,
  meta,
  filters,
  onFiltersChange,
  onPageChange,
  categoryOptions,
  subcategoryOptions,
  tagOptions,
  filterOptionChoices,
  categoryNameById
}: {
  products: any[];
  meta: PaginationMeta;
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onPageChange: (page: number) => void;
  categoryOptions: Array<{ label: string; value: string }>;
  subcategoryOptions: Array<{ label: string; value: string; parentValue: string }>;
  tagOptions: Array<{ label: string; value: string }>;
  filterOptionChoices: Array<{ label: string; value: string }>;
  categoryNameById: Map<string, string>;
}) => {
  const queryClient = useQueryClient();
  const { confirm, notify } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_PRODUCT_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_PRODUCT_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/products/${editingId}`, payload) : api.post("/catalog/products", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
      setFormSuccess(editingId ? "Product updated." : "Product created.");
      notify({
        tone: "success",
        title: editingId ? "Product updated" : "Product created",
        message: editingId
          ? "The product changes were saved successfully."
          : "The new product is now available in the catalog."
      });
      resetProductForm();
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(getApiErrorMessage(error, "Failed to save product"));
      notify({
        tone: "error",
        title: "Failed to save product",
        message: getApiErrorMessage(error, "Failed to save product")
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: number) => api.delete(`/catalog/products/${productId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
      setFormSuccess("Product archived.");
      setFormError(null);
      notify({
        tone: "success",
        title: "Product archived",
        message: "The product has been removed from active catalog views."
      });
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to archive product");
      notify({
        tone: "error",
        title: "Failed to archive product",
        message: error instanceof Error ? error.message : "Failed to archive product"
      });
    }
  });

  const resetProductForm = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setFormDefaults(EMPTY_PRODUCT_FORM);
    setFormSnapshot(EMPTY_PRODUCT_FORM);
  };

  const requestArchive = async (productId: number) => {
    const confirmed = await confirm({
      title: "Archive product",
      message: "Are you sure you want to archive this product? Customers will stop seeing it in normal active catalog lists.",
      confirmLabel: "Archive product",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(productId);
    }
  };

  const previewImages = parseJson<Array<{ imageUrl?: string; isPrimary?: boolean }>>(formSnapshot.images, []);
  const primaryPreviewImage =
    previewImages.find((image) => image.isPrimary)?.imageUrl ??
    previewImages[0]?.imageUrl ??
    (typeof formSnapshot.ogImageUrl === "string" ? formSnapshot.ogImageUrl : "");
  const categoryAssignments = parseJson<
    Array<{ categoryId?: number | string; subcategoryId?: number | string; isPrimary?: boolean }>
  >(formSnapshot.categoryAssignments, []);
  const previewCategoryNames = categoryAssignments
    .map((item) => categoryNameById.get(String(item.categoryId ?? "")))
    .filter((value): value is string => Boolean(value));
  const previewTagIds = parseJson<Array<number | string>>(formSnapshot.tagIds, []);
  const previewFilterIds = parseJson<Array<number | string>>(formSnapshot.filterOptionIds, []);
  const totalPages = Math.max(Math.ceil(meta.total / meta.pageSize), 1);
  const pageStart = meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const pageEnd = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Boxes size={18} />
            </span>
            Products
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setFormDefaults({
                ...EMPTY_PRODUCT_FORM,
                categoryAssignments: "[]",
                tagIds: "[]",
                filterOptionIds: "[]",
                images: "[]"
              });
              setFormSnapshot({
                ...EMPTY_PRODUCT_FORM,
                categoryAssignments: "[]",
                tagIds: "[]",
                filterOptionIds: "[]",
                images: "[]"
              });
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Product
          </Button>
        </div>

        <div className="catalog-filter-bar">
          <label className="field">
            <span>Search products</span>
            <input
              value={filters.search}
              placeholder="Search name, SKU, or brand"
              onChange={(event) => onFiltersChange({ search: event.target.value })}
            />
          </label>
          <label className="field">
            <span>Status</span>
            <select value={filters.status} onChange={(event) => onFiltersChange({ status: event.target.value })}>
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="field">
            <span>Category</span>
            <select value={filters.categoryId} onChange={(event) => onFiltersChange({ categoryId: event.target.value })}>
              <option value="">All categories</option>
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Rows per page</span>
            <select
              value={filters.pageSize}
              onChange={(event) => onFiltersChange({ pageSize: Number(event.target.value) })}
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <Button variant="ghost" onClick={() => onFiltersChange({ search: "", status: "", categoryId: "" })}>
            <Search size={16} />
            Clear
          </Button>
        </div>

        <DataTable
          rows={products}
          columns={[
            {
              key: "name",
              title: "Product",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.name}</strong>
                  <span className="field-hint">{row.primary_category || "No primary category"}</span>
                </div>
              )
            },
            { key: "sku", title: "SKU", render: (row) => row.sku },
            { key: "price", title: "Price", render: (row) => formatCurrency(row.price) },
            { key: "stock", title: "Stock", render: (row) => row.stock_quantity },
            {
              key: "status",
              title: "Status",
              render: (row) => <StatusChip label={row.status} active={row.status === "active"} />
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      const values = await loadProductEditValues(row);
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setFormDefaults({
                        ...values,
                        categoryAssignments: values.categoryAssignments ?? "[]",
                        tagIds: values.tagIds ?? "[]",
                        filterOptionIds: values.filterOptionIds ?? "[]",
                        images: values.images ?? "[]"
                      });
                      setFormSnapshot({
                        ...values,
                        categoryAssignments: values.categoryAssignments ?? "[]",
                        tagIds: values.tagIds ?? "[]",
                        filterOptionIds: values.filterOptionIds ?? "[]",
                        images: values.images ?? "[]"
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestArchive(Number(row.id))}>
                    <Trash2 size={16} />
                    Archive
                  </Button>
                </div>
              )
            }
          ]}
        />

        <div className="pagination-bar">
          <span className="field-hint">
            Showing {pageStart}-{pageEnd} of {meta.total} products
          </span>
          <div className="row-actions">
            <Button variant="ghost" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
              <ChevronLeft size={16} />
              Previous
            </Button>
            <span className="pagination-status">
              Page {meta.page} of {totalPages}
            </span>
            <Button variant="ghost" disabled={meta.page >= totalPages} onClick={() => onPageChange(meta.page + 1)}>
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Product" : "Create Product"} onClose={resetProductForm}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            {formError ? <div className="error-banner">{formError}</div> : null}
            <DynamicForm
              fields={PRODUCT_FORM_FIELDS.map((field) => {
                if (field.name === "categoryAssignments") {
                  return {
                    ...field,
                    options: categoryOptions,
                    subOptions: subcategoryOptions
                  };
                }

                if (field.name === "tagIds") {
                  return {
                    ...field,
                    options: tagOptions,
                    valueType: "number"
                  };
                }

                if (field.name === "filterOptionIds") {
                  return {
                    ...field,
                    options: filterOptionChoices,
                    valueType: "number"
                  };
                }

                return field;
              })}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Product" : "Create Product"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const name = typeof values.name === "string" ? values.name.trim() : "";
                const sku = typeof values.sku === "string" ? values.sku.trim() : "";
                const price = Number(values.price ?? 0);
                const stockQuantity = Number(values.stockQuantity ?? 0);
                const lowStockThreshold = Number(values.lowStockThreshold ?? 5);
                const images = parseJson(values.images, []) as Array<{ imageUrl?: string }>;

                if (!name || !sku) {
                  setFormError("Product name and SKU are required.");
                  return;
                }

                if (sku.length < 2) {
                  setFormError("SKU must contain at least 2 characters.");
                  return;
                }

                if (Number.isNaN(price) || price < 0) {
                  setFormError("Price must be zero or more.");
                  return;
                }

                if (Number.isNaN(stockQuantity) || stockQuantity < 0) {
                  setFormError("Stock quantity must be zero or more.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  name,
                  sku,
                  brand: typeof values.brand === "string" && values.brand.trim() ? values.brand : null,
                  price,
                  discountPrice: toNullableNumber(values.discountPrice),
                  costPrice: toNullableNumber(values.costPrice),
                  stockQuantity,
                  lowStockThreshold: Number.isNaN(lowStockThreshold) ? 5 : lowStockThreshold,
                  weight: toNullableNumber(values.weight),
                  weightUnit: values.weightUnit || "kg",
                  shortDescription: typeof values.shortDescription === "string" && values.shortDescription.trim() ? values.shortDescription : null,
                  description: typeof values.description === "string" && values.description.trim() ? values.description : null,
                  status: values.status || "draft",
                  productCondition: values.productCondition || "new",
                  visibility: values.visibility || "public",
                  categoryAssignments: parseJson(values.categoryAssignments, []),
                  tagIds: parseJson(values.tagIds, []),
                  filterOptionIds: parseJson(values.filterOptionIds, []),
                  images,
                  ogImageUrl:
                    typeof values.ogImageUrl === "string" && values.ogImageUrl.trim()
                      ? values.ogImageUrl
                      : images[0]?.imageUrl ?? null,
                  metaTitle: typeof values.metaTitle === "string" && values.metaTitle.trim() ? values.metaTitle : null,
                  metaDescription:
                    typeof values.metaDescription === "string" && values.metaDescription.trim() ? values.metaDescription : null,
                  publishedAt: toIsoDateTime(values.publishedAt),
                  featuredProduct: Boolean(values.featuredProduct),
                  bestSeller: Boolean(values.bestSeller),
                  newArrival: Boolean(values.newArrival),
                  isSearchable: Boolean(values.isSearchable),
                  autoHideWhenOutOfStock: Boolean(values.autoHideWhenOutOfStock)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Product Preview
              </h3>
            </div>

            <div className="content-preview-stage">
              {primaryPreviewImage ? (
                <img className="content-preview-image" src={resolveMediaUrl(primaryPreviewImage) ?? undefined} alt="Product preview" />
              ) : null}
              <div className="content-preview-copy">
                <span className="eyebrow">
                  {typeof formSnapshot.brand === "string" && formSnapshot.brand.trim() ? formSnapshot.brand : "Brand"}
                </span>
                <h4>{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "Product name"}</h4>
                <p>
                  {typeof formSnapshot.shortDescription === "string" && formSnapshot.shortDescription.trim()
                    ? formSnapshot.shortDescription
                    : "Short product summary will appear here while you edit the product."}
                </p>
                <div className="content-preview-actions">
                  <span className="content-preview-chip">
                    {typeof formSnapshot.discountPrice === "string" || typeof formSnapshot.discountPrice === "number"
                      ? toNullableNumber(formSnapshot.discountPrice) !== null
                        ? formatCurrency(formSnapshot.discountPrice)
                        : formatCurrency(formSnapshot.price)
                      : formatCurrency(formSnapshot.price)}
                  </span>
                  <span className="content-preview-chip secondary">
                    SKU {typeof formSnapshot.sku === "string" && formSnapshot.sku.trim() ? formSnapshot.sku : "AUTO"}
                  </span>
                </div>
                <div className="content-chip-row">
                  {Boolean(formSnapshot.featuredProduct) ? <span className="content-preview-chip active">Featured</span> : null}
                  {Boolean(formSnapshot.bestSeller) ? <span className="content-preview-chip active">Best Seller</span> : null}
                  {Boolean(formSnapshot.newArrival) ? <span className="content-preview-chip active">New Arrival</span> : null}
                  {!Boolean(formSnapshot.isSearchable) ? <span className="content-preview-chip secondary">Hidden from search</span> : null}
                </div>
              </div>
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Categories</span>
                <strong>{previewCategoryNames.length ? previewCategoryNames.join(", ") : "Not assigned"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Inventory</span>
                <strong>{Number(formSnapshot.stockQuantity ?? 0)} units</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Tags</span>
                <strong>{previewTagIds.length}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Filters</span>
                <strong>{previewFilterIds.length}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const CategoriesManager = ({ categories }: { categories: any[] }) => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_CATEGORY_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_CATEGORY_FORM);
  const [sortOrder, setSortOrder] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  useAdminStatusNotice(formSuccess, formError, { successTitle: "Category saved", errorTitle: "Category action failed" });

  const slots = buildSortSlots({ items: categories, currentId: editingId, maxSlots: Math.max(categories.length + 1, 6) });
  const selectedSlot = slots.find((slot) => slot.sortOrder === sortOrder) ?? null;
  const PreviewIcon = getCategoryIconComponent(typeof formSnapshot.icon === "string" ? formSnapshot.icon : null);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/categories/${editingId}`, payload) : api.post("/catalog/categories", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-categories"] });
      setFormSuccess(editingId ? "Category updated." : "Category created.");
      resetForm();
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save category");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: number) => api.delete(`/catalog/categories/${categoryId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-categories"] });
      setFormSuccess("Category deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete category");
    }
  });

  const resetForm = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setSortOrder(getPreferredSortOrder(slots, null));
    setFormDefaults(EMPTY_CATEGORY_FORM);
    setFormSnapshot(EMPTY_CATEGORY_FORM);
  };

  const requestDelete = async (categoryId: number) => {
    const confirmed = await confirm({
      title: "Delete category",
      message: "Are you sure you want to delete this category?",
      confirmLabel: "Delete category",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(categoryId);
    }
  };

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <FolderTree size={18} />
            </span>
            Categories
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSortOrder(getPreferredSortOrder(slots, null));
              setFormDefaults(EMPTY_CATEGORY_FORM);
              setFormSnapshot(EMPTY_CATEGORY_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Category
          </Button>
        </div>

        <DataTable
          rows={categories}
          columns={[
            {
              key: "name",
              title: "Category",
              render: (row) => {
                const RowIcon = getCategoryIconComponent(row.icon);

                return (
                  <div className="selector-inline">
                    <span className="icon-preview-badge">
                      <RowIcon size={18} />
                    </span>
                    <div className="stack-sm">
                      <strong>{row.name}</strong>
                      <span className="field-hint">{row.slug}</span>
                    </div>
                  </div>
                );
              }
            },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "status",
              title: "Status",
              render: (row) => <StatusChip label={row.status} active={row.status === "active"} />
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSortOrder(Number(row.sort_order ?? 0));
                      setFormDefaults({
                        name: row.name ?? "",
                        imageUrl: row.image_url ?? "",
                        icon: row.icon ?? "",
                        description: row.description ?? "",
                        status: row.status ?? "active",
                        showOnHomepage: Boolean(row.show_on_homepage),
                        isFeatured: Boolean(row.is_featured),
                        seoTitle: row.seo_title ?? "",
                        seoDescription: row.seo_description ?? ""
                      });
                      setFormSnapshot({
                        name: row.name ?? "",
                        imageUrl: row.image_url ?? "",
                        icon: row.icon ?? "",
                        description: row.description ?? "",
                        status: row.status ?? "active",
                        showOnHomepage: Boolean(row.show_on_homepage),
                        isFeatured: Boolean(row.is_featured),
                        seoTitle: row.seo_title ?? "",
                        seoDescription: row.seo_description ?? ""
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Category" : "Create Category"} onClose={resetForm}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <SortSlotsField
              label="Category Order"
              description="Choose the storefront position for this category."
              slots={slots}
              selectedSortOrder={sortOrder}
              currentId={editingId}
              onSelect={setSortOrder}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={CATEGORY_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Category" : "Create Category"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = slots.find((item) => item.sortOrder === sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected category spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  name: values.name,
                  imageUrl: values.imageUrl || null,
                  icon: values.icon || null,
                  description: values.description || null,
                  status: values.status || "active",
                  sortOrder,
                  showOnHomepage: Boolean(values.showOnHomepage),
                  isFeatured: Boolean(values.isFeatured),
                  seoTitle: values.seoTitle || null,
                  seoDescription: values.seoDescription || null
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Category Preview
              </h3>
            </div>

            <div className="content-preview-stage">
              {typeof formSnapshot.imageUrl === "string" && formSnapshot.imageUrl.trim() ? (
                <img className="content-preview-image" src={resolveMediaUrl(formSnapshot.imageUrl) ?? undefined} alt="Category preview" />
              ) : null}
              <div className="content-preview-copy">
                <div className="selector-inline">
                  <span className="icon-preview-badge">
                    <PreviewIcon size={18} />
                  </span>
                  <span className="eyebrow">Catalog category</span>
                </div>
                <h4>{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "Category name"}</h4>
                <p>
                  {typeof formSnapshot.description === "string" && formSnapshot.description.trim()
                    ? formSnapshot.description
                    : "Add a category description to preview how the merchandising block will read."}
                </p>
                <div className="content-chip-row">
                  {Boolean(formSnapshot.showOnHomepage) ? <span className="content-preview-chip active">Homepage</span> : null}
                  {Boolean(formSnapshot.isFeatured) ? <span className="content-preview-chip active">Featured</span> : null}
                </div>
              </div>
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Chosen spot</span>
                <strong>{selectedSlot?.label || "No spot selected"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Spot status</span>
                <strong>{selectedSlot?.occupant && Number(selectedSlot.occupant.id) !== editingId ? "Taken" : "Available"}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const SubcategoriesManager = ({
  subcategories,
  categoryOptions,
  categoryNameById
}: {
  subcategories: any[];
  categoryOptions: Array<{ label: string; value: string }>;
  categoryNameById: Map<string, string>;
}) => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_SUBCATEGORY_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_SUBCATEGORY_FORM);
  const [setup, setSetup] = useState({
    categoryId: categoryOptions[0]?.value ?? "",
    sortOrder: 0
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  useAdminStatusNotice(formSuccess, formError, {
    successTitle: "Subcategory saved",
    errorTitle: "Subcategory action failed"
  });

  const selectedCategory = categoryOptions.find((option) => option.value === setup.categoryId);
  const categoryCards: OptionCard[] = categoryOptions.map((option) => ({
    value: option.value,
    label: option.label,
    description: "Assign the subcategory to this parent category."
  }));
  const slots = buildSortSlots({
    items: subcategories,
    currentId: editingId,
    maxSlots: Math.max(subcategories.filter((item) => String(item.category_id) === setup.categoryId).length + 1, 4),
    filter: (item) => String(item.category_id) === setup.categoryId
  });
  const selectedSlot = slots.find((slot) => slot.sortOrder === setup.sortOrder) ?? null;

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/subcategories/${editingId}`, payload) : api.post("/catalog/subcategories", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-subcategories"] });
      setFormSuccess(editingId ? "Subcategory updated." : "Subcategory created.");
      resetForm();
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save subcategory");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (subcategoryId: number) => api.delete(`/catalog/subcategories/${subcategoryId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-subcategories"] });
      setFormSuccess("Subcategory deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete subcategory");
    }
  });

  const resetForm = () => {
    const nextCategoryId = categoryOptions[0]?.value ?? "";
    const nextSlots = buildSortSlots({
      items: subcategories,
      currentId: null,
      maxSlots: Math.max(subcategories.filter((item) => String(item.category_id) === nextCategoryId).length + 1, 4),
      filter: (item) => String(item.category_id) === nextCategoryId
    });

    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setSetup({
      categoryId: nextCategoryId,
      sortOrder: getPreferredSortOrder(nextSlots, null)
    });
    setFormDefaults(EMPTY_SUBCATEGORY_FORM);
    setFormSnapshot(EMPTY_SUBCATEGORY_FORM);
  };

  const requestDelete = async (subcategoryId: number) => {
    const confirmed = await confirm({
      title: "Delete subcategory",
      message: "Are you sure you want to delete this subcategory?",
      confirmLabel: "Delete subcategory",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(subcategoryId);
    }
  };

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <FolderTree size={18} />
            </span>
            Subcategories
          </h3>
          <Button
            onClick={() => {
              const nextCategoryId = categoryOptions[0]?.value ?? "";
              const nextSlots = buildSortSlots({
                items: subcategories,
                currentId: null,
                maxSlots: Math.max(subcategories.filter((item) => String(item.category_id) === nextCategoryId).length + 1, 4),
                filter: (item) => String(item.category_id) === nextCategoryId
              });

              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSetup({
                categoryId: nextCategoryId,
                sortOrder: getPreferredSortOrder(nextSlots, null)
              });
              setFormDefaults(EMPTY_SUBCATEGORY_FORM);
              setFormSnapshot(EMPTY_SUBCATEGORY_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Subcategory
          </Button>
        </div>

        <DataTable
          rows={subcategories}
          columns={[
            { key: "name", title: "Name", render: (row) => row.name },
            {
              key: "category",
              title: "Category",
              render: (row) => categoryNameById.get(String(row.category_id)) ?? row.category_id
            },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "status",
              title: "Status",
              render: (row) => <StatusChip label={row.status} active={row.status === "active"} />
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const rowCategoryId = String(row.category_id ?? "");
                      const rowSlots = buildSortSlots({
                        items: subcategories,
                        currentId: Number(row.id),
                        maxSlots: Math.max(subcategories.filter((item) => String(item.category_id) === rowCategoryId).length + 1, 4),
                        filter: (item) => String(item.category_id) === rowCategoryId
                      });

                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSetup({
                        categoryId: rowCategoryId,
                        sortOrder: getPreferredSortOrder(rowSlots, Number(row.id), Number(row.sort_order ?? 0))
                      });
                      setFormDefaults({
                        name: row.name ?? "",
                        imageUrl: row.image_url ?? "",
                        description: row.description ?? "",
                        status: row.status ?? "active",
                        showOnHomepage: Boolean(row.show_on_homepage)
                      });
                      setFormSnapshot({
                        name: row.name ?? "",
                        imageUrl: row.image_url ?? "",
                        description: row.description ?? "",
                        status: row.status ?? "active",
                        showOnHomepage: Boolean(row.show_on_homepage)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Subcategory" : "Create Subcategory"} onClose={resetForm}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="Parent Category"
              options={categoryCards}
              selectedValue={setup.categoryId}
              onSelect={(categoryId) => {
                const nextSlots = buildSortSlots({
                  items: subcategories,
                  currentId: editingId,
                  maxSlots: Math.max(subcategories.filter((item) => String(item.category_id) === categoryId).length + 1, 4),
                  filter: (item) => String(item.category_id) === categoryId
                });

                setSetup({
                  categoryId,
                  sortOrder: getPreferredSortOrder(nextSlots, editingId)
                });
              }}
            />

            <SortSlotsField
              label="Subcategory Order"
              description="Choose the position inside the selected category."
              slots={slots}
              selectedSortOrder={setup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={SUBCATEGORY_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Subcategory" : "Create Subcategory"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = slots.find((item) => item.sortOrder === setup.sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected subcategory spot is already taken in this category.");
                  return;
                }

                if (!setup.categoryId) {
                  setFormError("Choose a category before saving.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  categoryId: Number(setup.categoryId),
                  name: values.name,
                  imageUrl: values.imageUrl || null,
                  description: values.description || null,
                  status: values.status || "active",
                  sortOrder: setup.sortOrder,
                  showOnHomepage: Boolean(values.showOnHomepage)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Subcategory Preview
              </h3>
            </div>

            <div className="content-preview-stage">
              {typeof formSnapshot.imageUrl === "string" && formSnapshot.imageUrl.trim() ? (
                <img className="content-preview-image" src={resolveMediaUrl(formSnapshot.imageUrl) ?? undefined} alt="Subcategory preview" />
              ) : null}
              <div className="content-preview-copy">
                <span className="eyebrow">{selectedCategory?.label || "Parent category"}</span>
                <h4>{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "Subcategory name"}</h4>
                <p>
                  {typeof formSnapshot.description === "string" && formSnapshot.description.trim()
                    ? formSnapshot.description
                    : "This preview follows the selected parent category and order slot."}
                </p>
                {Boolean(formSnapshot.showOnHomepage) ? (
                  <div className="content-chip-row">
                    <span className="content-preview-chip active">Homepage</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Parent category</span>
                <strong>{selectedCategory?.label || "Not selected"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Chosen spot</span>
                <strong>{selectedSlot?.label || "No spot selected"}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const TagsManager = ({ tags }: { tags: any[] }) => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_TAG_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_TAG_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  useAdminStatusNotice(formSuccess, formError, { successTitle: "Tag saved", errorTitle: "Tag action failed" });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/tags/${editingId}`, payload) : api.post("/catalog/tags", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-tags"] });
      setFormSuccess(editingId ? "Tag updated." : "Tag created.");
      setIsEditorOpen(false);
      setEditingId(null);
      setFormError(null);
      setFormDefaults(EMPTY_TAG_FORM);
      setFormSnapshot(EMPTY_TAG_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save tag");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: number) => api.delete(`/catalog/tags/${tagId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-tags"] });
      setFormSuccess("Tag deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete tag");
    }
  });

  const requestDelete = async (tagId: number) => {
    const confirmed = await confirm({
      title: "Delete tag",
      message: "Are you sure you want to delete this tag?",
      confirmLabel: "Delete tag",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(tagId);
    }
  };

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Tags size={18} />
            </span>
            Tags
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setFormDefaults(EMPTY_TAG_FORM);
              setFormSnapshot(EMPTY_TAG_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Tag
          </Button>
        </div>

        <DataTable
          rows={tags}
          columns={[
            { key: "name", title: "Name", render: (row) => row.name },
            { key: "slug", title: "Slug", render: (row) => row.slug },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setFormDefaults({ name: row.name ?? "" });
                      setFormSnapshot({ name: row.name ?? "" });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={isEditorOpen}
        title={editingId ? "Edit Tag" : "Create Tag"}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingId(null);
          setFormError(null);
          setFormDefaults(EMPTY_TAG_FORM);
          setFormSnapshot(EMPTY_TAG_FORM);
        }}
      >
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            {formError ? <div className="error-banner">{formError}</div> : null}
            <DynamicForm
              fields={TAG_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Tag" : "Create Tag"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                if (!values.name || !String(values.name).trim()) {
                  setFormError("Tag name is required.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({ name: values.name });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Tag Preview
              </h3>
            </div>
            <div className="content-preview-stage">
              <div className="content-preview-copy">
                <span className="eyebrow">Search label</span>
                <h4>{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "Tag name"}</h4>
                <div className="content-chip-row">
                  <span className="content-preview-chip">
                    #{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "tag"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const FilterGroupsManager = ({ groups }: { groups: any[] }) => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_FILTER_GROUP_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_FILTER_GROUP_FORM);
  const [sortOrder, setSortOrder] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  useAdminStatusNotice(formSuccess, formError, {
    successTitle: "Filter group saved",
    errorTitle: "Filter group action failed"
  });

  const slots = buildSortSlots({ items: groups, currentId: editingId, maxSlots: Math.max(groups.length + 1, 6) });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/filters/groups/${editingId}`, payload) : api.post("/catalog/filters/groups", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-groups"] });
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-options"] });
      setFormSuccess(editingId ? "Filter group updated." : "Filter group created.");
      setIsEditorOpen(false);
      setEditingId(null);
      setFormError(null);
      setSortOrder(getPreferredSortOrder(slots, null));
      setFormDefaults(EMPTY_FILTER_GROUP_FORM);
      setFormSnapshot(EMPTY_FILTER_GROUP_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save filter group");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (groupId: number) => api.delete(`/catalog/filters/groups/${groupId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-groups"] });
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-options"] });
      setFormSuccess("Filter group deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete filter group");
    }
  });

  const requestDelete = async (groupId: number) => {
    const confirmed = await confirm({
      title: "Delete filter group",
      message: "Are you sure you want to delete this filter group?",
      confirmLabel: "Delete filter group",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(groupId);
    }
  };

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Filter size={18} />
            </span>
            Filter Groups
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSortOrder(getPreferredSortOrder(slots, null));
              setFormDefaults(EMPTY_FILTER_GROUP_FORM);
              setFormSnapshot(EMPTY_FILTER_GROUP_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Filter Group
          </Button>
        </div>

        <DataTable
          rows={groups}
          columns={[
            {
              key: "name",
              title: "Group",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.name}</strong>
                  <span className="field-hint">{row.code}</span>
                </div>
              )
            },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "frontend",
              title: "Frontend",
              render: (row) => <StatusChip label={row.display_on_frontend ? "Visible" : "Hidden"} active={Boolean(row.display_on_frontend)} />
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSortOrder(Number(row.sort_order ?? 0));
                      setFormDefaults({
                        name: row.name ?? "",
                        code: row.code ?? "",
                        displayOnFrontend: Boolean(row.display_on_frontend)
                      });
                      setFormSnapshot({
                        name: row.name ?? "",
                        code: row.code ?? "",
                        displayOnFrontend: Boolean(row.display_on_frontend)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={isEditorOpen}
        title={editingId ? "Edit Filter Group" : "Create Filter Group"}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingId(null);
          setFormError(null);
          setSortOrder(getPreferredSortOrder(slots, null));
          setFormDefaults(EMPTY_FILTER_GROUP_FORM);
          setFormSnapshot(EMPTY_FILTER_GROUP_FORM);
        }}
      >
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <SortSlotsField
              label="Filter Group Order"
              description="Choose the storefront order for this filter group."
              slots={slots}
              selectedSortOrder={sortOrder}
              currentId={editingId}
              onSelect={setSortOrder}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={FILTER_GROUP_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Filter Group" : "Create Filter Group"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = slots.find((item) => item.sortOrder === sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected filter group spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  name: values.name,
                  code: values.code,
                  displayOnFrontend: Boolean(values.displayOnFrontend),
                  sortOrder
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Filter Group Preview
              </h3>
            </div>
            <div className="content-preview-stage">
              <div className="content-preview-copy">
                <span className="eyebrow">Filter block</span>
                <h4>{typeof formSnapshot.name === "string" && formSnapshot.name.trim() ? formSnapshot.name : "Filter group name"}</h4>
                <p>
                  {typeof formSnapshot.code === "string" && formSnapshot.code.trim()
                    ? `Code: ${formSnapshot.code}`
                    : "Add a code to define the filter key used across the catalog."}
                </p>
                <div className="content-chip-row">
                  <span className={`content-preview-chip${Boolean(formSnapshot.displayOnFrontend) ? " active" : " secondary"}`}>
                    {Boolean(formSnapshot.displayOnFrontend) ? "Visible on frontend" : "Internal only"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const FilterOptionsManager = ({
  options,
  filterGroupOptions
}: {
  options: any[];
  filterGroupOptions: Array<{ label: string; value: string }>;
}) => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_FILTER_OPTION_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_FILTER_OPTION_FORM);
  const [setup, setSetup] = useState({
    filterGroupId: filterGroupOptions[0]?.value ?? "",
    sortOrder: 0
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  useAdminStatusNotice(formSuccess, formError, {
    successTitle: "Filter option saved",
    errorTitle: "Filter option action failed"
  });

  const groupCards: OptionCard[] = filterGroupOptions.map((option) => ({
    value: option.value,
    label: option.label,
    description: "Place this option inside the selected filter group."
  }));
  const slots = buildSortSlots({
    items: options,
    currentId: editingId,
    maxSlots: Math.max(options.filter((item) => String(item.filter_group_id) === setup.filterGroupId).length + 1, 4),
    filter: (item) => String(item.filter_group_id) === setup.filterGroupId
  });
  const selectedGroup = filterGroupOptions.find((option) => option.value === setup.filterGroupId);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/catalog/filters/options/${editingId}`, payload) : api.post("/catalog/filters/options", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-options"] });
      setFormSuccess(editingId ? "Filter option updated." : "Filter option created.");
      setIsEditorOpen(false);
      setEditingId(null);
      setFormError(null);
      setFormDefaults(EMPTY_FILTER_OPTION_FORM);
      setFormSnapshot(EMPTY_FILTER_OPTION_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save filter option");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (optionId: number) => api.delete(`/catalog/filters/options/${optionId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["catalog-filter-options"] });
      setFormSuccess("Filter option deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete filter option");
    }
  });

  const requestDelete = async (optionId: number) => {
    const confirmed = await confirm({
      title: "Delete filter option",
      message: "Are you sure you want to delete this filter option?",
      confirmLabel: "Delete filter option",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(optionId);
    }
  };

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Filter size={18} />
            </span>
            Filter Options
          </h3>
          <Button
            onClick={() => {
              const nextGroupId = filterGroupOptions[0]?.value ?? "";
              const nextSlots = buildSortSlots({
                items: options,
                currentId: null,
                maxSlots: Math.max(options.filter((item) => String(item.filter_group_id) === nextGroupId).length + 1, 4),
                filter: (item) => String(item.filter_group_id) === nextGroupId
              });

              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSetup({
                filterGroupId: nextGroupId,
                sortOrder: getPreferredSortOrder(nextSlots, null)
              });
              setFormDefaults(EMPTY_FILTER_OPTION_FORM);
              setFormSnapshot(EMPTY_FILTER_OPTION_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Filter Option
          </Button>
        </div>

        <DataTable
          rows={options}
          columns={[
            {
              key: "label",
              title: "Option",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.label}</strong>
                  <span className="field-hint">{row.value}</span>
                </div>
              )
            },
            {
              key: "group",
              title: "Group",
              render: (row) => filterGroupOptions.find((option) => option.value === String(row.filter_group_id))?.label ?? row.filter_group_id
            },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "status",
              title: "Status",
              render: (row) => <StatusChip label={row.is_active ? "Active" : "Inactive"} active={Boolean(row.is_active)} />
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const rowGroupId = String(row.filter_group_id ?? "");
                      const rowSlots = buildSortSlots({
                        items: options,
                        currentId: Number(row.id),
                        maxSlots: Math.max(options.filter((item) => String(item.filter_group_id) === rowGroupId).length + 1, 4),
                        filter: (item) => String(item.filter_group_id) === rowGroupId
                      });

                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSetup({
                        filterGroupId: rowGroupId,
                        sortOrder: getPreferredSortOrder(rowSlots, Number(row.id), Number(row.sort_order ?? 0))
                      });
                      setFormDefaults({
                        label: row.label ?? "",
                        value: row.value ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setFormSnapshot({
                        label: row.label ?? "",
                        value: row.value ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal
        open={isEditorOpen}
        title={editingId ? "Edit Filter Option" : "Create Filter Option"}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingId(null);
          setFormError(null);
          setFormDefaults(EMPTY_FILTER_OPTION_FORM);
          setFormSnapshot(EMPTY_FILTER_OPTION_FORM);
        }}
      >
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="Filter Group"
              options={groupCards}
              selectedValue={setup.filterGroupId}
              onSelect={(filterGroupId) => {
                const nextSlots = buildSortSlots({
                  items: options,
                  currentId: editingId,
                  maxSlots: Math.max(options.filter((item) => String(item.filter_group_id) === filterGroupId).length + 1, 4),
                  filter: (item) => String(item.filter_group_id) === filterGroupId
                });

                setSetup({
                  filterGroupId,
                  sortOrder: getPreferredSortOrder(nextSlots, editingId)
                });
              }}
            />

            <SortSlotsField
              label="Option Order"
              description="Choose the order inside the selected filter group."
              slots={slots}
              selectedSortOrder={setup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={FILTER_OPTION_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Filter Option" : "Create Filter Option"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = slots.find((item) => item.sortOrder === setup.sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected filter option spot is already taken in this group.");
                  return;
                }

                if (!setup.filterGroupId) {
                  setFormError("Choose a filter group before saving.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  filterGroupId: Number(setup.filterGroupId),
                  label: values.label,
                  value: values.value,
                  sortOrder: setup.sortOrder,
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Filter Option Preview
              </h3>
            </div>
            <div className="content-preview-stage">
              <div className="content-preview-copy">
                <span className="eyebrow">{selectedGroup?.label || "Filter group"}</span>
                <h4>{typeof formSnapshot.label === "string" && formSnapshot.label.trim() ? formSnapshot.label : "Option label"}</h4>
                <p>
                  {typeof formSnapshot.value === "string" && formSnapshot.value.trim()
                    ? `Stored value: ${formSnapshot.value}`
                    : "Add the internal value that products will store for this option."}
                </p>
                <div className="content-chip-row">
                  <span className={`content-preview-chip${Boolean(formSnapshot.isActive) ? " active" : " secondary"}`}>
                    {Boolean(formSnapshot.isActive) ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export const CatalogPage = () => {
  const [productFilters, setProductFilters] = useState<ProductFilters>({
    search: "",
    status: "",
    categoryId: "",
    pageSize: 25
  });
  const [productPage, setProductPage] = useState(1);
  const productQueryString = useMemo(() => {
    const params = new URLSearchParams({
      page: String(productPage),
      pageSize: String(productFilters.pageSize)
    });

    if (productFilters.search.trim()) {
      params.set("search", productFilters.search.trim());
    }

    if (productFilters.status) {
      params.set("status", productFilters.status);
    }

    if (productFilters.categoryId) {
      params.set("categoryId", productFilters.categoryId);
    }

    return params.toString();
  }, [productFilters, productPage]);
  const productsQuery = useQuery({
    queryKey: ["catalog-products", productQueryString],
    queryFn: () => api.get<{ data: any[]; meta: PaginationMeta }>(`/catalog/products?${productQueryString}`)
  });
  const categoriesQuery = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: () => api.get<{ data: any[] }>("/catalog/categories")
  });
  const subcategoriesQuery = useQuery({
    queryKey: ["catalog-subcategories"],
    queryFn: () => api.get<{ data: any[] }>("/catalog/subcategories")
  });
  const tagsQuery = useQuery({
    queryKey: ["catalog-tags"],
    queryFn: () => api.get<{ data: any[] }>("/catalog/tags")
  });
  const filterGroupsQuery = useQuery({
    queryKey: ["catalog-filter-groups"],
    queryFn: () => api.get<{ data: any[] }>("/catalog/filters/groups")
  });
  const filterOptionsQuery = useQuery({
    queryKey: ["catalog-filter-options"],
    queryFn: () => api.get<{ data: any[] }>("/catalog/filters/options")
  });

  const products = productsQuery.data?.data ?? [];
  const productMeta = productsQuery.data?.meta ?? { page: productPage, pageSize: productFilters.pageSize, total: 0 };
  const categories = categoriesQuery.data?.data ?? [];
  const subcategories = subcategoriesQuery.data?.data ?? [];
  const tags = tagsQuery.data?.data ?? [];
  const filterGroups = filterGroupsQuery.data?.data ?? [];
  const filterOptions = filterOptionsQuery.data?.data ?? [];

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: String(category.id)
      })),
    [categories]
  );
  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories]
  );
  const subcategoryOptions = useMemo(
    () =>
      subcategories.map((subcategory) => ({
        label: subcategory.name,
        value: String(subcategory.id),
        parentValue: String(subcategory.category_id)
      })),
    [subcategories]
  );
  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        label: tag.name,
        value: String(tag.id)
      })),
    [tags]
  );
  const filterGroupNameById = useMemo(
    () => new Map(filterGroups.map((group) => [String(group.id), group.name])),
    [filterGroups]
  );
  const filterGroupOptions = useMemo(
    () =>
      filterGroups.map((group) => ({
        label: group.name,
        value: String(group.id)
      })),
    [filterGroups]
  );
  const filterOptionChoices = useMemo(
    () =>
      filterOptions.map((option) => ({
        label: `${filterGroupNameById.get(String(option.filter_group_id)) ?? "Filter"}: ${option.label}`,
        value: String(option.id)
      })),
    [filterGroupNameById, filterOptions]
  );

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div className="title-with-icon">
          <div className="title-icon">
            <Package size={20} />
          </div>
          <div>
            <p className="eyebrow">Catalog</p>
            <h2>Manage products, taxonomy, storefront ordering, and filter structure</h2>
          </div>
        </div>
      </div>

      <Card>
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Boxes size={18} />
            </span>
            Catalog Snapshot
          </h3>
        </div>
        <div className="stats-grid">
          <Card className="stat-card">
            <span className="stat-label">Products</span>
            <strong className="stat-value">{productMeta.total}</strong>
            <span className="stat-helper">Catalog items across all pages</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-label">Categories</span>
            <strong className="stat-value">{categories.length}</strong>
            <span className="stat-helper">Merchandising lanes</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-label">Subcategories</span>
            <strong className="stat-value">{subcategories.length}</strong>
            <span className="stat-helper">Nested navigation spots</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-label">Filters</span>
            <strong className="stat-value">{filterOptions.length}</strong>
            <span className="stat-helper">Shop discovery options</span>
          </Card>
        </div>
      </Card>

      <ProductManager
        products={products}
        meta={productMeta}
        filters={productFilters}
        onFiltersChange={(updates) => {
          setProductFilters((current) => ({ ...current, ...updates }));
          setProductPage(1);
        }}
        onPageChange={setProductPage}
        categoryOptions={categoryOptions}
        subcategoryOptions={subcategoryOptions}
        tagOptions={tagOptions}
        filterOptionChoices={filterOptionChoices}
        categoryNameById={categoryNameById}
      />

      <div className="grid-two">
        <CategoriesManager categories={categories} />
        <SubcategoriesManager
          subcategories={subcategories}
          categoryOptions={categoryOptions}
          categoryNameById={categoryNameById}
        />
      </div>

      <div className="grid-two">
        <TagsManager tags={tags} />
        <FilterGroupsManager groups={filterGroups} />
      </div>

      <FilterOptionsManager options={filterOptions} filterGroupOptions={filterGroupOptions} />
    </div>
  );
};
