import { ClipboardList, Eye, UserRound, UsersRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";

export const CustomersPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.get<{ data: any[] }>("/customers")
  });

  const customerDetailQuery = useQuery({
    queryKey: ["customer-detail", selectedId],
    queryFn: () => api.get<{ data: any }>(`/customers/${selectedId}`),
    enabled: Boolean(selectedId)
  });

  const statusMutation = useMutation({
    mutationFn: (accountStatus: string) => api.patch(`/customers/${selectedId}/status`, { accountStatus }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-detail", selectedId] });
    }
  });

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Customers</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <UsersRound size={20} />
            </span>
            View account history, spending, orders, internal notes, and access status
          </h2>
        </div>
      </div>

      <Card>
        <DataTable
          rows={customersQuery.data?.data ?? []}
          columns={[
            { key: "name", title: "Name", render: (row) => `${row.first_name} ${row.last_name ?? ""}` },
            { key: "email", title: "Email", render: (row) => row.email },
            { key: "orders", title: "Orders", render: (row) => row.total_orders },
            { key: "spent", title: "Spent", render: (row) => `RWF ${row.total_spent}` },
            { key: "status", title: "Status", render: (row) => row.account_status },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <Button variant="ghost" onClick={() => setSelectedId(row.id)}>
                  <Eye size={16} />
                  View
                </Button>
              )
            }
          ]}
        />
      </Card>

      {customerDetailQuery.data?.data ? (
        <div className="grid-two">
          <Card className="stack-md">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <UserRound size={18} />
                </span>
                Customer Profile
              </h3>
            </div>
            <p><strong>Name:</strong> {customerDetailQuery.data.data.first_name} {customerDetailQuery.data.data.last_name ?? ""}</p>
            <p><strong>Email:</strong> {customerDetailQuery.data.data.email}</p>
            <p><strong>Total Orders:</strong> {customerDetailQuery.data.data.total_orders}</p>
            <p><strong>Total Spent:</strong> RWF {customerDetailQuery.data.data.total_spent}</p>
            <div className="row-actions">
              <Button onClick={() => statusMutation.mutate("active")}>Activate</Button>
              <Button variant="secondary" onClick={() => statusMutation.mutate("inactive")}>
                Deactivate
              </Button>
              <Button variant="danger" onClick={() => statusMutation.mutate("blocked")}>
                Block
              </Button>
            </div>
          </Card>

          <Card>
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <ClipboardList size={18} />
                </span>
                Order History
              </h3>
            </div>
            <DataTable
              rows={customerDetailQuery.data.data.orders ?? []}
              columns={[
                { key: "order", title: "Order", render: (row) => row.order_number },
                { key: "status", title: "Status", render: (row) => row.order_status },
                { key: "payment", title: "Payment", render: (row) => row.payment_status },
                { key: "amount", title: "Amount", render: (row) => `RWF ${row.total_amount}` }
              ]}
            />
          </Card>
        </div>
      ) : null}
    </div>
  );
};
