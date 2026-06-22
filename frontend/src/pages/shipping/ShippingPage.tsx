import { MapPinned, ScrollText, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { CrudSection } from "../../components/ui/CrudSection";

export const ShippingPage = () => {
  const zonesQuery = useQuery({
    queryKey: ["shipping-zones"],
    queryFn: () => api.get<{ data: any[] }>("/shipping/zones")
  });

  const zoneOptions = (zonesQuery.data?.data ?? []).map((zone) => ({
    label: `${zone.name} (${zone.code})`,
    value: String(zone.id)
  }));
  const zoneNameById = new Map(
    (zonesQuery.data?.data ?? []).map((zone) => [String(zone.id), `${zone.name} (${zone.code})`])
  );

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Shipping</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <Truck size={20} />
            </span>
            Manage delivery zones, fees, estimated timing, free-delivery rules, and partner details
          </h2>
        </div>
      </div>

      <div className="grid-two">
        <CrudSection
          title="Delivery Zones"
          endpoint="/shipping/zones"
          queryKey={["shipping-zones"]}
          fields={[
            { name: "name", label: "Name", type: "text" },
            { name: "code", label: "Code", type: "text" },
            { name: "country", label: "Country", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "district", label: "District", type: "text" },
            { name: "sector", label: "Sector", type: "text" },
            { name: "baseFee", label: "Base Fee", type: "number" },
            { name: "estimatedDeliveryHours", label: "Estimated Hours", type: "number" },
            { name: "freeDeliveryThreshold", label: "Free Delivery Threshold", type: "number" },
            { name: "deliveryPartnerName", label: "Partner Name", type: "text" },
            { name: "deliveryPartnerPhone", label: "Partner Phone", type: "text" },
            { name: "isActive", label: "Active", type: "checkbox" }
          ]}
          columns={[
            { key: "name", title: "Name", render: (row) => row.name },
            { key: "code", title: "Code", render: (row) => row.code },
            { key: "fee", title: "Base Fee", render: (row) => `RWF ${row.base_fee}` }
          ]}
        />

        <CrudSection
          title="Shipping Rules"
          endpoint="/shipping/rules"
          queryKey={["shipping-rules"]}
          defaultValues={{
            deliveryZoneId: zoneOptions[0]?.value ?? "",
            freeShipping: false,
            isActive: true
          }}
          fields={[
            {
              name: "deliveryZoneId",
              label: "Delivery Zone",
              type: "select",
              options: zoneOptions
            },
            { name: "ruleName", label: "Rule Name", type: "text" },
            { name: "minOrderAmount", label: "Min Order Amount", type: "number" },
            { name: "maxOrderAmount", label: "Max Order Amount", type: "number" },
            { name: "shippingFee", label: "Shipping Fee", type: "number" },
            { name: "freeShipping", label: "Free Shipping", type: "checkbox" },
            { name: "isActive", label: "Active", type: "checkbox" }
          ]}
          columns={[
            { key: "name", title: "Rule", render: (row) => row.rule_name },
            {
              key: "zone",
              title: "Zone",
              render: (row) => zoneNameById.get(String(row.delivery_zone_id)) ?? row.delivery_zone_id
            },
            { key: "fee", title: "Fee", render: (row) => `RWF ${row.shipping_fee}` }
          ]}
        />
      </div>

      <div className="grid-two">
        <div className="card stack-sm">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <MapPinned size={18} />
              </span>
              Zone Coverage
            </h3>
          </div>
          <p>Delivery zones control what the storefront checkout shows for fees and serviceable regions.</p>
        </div>
        <div className="card stack-sm">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <ScrollText size={18} />
              </span>
              Delivery Rules
            </h3>
          </div>
          <p>Shipping rules drive free delivery thresholds and price conditions visible to customers.</p>
        </div>
      </div>
    </div>
  );
};
