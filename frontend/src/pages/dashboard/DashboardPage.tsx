import { Activity, ArrowRight, Clock3, PackageSearch, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { StatCard } from "../../components/ui/StatCard";

type DashboardResponse = {
  summary: Record<string, number>;
  recentOrders: any[];
  lowStock: any[];
  topSelling: any[];
  salesAnalytics: { label: string; total_sales: number }[];
  quickActions: { label: string; href: string }[];
};

export const DashboardPage = () => {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardResponse>("/dashboard/overview")
  });

  const summary = data?.summary ?? {};

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div className="title-with-icon">
          <div className="title-icon">
            <Activity size={20} />
          </div>
          <div>
          <p className="eyebrow">Overview</p>
          <h2>Business performance at a glance</h2>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Users" value={summary.total_users ?? 0} />
        <StatCard label="Total Products" value={summary.total_products ?? 0} />
        <StatCard label="Total Categories" value={summary.total_categories ?? 0} />
        <StatCard label="Total Orders" value={summary.total_orders ?? 0} />
        <StatCard label="Revenue" value={`RWF ${summary.total_revenue ?? 0}`} />
        <StatCard label="Pending Orders" value={summary.pending_orders ?? 0} />
        <StatCard label="Delivered Orders" value={summary.delivered_orders ?? 0} />
        <StatCard label="Out of Stock" value={summary.out_of_stock_products ?? 0} />
      </div>

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title"><TrendingUp size={18} />Sales Analytics</h3>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.salesAnalytics ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title"><ArrowRight size={18} />Quick Actions</h3>
          </div>
          <div className="quick-actions">
            {(data?.quickActions ?? []).map((item) => (
              <Link key={item.href} className="quick-action" to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title"><Clock3 size={18} />Recent Orders</h3>
          </div>
          <DataTable
            rows={data?.recentOrders ?? []}
            columns={[
              { key: "order", title: "Order", render: (row) => row.order_number },
              { key: "customer", title: "Customer", render: (row) => row.customer_name },
              { key: "status", title: "Status", render: (row) => row.order_status },
              { key: "amount", title: "Amount", render: (row) => `RWF ${row.total_amount}` }
            ]}
          />
        </Card>
        <Card>
          <div className="section-header">
            <h3 className="section-title"><PackageSearch size={18} />Low Stock Alerts</h3>
          </div>
          <DataTable
            rows={data?.lowStock ?? []}
            columns={[
              { key: "name", title: "Product", render: (row) => row.name },
              { key: "sku", title: "SKU", render: (row) => row.sku },
              { key: "stock", title: "Stock", render: (row) => row.stock_quantity },
              { key: "threshold", title: "Threshold", render: (row) => row.low_stock_threshold }
            ]}
          />
        </Card>
      </div>
    </div>
  );
};
