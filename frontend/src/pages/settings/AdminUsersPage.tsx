import { History, KeyRound, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CrudSection } from "../../components/ui/CrudSection";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { api } from "../../api/client";

export const AdminUsersPage = () => {
  const permissionsQuery = useQuery({
    queryKey: ["admin-permissions"],
    queryFn: () => api.get<{ data: any[] }>("/admin/permissions")
  });

  const loginHistoryQuery = useQuery({
    queryKey: ["login-history"],
    queryFn: () => api.get<{ data: any[] }>("/audit/login-history")
  });

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin Access</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <ShieldCheck size={20} />
            </span>
            Manage staff accounts, roles, permissions, and security audit trails
          </h2>
        </div>
      </div>

      <CrudSection
        title="Admin Users"
        endpoint="/admin/users"
        queryKey={["admin-users"]}
        defaultValues={{ roleId: 1, status: "active", mustChangePassword: true }}
        fields={[
          { name: "roleId", label: "Role ID", type: "number" },
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "password", label: "Password", type: "text" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["active", "inactive", "suspended"].map((value) => ({ label: value, value }))
          },
          { name: "mustChangePassword", label: "Must Change Password", type: "checkbox" }
        ]}
        columns={[
          { key: "name", title: "Name", render: (row) => `${row.first_name} ${row.last_name ?? ""}` },
          { key: "email", title: "Email", render: (row) => row.email },
          { key: "role", title: "Role", render: (row) => row.role_name },
          { key: "status", title: "Status", render: (row) => row.status }
        ]}
      />

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <KeyRound size={18} />
              </span>
              Available Permissions
            </h3>
          </div>
          <DataTable
            rows={permissionsQuery.data?.data ?? []}
            columns={[
              { key: "module", title: "Module", render: (row) => row.module },
              { key: "action", title: "Action", render: (row) => row.action },
              { key: "key", title: "Permission Key", render: (row) => row.permission_key }
            ]}
          />
        </Card>

        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <History size={18} />
              </span>
              Login History
            </h3>
          </div>
          <DataTable
            rows={loginHistoryQuery.data?.data ?? []}
            columns={[
              { key: "email", title: "Email", render: (row) => row.email_attempted },
              { key: "status", title: "Status", render: (row) => row.login_status },
              { key: "ip", title: "IP", render: (row) => row.ip_address || "n/a" },
              { key: "time", title: "Time", render: (row) => row.created_at }
            ]}
          />
        </Card>
      </div>
    </div>
  );
};
