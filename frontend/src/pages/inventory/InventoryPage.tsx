import { Boxes, History, PackagePlus, Save, TriangleAlert } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { StatCard } from "../../components/ui/StatCard";

export const InventoryPage = () => {
  const [productId, setProductId] = useState("");
  const [quantityChange, setQuantityChange] = useState("0");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["inventory-products"],
    queryFn: () => api.get<{ data: any[] }>("/inventory/products")
  });

  const overviewQuery = useQuery({
    queryKey: ["inventory-overview"],
    queryFn: () => api.get<{ summary: any; lowStock: any[] }>("/inventory/overview")
  });

  const movementQuery = useQuery({
    queryKey: ["inventory-movements"],
    queryFn: () => api.get<{ data: any[] }>("/inventory/movements")
  });

  const adjustmentMutation = useMutation({
    mutationFn: () =>
      api.post("/inventory/adjustments", {
        productId: Number(productId),
        quantityChange: Number(quantityChange),
        movementType: Number(quantityChange) >= 0 ? "restock" : "adjustment",
        notes
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inventory-products"] });
      await queryClient.invalidateQueries({ queryKey: ["inventory-overview"] });
      await queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      setProductId("");
      setQuantityChange("0");
      setNotes("");
    }
  });

  const summary = overviewQuery.data?.summary ?? {};
  const products = productsQuery.data?.data ?? [];
  const selectedProduct = products.find((product) => String(product.id) === productId);
  const canSubmitAdjustment = productId.trim().length > 0 && !adjustmentMutation.isPending;

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <Boxes size={20} />
            </span>
            Update stock levels, monitor low-stock items, and review stock movement history
          </h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Products" value={summary.total_products ?? 0} />
        <StatCard label="Low Stock" value={summary.low_stock_products ?? 0} />
        <StatCard label="Out of Stock" value={summary.out_of_stock_products ?? 0} />
        <StatCard label="Units in Stock" value={summary.total_units_in_stock ?? 0} />
      </div>

      <div className="grid-two">
        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <PackagePlus size={18} />
              </span>
              Quick Stock Adjustment
            </h3>
          </div>
          <label className="field">
            <span>Product</span>
            <select value={productId} onChange={(event) => setProductId(event.target.value)}>
              <option value="">
                {productsQuery.isLoading ? "Loading products..." : "Select a product"}
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - Stock: {product.stock_quantity}
                </option>
              ))}
            </select>
          </label>
          {selectedProduct ? (
            <p className="field-hint">
              Selected: {selectedProduct.name} ({selectedProduct.sku}) with {selectedProduct.stock_quantity} units in
              stock.
            </p>
          ) : null}
          <label className="field">
            <span>Quantity Change</span>
            <input
              type="number"
              value={quantityChange}
              onChange={(event) => setQuantityChange(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
          </label>
          <Button disabled={!canSubmitAdjustment} onClick={() => adjustmentMutation.mutate()}>
            <Save size={16} />
            {adjustmentMutation.isPending ? "Saving..." : "Save Adjustment"}
          </Button>
        </Card>

        <Card>
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <TriangleAlert size={18} />
              </span>
              Low Stock Alerts
            </h3>
          </div>
          <DataTable
            rows={overviewQuery.data?.lowStock ?? []}
            columns={[
              { key: "name", title: "Product", render: (row) => row.name },
              { key: "sku", title: "SKU", render: (row) => row.sku },
              { key: "qty", title: "Stock", render: (row) => row.stock_quantity },
              { key: "threshold", title: "Threshold", render: (row) => row.low_stock_threshold }
            ]}
          />
        </Card>
      </div>

      <Card>
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <History size={18} />
            </span>
            Stock History
          </h3>
        </div>
        <DataTable
          rows={movementQuery.data?.data ?? []}
          columns={[
            { key: "product", title: "Product", render: (row) => row.product_name },
            { key: "sku", title: "SKU", render: (row) => row.sku },
            { key: "type", title: "Type", render: (row) => row.movement_type },
            { key: "change", title: "Change", render: (row) => row.quantity_change },
            { key: "after", title: "After", render: (row) => row.quantity_after }
          ]}
        />
      </Card>
    </div>
  );
};
