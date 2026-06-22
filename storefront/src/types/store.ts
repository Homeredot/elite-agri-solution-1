export type StoreProductSummary = {
  id: number;
  slug: string;
  name: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  average_rating?: number;
  total_reviews?: number;
  og_image_url?: string | null;
  short_description?: string | null;
};

export type StoreCustomerProfile = {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  accountStatus: string;
  totalOrders: number;
  totalSpent: number;
};

export type StoreCustomerAddress = {
  id: number;
  label: string;
  recipientName: string;
  phone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  addressType: "shipping" | "billing" | "both";
  isDefault: number | boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreOrderSummary = {
  id: number;
  order_number: string;
  order_status: string;
  payment_status: string;
  delivery_status: string;
  total_amount: number;
  currency_code: string;
  placed_at: string;
  item_count: number;
};

export type StoreOrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  sku: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  slug?: string | null;
  image_url?: string | null;
};

export type StoreOrderTimelineEntry = {
  status_type: string;
  old_status: string | null;
  new_status: string;
  description: string | null;
  changed_at: string;
};

export type StoreOrderPayment = {
  id: number;
  transaction_reference: string | null;
  transaction_type: string;
  amount: number;
  currency_code: string;
  status: string;
  processed_at: string | null;
  payment_method_name: string | null;
};

export type StoreRefund = {
  id: number;
  amount: number;
  status: string;
  reason: string | null;
  processed_at: string | null;
  created_at: string;
};

export type StoreOrderDetail = {
  id: number;
  order_number: string;
  order_status: string;
  payment_status: string;
  delivery_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  currency_code: string;
  customer_notes: string | null;
  billing_first_name: string;
  billing_last_name: string | null;
  billing_email: string;
  billing_phone: string | null;
  billing_address_line1: string;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_region: string | null;
  billing_country: string | null;
  shipping_first_name: string;
  shipping_last_name: string | null;
  shipping_phone: string | null;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_region: string | null;
  shipping_country: string | null;
  placed_at: string;
  delivery_zone_name: string | null;
  items: StoreOrderItem[];
  timeline: StoreOrderTimelineEntry[];
  payments: StoreOrderPayment[];
  refunds: StoreRefund[];
};
