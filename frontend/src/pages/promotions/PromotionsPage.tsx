import { TicketPercent, Tag, Truck, Layers, Plus, RotateCcw } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { StatCard } from "../../components/ui/StatCard";
import { useAdminNotice } from "../../components/ui/AdminNoticeProvider";
import { useAdminStatusNotice } from "../../components/ui/useAdminStatusNotice";

type CouponScope = "all" | "categories" | "products";
type DiscountType = "percentage" | "fixed" | "free_delivery";

type CouponRow = {
  id: number;
  code: string;
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  minimum_order_amount: number;
  usage_limit: number | null;
  usage_limit_per_user: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  applies_to: CouponScope;
};

type CouponDetail = CouponRow & {
  description: string | null;
  categories: Array<{ category_id: number }>;
  products: Array<{ product_id: number }>;
};

type CategoryOption = {
  id: number;
  name: string;
  status: string;
};

type ProductOption = {
  id: number;
  name: string;
  sku: string;
  stock_quantity: number;
  status: string;
};

type CouponFormValues = {
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrderAmount: string;
  usageLimit: string;
  usageLimitPerUser: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  appliesTo: CouponScope;
  categoryIds: number[];
  productIds: number[];
};

const createEmptyForm = (): CouponFormValues => ({
  code: "",
  name: "",
  description: "",
  discountType: "percentage",
  discountValue: "10",
  minimumOrderAmount: "0",
  usageLimit: "",
  usageLimitPerUser: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
  appliesTo: "all",
  categoryIds: [],
  productIds: []
});

const parseOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : null;
};

const toIsoDateTime = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const toggleSelection = (currentValues: number[], value: number) =>
  currentValues.includes(value)
    ? currentValues.filter((currentValue) => currentValue !== value)
    : [...currentValues, value];

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

const formatDateTimeLabel = (value?: string | null) => {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getOfferLabel = (discountType: DiscountType, discountValue: number) => {
  if (discountType === "free_delivery") {
    return "Free delivery";
  }

  if (discountType === "fixed") {
    return `RWF ${discountValue} off`;
  }

  return `${discountValue}% off`;
};

const getScopeLabel = (scope: CouponScope) => {
  if (scope === "categories") {
    return "Selected categories";
  }

  if (scope === "products") {
    return "Selected products";
  }

  return "All products";
};

export const PromotionsPage = () => {
  const queryClient = useQueryClient();
  const { confirm } = useAdminNotice();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<CouponFormValues>(createEmptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  useAdminStatusNotice(formSuccess, formError, {
    successTitle: "Promotion saved",
    errorTitle: "Promotion action failed"
  });

  const couponsQuery = useQuery({
    queryKey: ["coupons"],
    queryFn: () => api.get<{ data: CouponRow[] }>("/promotions/coupons")
  });

  const targetsQuery = useQuery({
    queryKey: ["promotion-targets"],
    queryFn: () => api.get<{ categories: CategoryOption[]; products: ProductOption[] }>("/promotions/targets")
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        code: formValues.code.trim().toUpperCase(),
        name: formValues.name.trim(),
        description: formValues.description.trim() || null,
        discountType: formValues.discountType,
        discountValue: formValues.discountType === "free_delivery" ? 0 : Number(formValues.discountValue),
        minimumOrderAmount: Number(formValues.minimumOrderAmount || 0),
        usageLimit: parseOptionalNumber(formValues.usageLimit),
        usageLimitPerUser: parseOptionalNumber(formValues.usageLimitPerUser),
        startsAt: toIsoDateTime(formValues.startsAt),
        endsAt: toIsoDateTime(formValues.endsAt),
        isActive: formValues.isActive,
        appliesTo: formValues.appliesTo,
        categoryIds: formValues.appliesTo === "categories" ? formValues.categoryIds : [],
        productIds: formValues.appliesTo === "products" ? formValues.productIds : []
      };

      if (editingId) {
        return api.put(`/promotions/coupons/${editingId}`, payload);
      }

      return api.post("/promotions/coupons", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setFormSuccess(editingId ? "Coupon updated." : "Coupon created.");
      setFormError(null);
      setEditingId(null);
      setFormValues(createEmptyForm());
      setCategorySearch("");
      setProductSearch("");
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save coupon");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (couponId: number) => api.delete(`/promotions/coupons/${couponId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setFormSuccess("Coupon deleted.");
      setFormError(null);
      if (editingId) {
        setEditingId(null);
        setFormValues(createEmptyForm());
      }
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete coupon");
    }
  });

  const categories = targetsQuery.data?.categories ?? [];
  const products = targetsQuery.data?.products ?? [];
  const coupons = couponsQuery.data?.data ?? [];

  const filteredCategories = categories.filter((category) =>
    `${category.name} ${category.status}`.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.status}`.toLowerCase().includes(productSearch.trim().toLowerCase())
  );

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((coupon) => coupon.is_active).length;
  const categoryCoupons = coupons.filter((coupon) => coupon.applies_to === "categories").length;
  const productCoupons = coupons.filter((coupon) => coupon.applies_to === "products").length;

  const selectedCategoryNames = categories
    .filter((category) => formValues.categoryIds.includes(category.id))
    .map((category) => category.name);
  const selectedProductNames = products
    .filter((product) => formValues.productIds.includes(product.id))
    .map((product) => `${product.name} (${product.sku})`);

  const resetForm = () => {
    setEditingId(null);
    setFormError(null);
    setFormSuccess(null);
    setCategorySearch("");
    setProductSearch("");
    setFormValues(createEmptyForm());
  };

  const requestDelete = async (couponId: number) => {
    const confirmed = await confirm({
      title: "Delete coupon",
      message: "Are you sure you want to delete this coupon? Customers will no longer be able to use it.",
      confirmLabel: "Delete coupon",
      tone: "error"
    });

    if (confirmed) {
      deleteMutation.mutate(couponId);
    }
  };

  const startEdit = async (couponId: number) => {
    setFormError(null);
    setFormSuccess(null);
    setIsLoadingEdit(true);

    try {
      const response = await api.get<{ data: CouponDetail }>(`/promotions/coupons/${couponId}`);
      const coupon = response.data;

      setEditingId(couponId);
      setFormValues({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description ?? "",
        discountType: coupon.discount_type,
        discountValue: String(coupon.discount_value ?? 0),
        minimumOrderAmount: String(coupon.minimum_order_amount ?? 0),
        usageLimit: coupon.usage_limit != null ? String(coupon.usage_limit) : "",
        usageLimitPerUser: coupon.usage_limit_per_user != null ? String(coupon.usage_limit_per_user) : "",
        startsAt: formatDateTimeInputValue(coupon.starts_at),
        endsAt: formatDateTimeInputValue(coupon.ends_at),
        isActive: Boolean(coupon.is_active),
        appliesTo: coupon.applies_to,
        categoryIds: (coupon.categories ?? []).map((entry) => entry.category_id),
        productIds: (coupon.products ?? []).map((entry) => entry.product_id)
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to load coupon");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSuccess(null);

    if (!formValues.code.trim()) {
      setFormError("Coupon code is required.");
      return;
    }

    if (!formValues.name.trim()) {
      setFormError("Coupon name is required.");
      return;
    }

    if (formValues.discountType !== "free_delivery" && Number(formValues.discountValue) <= 0) {
      setFormError("Discount value must be greater than zero.");
      return;
    }

    if (formValues.appliesTo === "categories" && formValues.categoryIds.length === 0) {
      setFormError("Select at least one category.");
      return;
    }

    if (formValues.appliesTo === "products" && formValues.productIds.length === 0) {
      setFormError("Select at least one product.");
      return;
    }

    if (formValues.startsAt && formValues.endsAt && new Date(formValues.endsAt) < new Date(formValues.startsAt)) {
      setFormError("End date must be after the start date.");
      return;
    }

    setFormError(null);
    saveMutation.mutate();
  };

  const targetSummary =
    formValues.appliesTo === "categories"
      ? `${formValues.categoryIds.length} categor${formValues.categoryIds.length === 1 ? "y" : "ies"} selected`
      : formValues.appliesTo === "products"
        ? `${formValues.productIds.length} product${formValues.productIds.length === 1 ? "" : "s"} selected`
        : "Applies to the full catalog";

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Promotions</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <TicketPercent size={20} />
            </span>
            Create coupons, free-delivery offers, validity windows, and usage rules
          </h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Coupons" value={totalCoupons} />
        <StatCard label="Active" value={activeCoupons} />
        <StatCard label="Category Rules" value={categoryCoupons} />
        <StatCard label="Product Rules" value={productCoupons} />
      </div>

      <div className="grid-two">
        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Plus size={18} />
              </span>
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </h3>
          </div>

          <p className="field-hint">
            Build the offer, decide who can use it, and target categories or products without typing raw IDs.
          </p>

          {formError ? <div className="error-banner">{formError}</div> : null}
          {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

          <form className="stack-md" onSubmit={handleSubmit}>
            <div className="coupon-form-grid">
              <label className="field">
                <span>Coupon Code</span>
                <input
                  value={formValues.code}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      code: event.target.value.toUpperCase()
                    }))
                  }
                  placeholder="WELCOME10"
                />
              </label>

              <label className="field">
                <span>Coupon Name</span>
                <input
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      name: event.target.value
                    }))
                  }
                  placeholder="Welcome discount"
                />
              </label>

              <label className="field field-span-2">
                <span>Description</span>
                <textarea
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      description: event.target.value
                    }))
                  }
                  rows={4}
                  placeholder="Explain when this coupon should be used."
                />
              </label>

              <label className="field">
                <span>Discount Type</span>
                <select
                  value={formValues.discountType}
                  onChange={(event) => {
                    const nextDiscountType = event.target.value as DiscountType;
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      discountType: nextDiscountType,
                      discountValue: nextDiscountType === "free_delivery" ? "0" : currentValues.discountValue || "10"
                    }));
                  }}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount</option>
                  <option value="free_delivery">Free delivery</option>
                </select>
              </label>

              <label className="field">
                <span>Discount Value</span>
                <input
                  type="number"
                  value={formValues.discountValue}
                  disabled={formValues.discountType === "free_delivery"}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      discountValue: event.target.value
                    }))
                  }
                />
              </label>

              <label className="field">
                <span>Minimum Order</span>
                <input
                  type="number"
                  value={formValues.minimumOrderAmount}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      minimumOrderAmount: event.target.value
                    }))
                  }
                />
              </label>

              <label className="field">
                <span>Usage Limit</span>
                <input
                  type="number"
                  value={formValues.usageLimit}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      usageLimit: event.target.value
                    }))
                  }
                  placeholder="Leave empty for unlimited"
                />
              </label>

              <label className="field">
                <span>Per User Limit</span>
                <input
                  type="number"
                  value={formValues.usageLimitPerUser}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      usageLimitPerUser: event.target.value
                    }))
                  }
                  placeholder="Leave empty for unlimited"
                />
              </label>

              <label className="field">
                <span>Starts At</span>
                <input
                  type="datetime-local"
                  value={formValues.startsAt}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      startsAt: event.target.value
                    }))
                  }
                />
              </label>

              <label className="field">
                <span>Ends At</span>
                <input
                  type="datetime-local"
                  value={formValues.endsAt}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      endsAt: event.target.value
                    }))
                  }
                />
              </label>

              <label className="field">
                <span>Applies To</span>
                <select
                  value={formValues.appliesTo}
                  onChange={(event) => {
                    const nextScope = event.target.value as CouponScope;
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      appliesTo: nextScope,
                      categoryIds: nextScope === "categories" ? currentValues.categoryIds : [],
                      productIds: nextScope === "products" ? currentValues.productIds : []
                    }));
                  }}
                >
                  <option value="all">All products</option>
                  <option value="categories">Selected categories</option>
                  <option value="products">Selected products</option>
                </select>
              </label>

              <label className="selector-inline coupon-inline-toggle">
                <input
                  type="checkbox"
                  checked={formValues.isActive}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      isActive: event.target.checked
                    }))
                  }
                />
                <span>Coupon is active</span>
              </label>
            </div>

            {formValues.appliesTo === "all" ? (
              <div className="coupon-target-box">
                <strong>All products are eligible.</strong>
                <p className="field-hint">
                  Switch the scope to categories or products if the coupon should target a smaller set.
                </p>
              </div>
            ) : null}

            {formValues.appliesTo === "categories" ? (
              <div className="field">
                <div className="coupon-target-toolbar">
                  <div>
                    <span>Eligible Categories</span>
                    <p className="field-hint">Pick one or more categories for this coupon.</p>
                  </div>
                  <strong className="coupon-target-count">{formValues.categoryIds.length} selected</strong>
                </div>

                <div className="selector-panel">
                  <label className="field">
                    <span>Search Categories</span>
                    <input
                      value={categorySearch}
                      onChange={(event) => setCategorySearch(event.target.value)}
                      placeholder="Search by category name"
                    />
                  </label>

                  <div className="selector-grid">
                    {filteredCategories.map((category) => {
                      const checked = formValues.categoryIds.includes(category.id);

                      return (
                        <label key={category.id} className={`selector-tile${checked ? " selected" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setFormValues((currentValues) => ({
                                ...currentValues,
                                categoryIds: toggleSelection(currentValues.categoryIds, category.id)
                              }))
                            }
                          />
                          <span>{category.name}</span>
                        </label>
                      );
                    })}
                  </div>

                  {!filteredCategories.length ? (
                    <div className="media-empty-state">No categories match the current search.</div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {formValues.appliesTo === "products" ? (
              <div className="field">
                <div className="coupon-target-toolbar">
                  <div>
                    <span>Eligible Products</span>
                    <p className="field-hint">Search and pick the products this coupon should cover.</p>
                  </div>
                  <strong className="coupon-target-count">{formValues.productIds.length} selected</strong>
                </div>

                <div className="selector-panel">
                  <label className="field">
                    <span>Search Products</span>
                    <input
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                      placeholder="Search by name or SKU"
                    />
                  </label>

                  <div className="selector-grid">
                    {filteredProducts.map((product) => {
                      const checked = formValues.productIds.includes(product.id);

                      return (
                        <label key={product.id} className={`selector-tile${checked ? " selected" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setFormValues((currentValues) => ({
                                ...currentValues,
                                productIds: toggleSelection(currentValues.productIds, product.id)
                              }))
                            }
                          />
                          <span>{product.name} ({product.sku}) - Stock {product.stock_quantity}</span>
                        </label>
                      );
                    })}
                  </div>

                  {!filteredProducts.length ? (
                    <div className="media-empty-state">No products match the current search.</div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="coupon-form-actions">
              <Button type="submit" disabled={saveMutation.isPending || isLoadingEdit || targetsQuery.isLoading}>
                <TicketPercent size={16} />
                {saveMutation.isPending ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm} disabled={saveMutation.isPending}>
                <RotateCcw size={16} />
                {editingId ? "Cancel Edit" : "Reset"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="stack-md coupon-preview-card">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                {formValues.discountType === "free_delivery" ? <Truck size={18} /> : <Tag size={18} />}
              </span>
              Coupon Preview
            </h3>
          </div>

          <div className="coupon-preview-list">
            <div className="coupon-preview-item">
              <span className="field-hint">Offer</span>
              <strong>
                {getOfferLabel(
                  formValues.discountType,
                  formValues.discountType === "free_delivery" ? 0 : Number(formValues.discountValue || 0)
                )}
              </strong>
            </div>
            <div className="coupon-preview-item">
              <span className="field-hint">Scope</span>
              <strong>{getScopeLabel(formValues.appliesTo)}</strong>
            </div>
            <div className="coupon-preview-item">
              <span className="field-hint">Target Summary</span>
              <strong>{targetSummary}</strong>
            </div>
            <div className="coupon-preview-item">
              <span className="field-hint">Minimum Order</span>
              <strong>RWF {Number(formValues.minimumOrderAmount || 0)}</strong>
            </div>
            <div className="coupon-preview-item">
              <span className="field-hint">Starts</span>
              <strong>{formatDateTimeLabel(formValues.startsAt || null)}</strong>
            </div>
            <div className="coupon-preview-item">
              <span className="field-hint">Ends</span>
              <strong>{formatDateTimeLabel(formValues.endsAt || null)}</strong>
            </div>
          </div>

          {formValues.appliesTo === "categories" && selectedCategoryNames.length ? (
            <div className="coupon-target-box">
              <strong>Selected Categories</strong>
              <div className="coupon-chip-list">
                {selectedCategoryNames.map((name) => (
                  <span key={name} className="coupon-chip">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {formValues.appliesTo === "products" && selectedProductNames.length ? (
            <div className="coupon-target-box">
              <strong>Selected Products</strong>
              <div className="coupon-chip-list">
                {selectedProductNames.map((name) => (
                  <span key={name} className="coupon-chip">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="coupon-target-box">
            <strong>Logic Guardrails</strong>
            <div className="coupon-preview-list">
              <div className="coupon-preview-item">
                <span className="field-hint">Validation</span>
                <strong>Selection is required for category and product targeting.</strong>
              </div>
              <div className="coupon-preview-item">
                <span className="field-hint">Delivery offers</span>
                <strong>Free delivery ignores discount value automatically.</strong>
              </div>
              <div className="coupon-preview-item">
                <span className="field-hint">Editing</span>
                <strong>{editingId ? "You are editing an existing coupon." : "Form is ready for a new coupon."}</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Layers size={18} />
            </span>
            Existing Coupons
          </h3>
        </div>

        <DataTable
          rows={coupons}
          columns={[
            {
              key: "code",
              title: "Coupon",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.code}</strong>
                  <span className="field-hint">{row.name}</span>
                </div>
              )
            },
            {
              key: "offer",
              title: "Offer",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{getOfferLabel(row.discount_type, row.discount_value)}</strong>
                  <span className="field-hint">Minimum order: RWF {row.minimum_order_amount}</span>
                </div>
              )
            },
            {
              key: "scope",
              title: "Scope",
              render: (row) => getScopeLabel(row.applies_to)
            },
            {
              key: "window",
              title: "Window",
              render: (row) => (
                <div className="stack-sm">
                  <span>{formatDateTimeLabel(row.starts_at)}</span>
                  <span className="field-hint">to {formatDateTimeLabel(row.ends_at)}</span>
                </div>
              )
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span className={`coupon-status${row.is_active ? " active" : ""}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              )
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => void startEdit(row.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => void requestDelete(row.id)}>
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
