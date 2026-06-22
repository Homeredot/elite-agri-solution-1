import { BellRing, CheckCheck, Inbox, Mail, Send, UsersRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { useAdminStatusNotice } from "../../components/ui/useAdminStatusNotice";

const EMPTY_FORM = {
  notificationType: "store_notice",
  title: "",
  message: "",
  channel: "in_app",
  audience: "all_customers",
  recipientCustomerId: ""
};

export const NotificationsPage = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  useAdminStatusNotice(statusMessage, statusError, {
    successTitle: "Notification sent",
    errorTitle: "Notification action failed"
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "all"],
    queryFn: () => api.get<{ data: any[] }>("/notifications?scope=all")
  });

  const customerTargetsQuery = useQuery({
    queryKey: ["notification-customer-targets"],
    queryFn: () => api.get<{ data: Array<{ id: number; name: string; email: string }> }>("/notifications/targets/customers")
  });

  const customerOptions = customerTargetsQuery.data?.data ?? [];
  const selectedCustomer = customerOptions.find((customer) => String(customer.id) === form.recipientCustomerId) ?? null;
  const audienceLabel = useMemo(() => {
    if (form.audience === "admin_self") {
      return "Admin only";
    }

    if (form.audience === "specific_customer") {
      return selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.email})` : "Choose a customer";
    }

    return form.channel === "email" ? "All active customers" : "All customers and storefront visitors";
  }, [form.audience, form.channel, selectedCustomer]);

  const createMutation = useMutation({
    mutationFn: () =>
      api.post<{ message: string }>("/notifications", {
        notificationType: form.notificationType,
        title: form.title,
        message: form.message,
        channel: form.channel,
        audience: form.audience,
        recipientCustomerId: form.audience === "specific_customer" ? Number(form.recipientCustomerId) : null
      }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setStatusError(null);
      setStatusMessage(response.message || "Notification sent.");
      setForm((current) => ({
        ...EMPTY_FORM,
        channel: current.channel,
        audience: current.channel === "email" ? "all_customers" : "all_customers"
      }));
    },
    onError: (error) => {
      setStatusMessage(null);
      setStatusError(error instanceof Error ? error.message : "Failed to send notification");
    }
  });

  const readMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/notifications/${id}/read`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const handleChannelChange = (channel: "in_app" | "email") => {
    setForm((current) => ({
      ...current,
      channel,
      audience: channel === "email" && current.audience === "admin_self" ? "all_customers" : current.audience
    }));
  };

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Notifications</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <BellRing size={20} />
            </span>
            Send storefront in-app notifications, customer emails, and review delivery history
          </h2>
        </div>
      </div>

      <div className="grid-two">
        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Send size={18} />
              </span>
              Create Notification
            </h3>
          </div>

          {statusMessage ? <div className="success-banner">{statusMessage}</div> : null}
          {statusError ? <div className="error-banner">{statusError}</div> : null}

          <label className="field">
            <span>Notification Type</span>
            <input
              value={form.notificationType}
              onChange={(event) => setForm((current) => ({ ...current, notificationType: event.target.value }))}
            />
          </label>

          <div className="grid-two">
            <label className="field">
              <span>Channel</span>
              <select value={form.channel} onChange={(event) => handleChannelChange(event.target.value as "in_app" | "email")}>
                <option value="in_app">In-App</option>
                <option value="email">Email</option>
              </select>
            </label>
            <label className="field">
              <span>Audience</span>
              <select
                value={form.audience}
                onChange={(event) =>
                  setForm((current) => ({ ...current, audience: event.target.value as typeof current.audience }))
                }
              >
                {form.channel === "in_app" ? <option value="admin_self">Admin Only</option> : null}
                <option value="specific_customer">Specific Customer</option>
                <option value="all_customers">
                  {form.channel === "email" ? "All Customers" : "All Customers / Visitors"}
                </option>
              </select>
            </label>
          </div>

          {form.audience === "specific_customer" ? (
            <label className="field">
              <span>Customer</span>
              <select
                value={form.recipientCustomerId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, recipientCustomerId: event.target.value }))
                }
              >
                <option value="">Choose customer</option>
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={5}
            />
          </label>

          <div className="banner-preview-meta">
            <div className="banner-meta-card">
              <span className="field-hint">Delivery mode</span>
              <strong>{form.channel === "email" ? "SMTP email" : "Storefront in-app"}</strong>
            </div>
            <div className="banner-meta-card">
              <span className="field-hint">Recipients</span>
              <strong>{audienceLabel}</strong>
            </div>
          </div>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={
              createMutation.isPending ||
              !form.title.trim() ||
              !form.message.trim() ||
              !form.notificationType.trim() ||
              (form.audience === "specific_customer" && !form.recipientCustomerId)
            }
          >
            {form.channel === "email" ? <Mail size={16} /> : <Send size={16} />}
            {createMutation.isPending
              ? form.channel === "email"
                ? "Sending Email..."
                : "Sending Notification..."
              : form.channel === "email"
                ? "Send Email"
                : "Send In-App Notification"}
          </Button>
        </Card>

        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <UsersRound size={18} />
              </span>
              Storefront Delivery Notes
            </h3>
          </div>
          <p>In-app notifications sent to all customers are treated as storefront broadcasts, so logged-in users and visitors can see them in the storefront notification center.</p>
          <p>Email notifications are sent through SMTP to one customer or all active customers. Failed deliveries stay visible in the history table below.</p>
        </Card>
      </div>

      <Card>
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Inbox size={18} />
            </span>
            Notification Center
          </h3>
        </div>
        <DataTable
          rows={notificationsQuery.data?.data ?? []}
          columns={[
            { key: "title", title: "Title", render: (row) => row.title },
            { key: "type", title: "Type", render: (row) => row.notification_type },
            { key: "channel", title: "Channel", render: (row) => row.channel },
            {
              key: "recipient",
              title: "Recipient",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.recipient_name || "Unknown recipient"}</strong>
                  <span className="field-hint">{row.recipient_email || row.recipient_type}</span>
                </div>
              )
            },
            { key: "status", title: "Status", render: (row) => row.status },
            {
              key: "action",
              title: "Action",
              render: (row) =>
                row.recipient_type === "admin" && row.status !== "read" ? (
                  <Button variant="ghost" onClick={() => readMutation.mutate(row.id)}>
                    <CheckCheck size={16} />
                    Mark Read
                  </Button>
                ) : (
                  row.status
                )
            }
          ]}
        />
      </Card>
    </div>
  );
};
