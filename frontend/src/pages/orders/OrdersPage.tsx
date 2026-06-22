import { ClipboardList, FileText, ReceiptText } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API_URL, api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";

export const OrdersPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<{ data: any[] }>("/orders")
  });

  const orderDetailQuery = useQuery({
    queryKey: ["order-detail", selectedId],
    queryFn: () => api.get<{ data: any }>(`/orders/${selectedId}`),
    enabled: Boolean(selectedId)
  });

  const statusMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.patch(`/orders/${selectedId}/status`, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["order-detail", selectedId] });
    }
  });

  const openInvoicePdf = async () => {
    if (!selectedId) {
      return;
    }

    const token = localStorage.getItem("admin_token");
    const previewWindow = window.open("", "_blank", "noopener,noreferrer");

    try {
      setInvoiceError(null);
      const response = await fetch(`${API_URL}/orders/${selectedId}/invoice?format=pdf`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        let message = "Failed to open invoice PDF";

        try {
          const payload = await response.json();
          if (payload && typeof payload === "object" && "message" in payload) {
            message = String((payload as { message: unknown }).message);
          }
        } catch {
          // Ignore non-JSON error bodies and use the fallback message.
        }

        throw new Error(message);
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);

      if (previewWindow) {
        previewWindow.location.href = pdfUrl;
      } else {
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
      }

      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60_000);
    } catch (error) {
      if (previewWindow) {
        previewWindow.close();
      }

      setInvoiceError(error instanceof Error ? error.message : "Failed to open invoice PDF");
    }
  };

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div className="title-with-icon">
          <div className="title-icon">
            <ClipboardList size={20} />
          </div>
          <div>
          <p className="eyebrow">Orders</p>
          <h2>Track status, payment flow, delivery progress, notes, refunds, and invoices</h2>
          </div>
        </div>
      </div>

      <Card>
        <DataTable
          rows={ordersQuery.data?.data ?? []}
          columns={[
            { key: "order", title: "Order", render: (row) => row.order_number },
            { key: "customer", title: "Customer", render: (row) => row.customer_name },
            { key: "status", title: "Status", render: (row) => row.order_status },
            { key: "payment", title: "Payment", render: (row) => row.payment_status },
            { key: "delivery", title: "Delivery", render: (row) => row.delivery_status },
            { key: "total", title: "Total", render: (row) => `RWF ${row.total_amount}` },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <Button variant="ghost" onClick={() => setSelectedId(row.id)}>
                  View
                </Button>
              )
            }
          ]}
        />
      </Card>

      {orderDetailQuery.data?.data ? (
        <div className="grid-two">
          <Card className="stack-md">
            <div className="section-header">
              <h3 className="section-title"><FileText size={18} />Order Details</h3>
            </div>
            <p><strong>Order:</strong> {orderDetailQuery.data.data.order_number}</p>
            <p><strong>Customer:</strong> {orderDetailQuery.data.data.customer_name}</p>
            <p><strong>Payment:</strong> {orderDetailQuery.data.data.payment_status}</p>
            <p><strong>Delivery:</strong> {orderDetailQuery.data.data.delivery_status}</p>
            {invoiceError ? <div className="error-banner">{invoiceError}</div> : null}
            <div className="stack-sm">
              <Button
                onClick={() => statusMutation.mutate({ orderStatus: "confirmed", note: "Order confirmed" })}
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                onClick={() => statusMutation.mutate({ orderStatus: "processing", note: "Order processing" })}
              >
                Processing
              </Button>
              <Button
                variant="secondary"
                onClick={() => statusMutation.mutate({ orderStatus: "shipped", deliveryStatus: "in_transit" })}
              >
                Mark Shipped
              </Button>
              <Button
                variant="secondary"
                onClick={() => statusMutation.mutate({ orderStatus: "delivered", deliveryStatus: "delivered" })}
              >
                Mark Delivered
              </Button>
              <Button
                variant="ghost"
                onClick={openInvoicePdf}
              >
                Open invoice PDF
              </Button>
            </div>
          </Card>

          <Card>
            <div className="section-header">
              <h3 className="section-title"><ReceiptText size={18} />Order Items</h3>
            </div>
            <DataTable
              rows={orderDetailQuery.data.data.items ?? []}
              columns={[
                { key: "product", title: "Product", render: (row) => row.product_name },
                { key: "sku", title: "SKU", render: (row) => row.sku },
                { key: "qty", title: "Qty", render: (row) => row.quantity },
                { key: "total", title: "Total", render: (row) => `RWF ${row.line_total}` }
              ]}
            />
          </Card>
        </div>
      ) : null}
    </div>
  );
};
