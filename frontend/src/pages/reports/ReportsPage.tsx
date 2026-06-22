import { ChartColumnBig, CreditCard, Download, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { API_URL, api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";

export const ReportsPage = () => {
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportingReport, setExportingReport] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["reports-summary"],
    queryFn: () => api.get<{ data: any }>("/reports/summary")
  });

  const exportReport = async (report: "sales" | "products") => {
    const token = localStorage.getItem("admin_token");

    try {
      setExportError(null);
      setExportingReport(report);

      const response = await fetch(`${API_URL}/reports/export?report=${report}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        let message = "Failed to export report";

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

      const csvBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${report}-report.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60_000);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Failed to export report");
    } finally {
      setExportingReport(null);
    }
  };

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reports & Analytics</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <ChartColumnBig size={20} />
            </span>
            Review revenue, product performance, customer activity, and export operational data
          </h2>
        </div>
        <div className="row-actions">
          <Button onClick={() => void exportReport("sales")}>
            <Download size={16} />
            {exportingReport === "sales" ? "Exporting..." : "Export Sales CSV"}
          </Button>
          <Button variant="secondary" onClick={() => void exportReport("products")}>
            <Download size={16} />
            {exportingReport === "products" ? "Exporting..." : "Export Products CSV"}
          </Button>
        </div>
      </div>

      {exportError ? <div className="error-banner">{exportError}</div> : null}

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <ChartColumnBig size={18} />
              </span>
              Sales Trend
            </h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={query.data?.data.sales ?? []}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <CreditCard size={18} />
              </span>
              Payment Status Summary
            </h3>
          </div>
          <DataTable
            rows={query.data?.data.payments ?? []}
            columns={[
              { key: "status", title: "Status", render: (row) => row.status },
              { key: "transactions", title: "Transactions", render: (row) => row.transactions },
              { key: "amount", title: "Total Amount", render: (row) => `RWF ${row.total_amount}` }
            ]}
          />
        </Card>
      </div>

      <div className="grid-two">
        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Package size={18} />
              </span>
              Top Products
            </h3>
          </div>
          <DataTable
            rows={query.data?.data.topProducts ?? []}
            columns={[
              { key: "name", title: "Product", render: (row) => row.name },
              { key: "sku", title: "SKU", render: (row) => row.sku },
              { key: "units", title: "Units Sold", render: (row) => row.units_sold },
              { key: "sales", title: "Sales", render: (row) => `RWF ${row.sales_total}` }
            ]}
          />
        </Card>

        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Users size={18} />
              </span>
              Top Customers
            </h3>
          </div>
          <DataTable
            rows={query.data?.data.customerActivity ?? []}
            columns={[
              { key: "name", title: "Customer", render: (row) => `${row.first_name} ${row.last_name ?? ""}` },
              { key: "orders", title: "Orders", render: (row) => row.total_orders },
              { key: "spent", title: "Spent", render: (row) => `RWF ${row.total_spent}` }
            ]}
          />
        </Card>
      </div>
    </div>
  );
};
