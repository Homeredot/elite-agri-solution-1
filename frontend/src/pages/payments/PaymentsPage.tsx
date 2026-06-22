import { BadgeCheck, Receipt, Undo2, Wallet } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CrudSection } from "../../components/ui/CrudSection";
import { DataTable } from "../../components/ui/DataTable";

const parseJsonObject = (value: unknown) => {
  if (!value) {
    return {};
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return typeof value === "object" ? (value as Record<string, unknown>) : {};
};

export const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const transactionsQuery = useQuery({
    queryKey: ["payment-transactions"],
    queryFn: () => api.get<{ data: any[] }>("/payments/transactions")
  });
  const refundsQuery = useQuery({
    queryKey: ["payment-refunds"],
    queryFn: () => api.get<{ data: any[] }>("/payments/refunds")
  });

  const verifyMutation = useMutation({
    mutationFn: (id: number) => api.post(`/payments/transactions/${id}/manual-verify`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
    }
  });

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Payments</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <Wallet size={20} />
            </span>
            Manage payment methods, transaction monitoring, manual verification, and refunds
          </h2>
        </div>
      </div>

      <CrudSection
        title="Payment Methods"
        endpoint="/payments/methods"
        queryKey={["payment-methods"]}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "code", label: "Code", type: "text" },
          {
            name: "provider",
            label: "Provider",
            type: "select",
            options: ["pesapal", "cash", "manual", "other"].map((value) => ({ label: value, value }))
          },
          { name: "baseUrl", label: "Base URL", type: "text" },
          { name: "apiKey", label: "API Key", type: "text" },
          { name: "secret", label: "Secret", type: "text" },
          { name: "isEnabled", label: "Enabled", type: "checkbox" },
          { name: "requiresManualVerification", label: "Manual Verification", type: "checkbox" }
        ]}
        loadEditValues={async (row) => {
          const config = parseJsonObject(row.config_json);

          return {
            name: row.name,
            code: row.code,
            provider: row.provider,
            baseUrl: typeof config.base_url === "string" ? config.base_url : "",
            apiKey: typeof config.api_key === "string" ? config.api_key : "",
            secret: typeof config.secret === "string" ? config.secret : "",
            isEnabled: Boolean(row.is_enabled),
            requiresManualVerification: Boolean(row.requires_manual_verification)
          };
        }}
        columns={[
          { key: "name", title: "Name", render: (row) => row.name },
          { key: "provider", title: "Provider", render: (row) => row.provider },
          { key: "enabled", title: "Enabled", render: (row) => (row.is_enabled ? "Yes" : "No") }
        ]}
        transformSubmit={(values) => ({
          name: values.name,
          code: values.code,
          provider: values.provider,
          isEnabled: Boolean(values.isEnabled),
          requiresManualVerification: Boolean(values.requiresManualVerification),
          configJson: Object.fromEntries(
            Object.entries({
              base_url: values.baseUrl,
              api_key: values.apiKey,
              secret: values.secret
            }).filter(([, value]) => typeof value === "string" && value.trim())
          )
        })}
      />

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <BadgeCheck size={18} />
              </span>
              Transactions
            </h3>
          </div>
          <DataTable
            rows={transactionsQuery.data?.data ?? []}
            columns={[
              { key: "order", title: "Order", render: (row) => row.order_number },
              { key: "method", title: "Method", render: (row) => row.payment_method_name },
              { key: "amount", title: "Amount", render: (row) => `RWF ${row.amount}` },
              { key: "status", title: "Status", render: (row) => row.status },
              {
                key: "verify",
                title: "Action",
                render: (row) =>
                  row.status !== "success" ? (
                    <Button variant="ghost" onClick={() => verifyMutation.mutate(row.id)}>
                      <BadgeCheck size={16} />
                      Manual Verify
                    </Button>
                  ) : (
                    "Verified"
                  )
              }
            ]}
          />
        </Card>
        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Undo2 size={18} />
              </span>
              Refunds
            </h3>
          </div>
          <DataTable
            rows={refundsQuery.data?.data ?? []}
            columns={[
              { key: "order", title: "Order", render: (row) => row.order_number },
              { key: "amount", title: "Amount", render: (row) => `RWF ${row.amount}` },
              { key: "status", title: "Status", render: (row) => row.status },
              { key: "reason", title: "Reason", render: (row) => row.reason || "n/a" }
            ]}
          />
        </Card>
      </div>

      <Card className="stack-sm">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Receipt size={18} />
            </span>
            Payment Visibility
          </h3>
        </div>
        <p>Enabled payment methods here flow directly into storefront checkout and payment status messaging.</p>
      </Card>
    </div>
  );
};
