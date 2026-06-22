import { CreditCard, MapPinned, ReceiptText, ShoppingBag, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ApiError, api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLiveCartItems } from "../hooks/useLiveCartItems";
import type { StoreCustomerAddress } from "../types/store";
import { formatMoney, getEffectivePrice } from "../utils/pricing";

type CheckoutFieldKey =
  | "firstName"
  | "email"
  | "phone"
  | "addressLine1"
  | "city"
  | "country"
  | "deliveryZoneId"
  | "paymentMethodId";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { clearCart } = useCart();
  const { items, subtotal, hasUnavailableItems } = useLiveCartItems();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckoutFieldKey, string>>>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    country: "Rwanda",
    couponCode: "",
    deliveryZoneId: "",
    paymentMethodId: ""
  });
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const applySavedAddress = (address: StoreCustomerAddress) => {
    const nameParts = address.recipientName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    setForm((current) => ({
      ...current,
      firstName: firstName || current.firstName,
      lastName: lastName || current.lastName,
      phone: address.phone || current.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      region: address.region || "",
      country: address.country || current.country
    }));
    setFieldErrors((current) => ({
      ...current,
      firstName: undefined,
      phone: undefined,
      addressLine1: undefined,
      city: undefined,
      country: undefined
    }));
  };

  const clearFieldError = (key: CheckoutFieldKey) => {
    setFieldErrors((current) => ({
      ...current,
      [key]: undefined
    }));
  };

  const validateCheckoutForm = () => {
    const nextErrors: Partial<Record<CheckoutFieldKey, string>> = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    }

    if (!form.addressLine1.trim()) {
      nextErrors.addressLine1 = "Address line 1 is required.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "City is required.";
    }

    if (!form.country.trim()) {
      nextErrors.country = "Country is required.";
    }

    if (!form.deliveryZoneId) {
      nextErrors.deliveryZoneId = "Please choose a delivery zone.";
    }

    if (!form.paymentMethodId) {
      nextErrors.paymentMethodId = "Please choose a payment method.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstMessage = Object.values(nextErrors)[0];
      setCheckoutError(firstMessage ?? "Please complete the required checkout fields.");
      return false;
    }

    setCheckoutError(null);
    return true;
  };

  const getCheckoutErrorMessage = (error: unknown) => {
    if (!(error instanceof ApiError)) {
      return "Something went wrong while placing your order. Please try again.";
    }

    if (error.status === 422 && error.details && typeof error.details === "object" && "fieldErrors" in error.details) {
      const details = error.details as { fieldErrors?: Record<string, string[]> };
      const firstFieldMessage = Object.values(details.fieldErrors ?? {}).flat().find(Boolean);
      return firstFieldMessage ?? "Please review the checkout form and try again.";
    }

    if (error.message.toLowerCase() === "validation failed") {
      return "Please review the checkout form and fill in the missing details.";
    }

    return error.message;
  };

  useEffect(() => {
    if (!customer) {
      return;
    }

    setForm((current) => ({
      ...current,
      firstName: current.firstName || customer.firstName,
      lastName: current.lastName || customer.lastName || "",
      email: current.email || customer.email,
      phone: current.phone || customer.phone || ""
    }));
  }, [customer]);

  const zonesQuery = useQuery({
    queryKey: ["store-zones"],
    queryFn: () => api.get<{ data: any[] }>("/store/delivery-zones")
  });
  const paymentMethodsQuery = useQuery({
    queryKey: ["store-payment-methods"],
    queryFn: () => api.get<{ data: any[] }>("/store/payment-methods")
  });
  const addressesQuery = useQuery({
    queryKey: ["store-customer-addresses", "checkout"],
    queryFn: () => api.get<{ data: StoreCustomerAddress[] }>("/store/customers/addresses"),
    enabled: Boolean(customer)
  });

  const selectedZone = useMemo(
    () => zonesQuery.data?.data.find((zone) => String(zone.id) === form.deliveryZoneId),
    [form.deliveryZoneId, zonesQuery.data]
  );
  const availableAddresses = useMemo(
    () =>
      (addressesQuery.data?.data ?? []).filter(
        (address) => address.addressType === "shipping" || address.addressType === "both"
      ),
    [addressesQuery.data]
  );

  const shippingAmount = selectedZone
    ? selectedZone.free_delivery_threshold && subtotal >= selectedZone.free_delivery_threshold
      ? 0
      : Number(selectedZone.base_fee || 0)
    : 0;

  useEffect(() => {
    if (!availableAddresses.length || selectedAddressId) {
      return;
    }

    const defaultAddress = availableAddresses.find((address) => Boolean(address.isDefault)) ?? availableAddresses[0];
    setSelectedAddressId(String(defaultAddress.id));
    applySavedAddress(defaultAddress);
  }, [availableAddresses, selectedAddressId]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validateCheckoutForm()) {
        throw new Error("checkout_form_invalid");
      }

      return api.post<{
        data: {
          orderId: number;
          orderNumber: string;
          payment?: {
            merchantReference?: string;
            providerReference?: string | null;
            redirectUrl?: string | null;
            status?: string;
          } | null;
        };
      }>("/store/checkout", {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName || null,
          email: form.email,
          phone: form.phone || null
        },
        billing: {
          firstName: form.firstName,
          lastName: form.lastName || null,
          email: form.email,
          phone: form.phone || null,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || null,
          city: form.city || null,
          region: form.region || null,
          country: form.country || null
        },
        shipping: {
          firstName: form.firstName,
          lastName: form.lastName || null,
          phone: form.phone || null,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2 || null,
          city: form.city || null,
          region: form.region || null,
          country: form.country || null
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryZoneId: form.deliveryZoneId ? Number(form.deliveryZoneId) : null,
        paymentMethodId: form.paymentMethodId ? Number(form.paymentMethodId) : null,
        couponCode: form.couponCode || null
      });
    },
    onSuccess: (response) => {
      setCheckoutError(null);
      setFieldErrors({});
      clearCart();
      if (response.data.payment?.redirectUrl) {
        window.location.href = response.data.payment.redirectUrl;
        return;
      }

      const params = new URLSearchParams({
        orderNumber: String(response.data.orderNumber),
        orderId: String(response.data.orderId)
      });

      if (response.data.payment?.merchantReference) {
        params.set("reference", response.data.payment.merchantReference);
      }

      navigate(`/order-success?${params.toString()}`);
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "checkout_form_invalid") {
        return;
      }

      setCheckoutError(getCheckoutErrorMessage(error));
    }
  });

  return (
    <div className="page-stack">
      {checkoutError ? (
        <div className="store-toast-stack">
          <article className="store-toast glass checkout-toast-error">
            <div className="store-toast-head">
              <strong>Checkout issue</strong>
              <button type="button" onClick={() => setCheckoutError(null)}>
                <X size={14} />
              </button>
            </div>
            <p>{checkoutError}</p>
          </article>
        </div>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Checkout</p>
            <h1 className="title-with-icon">
              <span className="title-icon">
                <ShoppingBag size={20} />
              </span>
              Complete your order
            </h1>
          </div>
        </div>
      </section>

      <div className="checkout-layout">
        <section className="glass form-panel">
          <h2 className="title-with-icon">
            <span className="title-icon">
              <MapPinned size={20} />
            </span>
            Delivery information
          </h2>
          <div className="form-grid">
            {availableAddresses.length ? (
              <label className="field">
                <span>Saved address</span>
                <select
                  value={selectedAddressId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    setSelectedAddressId(nextId);
                    const nextAddress = availableAddresses.find((address) => String(address.id) === nextId);
                    if (nextAddress) {
                      applySavedAddress(nextAddress);
                    }
                  }}
                >
                  <option value="">Select a saved address</option>
                  {availableAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.label}
                      {address.isDefault ? " (Default)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {[
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["addressLine1", "Address line 1"],
              ["addressLine2", "Address line 2"],
              ["city", "City"],
              ["region", "Region"],
              ["country", "Country"]
            ].map(([key, label]) => (
              <label
                className={`field ${fieldErrors[key as CheckoutFieldKey] ? "field-error" : ""}`}
                key={key}
              >
                <span>{label}</span>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, [key]: event.target.value }));
                    if (["firstName", "email", "phone", "addressLine1", "city", "country"].includes(key)) {
                      clearFieldError(key as CheckoutFieldKey);
                    }
                  }}
                />
                {fieldErrors[key as CheckoutFieldKey] ? (
                  <small className="field-error-message">{fieldErrors[key as CheckoutFieldKey]}</small>
                ) : null}
              </label>
            ))}
            <label className={`field ${fieldErrors.deliveryZoneId ? "field-error" : ""}`}>
              <span>Delivery zone</span>
              <select
                value={form.deliveryZoneId}
                onChange={(event) => {
                  setForm((current) => ({ ...current, deliveryZoneId: event.target.value }));
                  clearFieldError("deliveryZoneId");
                }}
              >
                <option value="">Select a delivery zone</option>
                {(zonesQuery.data?.data || []).map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              {fieldErrors.deliveryZoneId ? (
                <small className="field-error-message">{fieldErrors.deliveryZoneId}</small>
              ) : null}
            </label>
            <label className={`field ${fieldErrors.paymentMethodId ? "field-error" : ""}`}>
              <span>Payment method</span>
              <select
                value={form.paymentMethodId}
                onChange={(event) => {
                  setForm((current) => ({ ...current, paymentMethodId: event.target.value }));
                  clearFieldError("paymentMethodId");
                }}
              >
                <option value="">Select payment method</option>
                {(paymentMethodsQuery.data?.data || []).map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              {fieldErrors.paymentMethodId ? (
                <small className="field-error-message">{fieldErrors.paymentMethodId}</small>
              ) : null}
            </label>
            <label className="field">
              <span>Coupon code</span>
              <input
                value={form.couponCode}
                onChange={(event) => setForm((current) => ({ ...current, couponCode: event.target.value }))}
              />
            </label>
          </div>
        </section>

        <aside className="glass summary-panel">
          <h2 className="title-with-icon">
            <span className="title-icon">
              <ReceiptText size={20} />
            </span>
            Order summary
          </h2>
          <div className="summary-list">
            {items.map((item) => (
              <div key={item.productId}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>
                  {formatMoney(getEffectivePrice(item.price, item.discountPrice) * item.quantity)}
                </strong>
              </div>
            ))}
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{formatMoney(shippingAmount)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatMoney(subtotal + shippingAmount)}</strong>
            </div>
          </div>
          <button
            className="primary-btn"
            onClick={() => mutation.mutate()}
            disabled={!items.length || hasUnavailableItems}
          >
            <CreditCard size={16} />
            Place order
          </button>
          {hasUnavailableItems ? (
            <div className="error-chip">
              One or more cart items exceed current stock. Update your cart before ordering.
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
};
