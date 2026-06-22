import { Heart, MapPinned, PackageSearch, Save, UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductCard } from "../components/shop/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import type {
  StoreCustomerAddress,
  StoreCustomerProfile,
  StoreOrderDetail,
  StoreOrderSummary,
  StoreProductSummary
} from "../types/store";
import { formatMoney } from "../utils/pricing";
import { resolveStoreImage } from "../utils/media";

const AccountGuard = ({ children }: PropsWithChildren) => {
  const { token, customer, isLoading } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading && !customer) {
    return (
      <div className="page-stack">
        <section className="glass account-hero">
          <p className="eyebrow">My account</p>
          <h1>Loading your account...</h1>
        </section>
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AccountHero = ({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <section className="glass account-hero">
    <p className="eyebrow">{eyebrow}</p>
    <h1 className="title-with-icon">
      <span className="title-icon">
        <UserRound size={20} />
      </span>
      {title}
    </h1>
    <p>{description}</p>
  </section>
);

const OrdersPreview = () => {
  const ordersQuery = useQuery({
    queryKey: ["store-customer-orders", "preview"],
    queryFn: () => api.get<{ data: StoreOrderSummary[] }>("/store/customers/orders?pageSize=3")
  });

  if (!ordersQuery.data?.data.length) {
    return (
      <div className="glass empty-card">
        <PackageSearch size={20} />
        <strong>No orders yet</strong>
        <p>Your completed checkouts will appear here with live status updates.</p>
      </div>
    );
  }

  return (
    <div className="stack-list">
      {ordersQuery.data.data.map((order) => (
        <Link key={order.id} to={`/account/orders/${order.id}`} className="glass order-card">
          <div className="order-card-head">
            <strong>{order.order_number}</strong>
            <span>{formatMoney(order.total_amount, order.currency_code)}</span>
          </div>
          <div className="meta-wrap">
            <span>{order.order_status}</span>
            <span>{order.payment_status}</span>
            <span>{new Date(order.placed_at).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export const AccountDashboardPage = () => {
  const { customer } = useAuth();
  const accountLinks = [
    { label: "Profile", href: "/account/profile", icon: UserRound },
    { label: "Orders", href: "/account/orders", icon: PackageSearch },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Addresses", href: "/account/addresses", icon: MapPinned }
  ];

  return (
    <AccountGuard>
      <div className="page-stack">
        <AccountHero
          eyebrow="My account"
          title={customer ? `Hello, ${customer.firstName}` : "Customer dashboard"}
          description="Your profile, recent orders, and saved storefront activity now read from the backend where the data exists."
        />

        <section className="account-grid">
          <article className="glass account-card">
            <strong>Total orders</strong>
            <span>{customer?.totalOrders ?? 0}</span>
          </article>
          <article className="glass account-card">
            <strong>Total spent</strong>
            <span>{formatMoney(customer?.totalSpent ?? 0)}</span>
          </article>
          {accountLinks.map(({ label, href, icon: Icon }) => (
            <Link key={href} to={href} className="glass account-card">
              <Icon size={18} />
              <strong>{label}</strong>
              <span>Open</span>
            </Link>
          ))}
        </section>

        <section className="section-block">
          <div className="section-heading">
            <h2>Recent orders</h2>
            <Link to="/account/orders" className="primary-btn">
              View all
            </Link>
          </div>
          <OrdersPreview />
        </section>
      </div>
    </AccountGuard>
  );
};

export const ProfilePage = () => {
  const { customer, updateCustomer } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (!customer) {
      return;
    }

    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName || "",
      email: customer.email,
      phone: customer.phone || ""
    });
  }, [customer]);

  const mutation = useMutation({
    mutationFn: () =>
      api.patch<{ data: StoreCustomerProfile }>("/store/customers/me", {
        firstName: form.firstName,
        lastName: form.lastName || null,
        email: form.email,
        phone: form.phone || null
      }),
    onSuccess: (response) => {
      updateCustomer(response.data);
    }
  });

  return (
    <AccountGuard>
      <div className="page-stack">
        <AccountHero
          eyebrow="Profile"
          title="Your customer profile"
          description="These details now update the customer record in the backend and are reused during authenticated checkout."
        />
        <section className="glass form-panel">
          <div className="form-grid">
            {[
              ["firstName", "First name", "text"],
              ["lastName", "Last name", "text"],
              ["email", "Email", "email"],
              ["phone", "Phone", "text"]
            ].map(([key, label, type]) => (
              <label className="field" key={key}>
                <span>{label}</span>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, [key]: event.target.value }))
                  }
                />
              </label>
            ))}
          </div>
          <button className="primary-btn" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            <Save size={16} />
            Save profile
          </button>
          {mutation.isSuccess ? <div className="success-chip">Profile updated.</div> : null}
          {mutation.error ? <div className="error-chip">{mutation.error.message}</div> : null}
        </section>
      </div>
    </AccountGuard>
  );
};

export const OrdersPage = () => {
  const ordersQuery = useQuery({
    queryKey: ["store-customer-orders", "full"],
    queryFn: () => api.get<{ data: StoreOrderSummary[] }>("/store/customers/orders?pageSize=20")
  });

  return (
    <AccountGuard>
      <div className="page-stack">
        <AccountHero
          eyebrow="Orders"
          title="Your order history"
          description="Statuses, totals, and dates below are now pulled from the real orders created in the backend."
        />

        {ordersQuery.data?.data.length ? (
          <div className="stack-list">
            {ordersQuery.data.data.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.id}`} className="glass order-card">
                <div className="order-card-head">
                  <div className="order-title-block">
                    <strong>{order.order_number}</strong>
                    <span>{order.item_count} item(s)</span>
                  </div>
                  <strong>{formatMoney(order.total_amount, order.currency_code)}</strong>
                </div>
                <div className="meta-wrap">
                  <span>Order: {order.order_status}</span>
                  <span>Payment: {order.payment_status}</span>
                  <span>Delivery: {order.delivery_status}</span>
                  <span>{new Date(order.placed_at).toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass empty-card">
            <PackageSearch size={20} />
            <strong>No orders yet</strong>
            <p>Place a checkout from the storefront and it will appear here.</p>
          </div>
        )}
      </div>
    </AccountGuard>
  );
};

export const OrderDetailsPage = () => {
  const { id = "" } = useParams();
  const orderQuery = useQuery({
    queryKey: ["store-customer-order", id],
    queryFn: () => api.get<{ data: StoreOrderDetail }>(`/store/customers/orders/${id}`),
    enabled: Boolean(id)
  });

  const order = orderQuery.data?.data;
  const addressLines = useMemo(
    () =>
      order
        ? [
            order.shipping_address_line1,
            order.shipping_address_line2,
            order.shipping_city,
            order.shipping_region,
            order.shipping_country
          ].filter(Boolean)
        : [],
    [order]
  );

  return (
    <AccountGuard>
      <div className="page-stack">
        <AccountHero
          eyebrow="Order detail"
          title={order?.order_number || "Order detail"}
          description="This page now reads the real order, its items, payment records, and timeline from the backend."
        />

        {!order ? (
          <div className="glass empty-card">
            <PackageSearch size={20} />
            <strong>Loading order...</strong>
          </div>
        ) : (
          <>
            <section className="glass form-panel">
              <div className="stack-list">
                <div className="order-card-head">
                  <strong>Status</strong>
                  <span>{order.order_status}</span>
                </div>
                <div className="meta-wrap">
                  <span>Payment: {order.payment_status}</span>
                  <span>Delivery: {order.delivery_status}</span>
                  <span>{new Date(order.placed_at).toLocaleString()}</span>
                </div>
                <div className="meta-wrap">
                  <span>Total: {formatMoney(order.total_amount, order.currency_code)}</span>
                  <span>Shipping: {formatMoney(order.shipping_amount, order.currency_code)}</span>
                  <span>Discount: {formatMoney(order.discount_amount, order.currency_code)}</span>
                </div>
              </div>
            </section>

            <section className="section-block">
              <div className="section-heading">
                <h2>Items</h2>
              </div>
              <div className="stack-list">
                {order.items.map((item) => (
                  <article key={item.id} className="glass order-item-card">
                    <img
                      src={resolveStoreImage(item.image_url, item.product_name, "#E7D8A4")}
                      alt={item.product_name}
                    />
                    <div className="order-item-copy">
                      <strong>{item.product_name}</strong>
                      <span>Qty: {item.quantity}</span>
                      <span>{formatMoney(item.line_total, order.currency_code)}</span>
                      {item.slug ? <Link to={`/products/${item.slug}`}>View product</Link> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="checkout-layout single-column-layout">
              <article className="glass summary-panel">
                <h2>Delivery</h2>
                <div className="stack-list">
                  <span>{order.delivery_zone_name || "Delivery zone not set"}</span>
                  <span>{addressLines.join(", ")}</span>
                  {order.customer_notes ? <span>Note: {order.customer_notes}</span> : null}
                </div>
              </article>
              <article className="glass summary-panel">
                <h2>Timeline</h2>
                <div className="stack-list">
                  {order.timeline.length ? (
                    order.timeline.map((entry, index) => (
                      <div key={`${entry.status_type}-${index}`} className="timeline-row">
                        <strong>{entry.status_type}</strong>
                        <span>{entry.new_status}</span>
                        <small>{new Date(entry.changed_at).toLocaleString()}</small>
                        {entry.description ? <p>{entry.description}</p> : null}
                      </div>
                    ))
                  ) : (
                    <span>No timeline entries yet.</span>
                  )}
                </div>
              </article>
            </section>

            {(order.payments.length || order.refunds.length) ? (
              <section className="checkout-layout single-column-layout">
                {order.payments.length ? (
                  <article className="glass summary-panel">
                    <h2>Payments</h2>
                    <div className="stack-list">
                      {order.payments.map((payment) => (
                        <div key={payment.id} className="timeline-row">
                          <strong>{payment.payment_method_name || payment.transaction_type}</strong>
                          <span>{payment.status}</span>
                          <small>{formatMoney(payment.amount, payment.currency_code)}</small>
                        </div>
                      ))}
                    </div>
                  </article>
                ) : null}
                {order.refunds.length ? (
                  <article className="glass summary-panel">
                    <h2>Refunds</h2>
                    <div className="stack-list">
                      {order.refunds.map((refund) => (
                        <div key={refund.id} className="timeline-row">
                          <strong>{formatMoney(refund.amount, order.currency_code)}</strong>
                          <span>{refund.status}</span>
                          <small>{refund.reason || "No reason provided"}</small>
                        </div>
                      ))}
                    </div>
                  </article>
                ) : null}
              </section>
            ) : null}
          </>
        )}
      </div>
    </AccountGuard>
  );
};

export const WishlistPage = () => {
  const { wishlist } = useCart();
  const wishlistQuery = useQuery({
    queryKey: ["store-wishlist-products", wishlist],
    queryFn: () =>
      api.get<{ data: StoreProductSummary[] }>(`/store/products/batch?ids=${wishlist.join(",")}`),
    enabled: wishlist.length > 0
  });

  return (
    <div className="page-stack">
      <AccountHero
        eyebrow="Wishlist"
        title="Saved items"
        description="Wishlist product cards below now refresh from the backend. Persistence is still local until a dedicated wishlist table exists."
      />
      {wishlistQuery.data?.data.length ? (
        <div className="product-grid">
          {wishlistQuery.data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass empty-card">
          <Heart size={20} />
          <strong>No saved items</strong>
          <p>Add products to wishlist from the catalog or product page to see them here.</p>
        </div>
      )}
    </div>
  );
};

export const AddressesPage = () => (
  <AccountGuard>
    <AddressesContent />
  </AccountGuard>
);

const EMPTY_ADDRESS_FORM = {
  label: "",
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  country: "Rwanda",
  addressType: "shipping" as StoreCustomerAddress["addressType"],
  isDefault: false
};

const AddressesContent = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);

  const addressesQuery = useQuery({
    queryKey: ["store-customer-addresses"],
    queryFn: () => api.get<{ data: StoreCustomerAddress[] }>("/store/customers/addresses")
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      editingId
        ? api.put<{ data: StoreCustomerAddress[] }>(`/store/customers/addresses/${editingId}`, {
            ...form,
            phone: form.phone || null,
            addressLine2: form.addressLine2 || null,
            city: form.city || null,
            region: form.region || null,
            country: form.country || null
          })
        : api.post<{ data: StoreCustomerAddress[] }>("/store/customers/addresses", {
            ...form,
            phone: form.phone || null,
            addressLine2: form.addressLine2 || null,
            city: form.city || null,
            region: form.region || null,
            country: form.country || null
          }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["store-customer-addresses"] });
      setEditingId(null);
      setForm(EMPTY_ADDRESS_FORM);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: number) => api.delete<{ data: StoreCustomerAddress[] }>(`/store/customers/addresses/${addressId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["store-customer-addresses"] });
      if (editingId) {
        setEditingId(null);
        setForm(EMPTY_ADDRESS_FORM);
      }
    }
  });

  const startEdit = (address: StoreCustomerAddress) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      region: address.region || "",
      country: address.country || "",
      addressType: address.addressType,
      isDefault: Boolean(address.isDefault)
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_ADDRESS_FORM);
  };

  return (
    <div className="page-stack">
      <AccountHero
        eyebrow="Addresses"
        title="Saved addresses"
        description="Save delivery and billing addresses to reuse during future orders."
      />

      <section className="glass form-panel">
        <div className="section-heading">
          <h2>{editingId ? "Edit address" : "Add address"}</h2>
        </div>
        <div className="form-grid">
          {[
            ["label", "Label"],
            ["recipientName", "Recipient name"],
            ["phone", "Phone"],
            ["addressLine1", "Address line 1"],
            ["addressLine2", "Address line 2"],
            ["city", "City"],
            ["region", "Region"],
            ["country", "Country"]
          ].map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input
                value={form[key as keyof typeof form] as string}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
          <label className="field">
            <span>Address type</span>
            <select
              value={form.addressType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  addressType: event.target.value as StoreCustomerAddress["addressType"]
                }))
              }
            >
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label className="field field-checkbox">
            <span>Default address</span>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))}
            />
          </label>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save size={16} />
            {editingId ? "Update address" : "Save address"}
          </button>
          {editingId ? (
            <button className="secondary-btn" onClick={resetForm} type="button">
              Cancel
            </button>
          ) : null}
        </div>
        {saveMutation.isSuccess ? (
          <div className="success-chip">{editingId ? "Address updated." : "Address saved."}</div>
        ) : null}
        {saveMutation.error ? <div className="error-chip">{saveMutation.error.message}</div> : null}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Your addresses</h2>
        </div>
        {addressesQuery.data?.data.length ? (
          <div className="stack-list">
            {addressesQuery.data.data.map((address) => (
              <article key={address.id} className="glass order-card">
                <div className="order-card-head">
                  <div className="order-title-block">
                    <strong>{address.label}</strong>
                    <span>{address.recipientName}</span>
                  </div>
                  <div className="meta-wrap">
                    <span>{address.addressType}</span>
                    {address.isDefault ? <span>Default</span> : null}
                  </div>
                </div>
                <div className="stack-list">
                  <span>{address.addressLine1}</span>
                  {address.addressLine2 ? <span>{address.addressLine2}</span> : null}
                  <span>{[address.city, address.region, address.country].filter(Boolean).join(", ")}</span>
                  {address.phone ? <span>{address.phone}</span> : null}
                </div>
                <div className="hero-actions">
                  <button className="secondary-btn" onClick={() => startEdit(address)} type="button">
                    Edit
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => deleteMutation.mutate(address.id)}
                    type="button"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass empty-card">
            <MapPinned size={20} />
            <strong>No saved addresses</strong>
            <p>Add your first delivery or billing address above.</p>
          </div>
        )}
        {deleteMutation.error ? <div className="error-chip">{deleteMutation.error.message}</div> : null}
      </section>
    </div>
  );
};
