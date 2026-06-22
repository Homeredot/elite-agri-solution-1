import { Globe2, MessageCircle, Palette, Search, Settings2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["settings-overview"],
    queryFn: () => api.get<{ data: any }>("/settings/overview")
  });

  const [websiteName, setWebsiteName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("RWF");
  const [currencySymbol, setCurrencySymbol] = useState("FRw");
  const [timezone, setTimezone] = useState("Africa/Kigali");
  const [themeMode, setThemeMode] = useState("system");
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [secondaryColor, setSecondaryColor] = useState("#f97316");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappSaved, setWhatsappSaved] = useState(false);
  const [websiteSaved, setWebsiteSaved] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  // Pre-fill settings from loaded settings
  useEffect(() => {
    const ws = query.data?.data?.websiteSettings;
    const ts = query.data?.data?.themeSettings;
    if (ws) {
      if (ws.website_name) setWebsiteName(ws.website_name);
      if (ws.currency_code) setCurrencyCode(ws.currency_code);
      if (ws.currency_symbol) setCurrencySymbol(ws.currency_symbol);
      if (ws.timezone) setTimezone(ws.timezone);
      if (ws.whatsapp_number) setWhatsappNumber(ws.whatsapp_number);
    }
    if (ts) {
      if (ts.theme_mode) setThemeMode(ts.theme_mode);
      if (ts.primary_color) setPrimaryColor(ts.primary_color);
      if (ts.secondary_color) setSecondaryColor(ts.secondary_color);
    }
  }, [query.data]);

  const websiteMutation = useMutation({
    mutationFn: () =>
      api.put("/settings/website", {
        websiteName,
        currencyCode,
        currencySymbol,
        timezone,
        taxPercent: query.data?.data?.websiteSettings?.tax_percent ?? 0,
        languageCode: query.data?.data?.websiteSettings?.language_code ?? "en",
        maintenanceMode: Boolean(query.data?.data?.websiteSettings?.maintenance_mode),
        whatsappNumber: whatsappNumber || null
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings-overview"] });
      setWebsiteSaved(true);
      setTimeout(() => setWebsiteSaved(false), 2500);
    }
  });

  const themeMutation = useMutation({
    mutationFn: () =>
      api.put("/settings/theme", {
        themeMode,
        primaryColor,
        secondaryColor,
        buttonColor: primaryColor,
        textColor: "#0f172a",
        backgroundColor: "#f8fafc",
        glassmorphismEnabled: true
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings-overview"] });
      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2500);
    }
  });

  const whatsappMutation = useMutation({
    mutationFn: () =>
      api.put("/settings/website", {
        websiteName: websiteName || "Store",
        currencyCode,
        currencySymbol,
        timezone,
        taxPercent: query.data?.data?.websiteSettings?.tax_percent ?? 0,
        languageCode: query.data?.data?.websiteSettings?.language_code || "en",
        maintenanceMode: Boolean(query.data?.data?.websiteSettings?.maintenance_mode),
        whatsappNumber: whatsappNumber || null
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings-overview"] });
      setWhatsappSaved(true);
      setTimeout(() => setWhatsappSaved(false), 2500);
    }
  });

  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">System Settings</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <Settings2 size={20} />
            </span>
            Configure branding, currency, timezone, SEO, maintenance, and payment method setup
          </h2>
        </div>
      </div>

      {/* ── WhatsApp Widget Settings ── */}
      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <MessageCircle size={18} />
            </span>
            WhatsApp Widget
          </h3>
          <p style={{ marginTop: 4, fontSize: "0.875rem", color: "var(--muted, #666)" }}>
            Enter your WhatsApp number in international format (e.g.&nbsp;<code>+250788000000</code>). The widget
            will appear on the Home and Catalog pages, and a product-specific "Ask on WhatsApp" button will appear
            on product pages. Leave blank to hide the widget.
          </p>
        </div>
        <label className="field">
          <span>WhatsApp Number</span>
          <input
            id="whatsapp-number-input"
            type="tel"
            placeholder="+250788000000"
            value={whatsappNumber}
            onChange={(event) => setWhatsappNumber(event.target.value)}
          />
        </label>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Button
            onClick={() => whatsappMutation.mutate()}
            disabled={whatsappMutation.isPending}
          >
            {whatsappMutation.isPending ? "Saving…" : "Save WhatsApp Number"}
          </Button>
          {whatsappSaved && (
            <span style={{ color: "#16a34a", fontSize: "0.875rem", fontWeight: 600 }}>
              ✓ Saved!
            </span>
          )}
        </div>
        {whatsappNumber && (
          <p style={{ marginTop: 6, fontSize: "0.8rem", color: "var(--muted, #666)" }}>
            Preview link:{" "}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#25D366", fontWeight: 600 }}
            >
              wa.me/{whatsappNumber.replace(/\D/g, "")}
            </a>
          </p>
        )}
      </Card>

      <div className="grid-two">
        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Globe2 size={18} />
              </span>
              Website Settings
            </h3>
          </div>
          <label className="field">
            <span>Website Name</span>
            <input value={websiteName} onChange={(event) => setWebsiteName(event.target.value)} />
          </label>
          <label className="field">
            <span>Currency Code</span>
            <input value={currencyCode} onChange={(event) => setCurrencyCode(event.target.value)} />
          </label>
          <label className="field">
            <span>Currency Symbol</span>
            <input value={currencySymbol} onChange={(event) => setCurrencySymbol(event.target.value)} />
          </label>
          <label className="field">
            <span>Timezone</span>
            <input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button onClick={() => websiteMutation.mutate()} disabled={websiteMutation.isPending}>
              {websiteMutation.isPending ? "Saving..." : "Save Website Settings"}
            </Button>
            {websiteSaved && (
              <span style={{ color: "#16a34a", fontSize: "0.875rem", fontWeight: 600 }}>
                ✓ Saved!
              </span>
            )}
          </div>
        </Card>

        <Card className="stack-md">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Palette size={18} />
              </span>
              Theme Settings
            </h3>
          </div>
          <label className="field">
            <span>Theme Mode</span>
            <select value={themeMode} onChange={(event) => setThemeMode(event.target.value)}>
              <option value="light">light</option>
              <option value="dark">dark</option>
              <option value="system">system</option>
            </select>
          </label>
          <label className="field">
            <span>Primary Color</span>
            <input value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} />
          </label>
          <label className="field">
            <span>Secondary Color</span>
            <input value={secondaryColor} onChange={(event) => setSecondaryColor(event.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button onClick={() => themeMutation.mutate()} disabled={themeMutation.isPending}>
              {themeMutation.isPending ? "Saving..." : "Save Theme Settings"}
            </Button>
            {themeSaved && (
              <span style={{ color: "#16a34a", fontSize: "0.875rem", fontWeight: 600 }}>
                ✓ Saved!
              </span>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Search size={18} />
            </span>
            SEO Settings
          </h3>
        </div>
        <DataTable
          rows={query.data?.data.seoSettings ?? []}
          columns={[
            { key: "page", title: "Page", render: (row) => row.page_key },
            { key: "title", title: "Meta Title", render: (row) => row.meta_title || "n/a" },
            { key: "description", title: "Description", render: (row) => row.meta_description || "n/a" }
          ]}
        />
      </Card>
    </div>
  );
};
