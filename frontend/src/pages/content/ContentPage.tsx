import {
  AppWindow,
  BriefcaseBusiness,
  Camera,
  CirclePlay,
  FileText,
  HelpCircle,
  LayoutTemplate,
  Link2,
  Megaphone,
  MessageCircle,
  MessageCircleMore,
  Music4,
  MousePointerClick,
  PanelsTopLeft,
  PencilLine,
  Plus,
  Quote,
  Share2,
  Trash2
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ApiError, api, resolveMediaUrl } from "../../api/client";
import { DynamicForm } from "../../components/forms/DynamicForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";

type OptionCard = {
  value: string;
  label: string;
  description?: string;
  icon?: any;
};

type SortSlot = {
  sortOrder: number;
  label: string;
  isTaken: boolean;
  occupant: any | null;
};

const LEGAL_PAGE_CONFIG = [
  { pageKey: "about", title: "About Page", description: "Store story, mission, and trust content." },
  { pageKey: "terms", title: "Terms Page", description: "Terms and conditions shown to customers." },
  { pageKey: "privacy", title: "Privacy Page", description: "Privacy and customer data handling page." }
] as const;

const BANNER_FORM_FIELDS = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "subtitle", label: "Subtitle", type: "text" as const },
  { name: "imageUrl", label: "Banner Image", type: "image" as const, mediaFolder: "Hero" },
  { name: "ctaText", label: "CTA Text", type: "text" as const },
  { name: "ctaLink", label: "CTA Link", type: "text" as const },
  { name: "startsAt", label: "Starts At", type: "datetime-local" as const },
  { name: "endsAt", label: "Ends At", type: "datetime-local" as const },
  { name: "isActive", label: "Active", type: "checkbox" as const }
];

const ANNOUNCEMENT_FORM_FIELDS = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "content", label: "Content", type: "textarea" as const },
  { name: "backgroundColor", label: "Background Color", type: "text" as const },
  { name: "textColor", label: "Text Color", type: "text" as const },
  { name: "ctaText", label: "CTA Text", type: "text" as const },
  { name: "ctaLink", label: "CTA Link", type: "text" as const },
  { name: "startsAt", label: "Starts At", type: "datetime-local" as const },
  { name: "endsAt", label: "Ends At", type: "datetime-local" as const },
  { name: "isActive", label: "Active", type: "checkbox" as const }
];

const HOMEPAGE_SECTION_OPTIONS: OptionCard[] = [
  { value: "hero", label: "Hero Copy", description: "Top-of-homepage story and primary calls to action." },
  {
    value: "featured_categories",
    label: "Featured Categories",
    description: "Category block introducing the main shopping aisles."
  },
  {
    value: "featured_products",
    label: "Featured Products",
    description: "Product spotlight row for promoted catalog items."
  },
  {
    value: "promo_strip",
    label: "Promo Strip",
    description: "Mid-page promotional message block with a strong CTA."
  },
  {
    value: "seasonal_story",
    label: "Seasonal Story",
    description: "Campaign story panel for new collections or seasonal drops."
  },
  {
    value: "editorial_block",
    label: "Editorial Block",
    description: "Content-led homepage section with image and narrative copy."
  }
];

const HOMEPAGE_SECTION_FORM_FIELDS = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "subtitle", label: "Subtitle", type: "text" as const },
  { name: "content", label: "Content", type: "textarea" as const },
  { name: "eyebrow", label: "Small Label", type: "text" as const },
  { name: "badgeText", label: "Badge Text", type: "text" as const },
  { name: "imageUrl", label: "Section Image", type: "image" as const, mediaFolder: "Homepage" },
  { name: "ctaText", label: "Primary Button Text", type: "text" as const },
  { name: "ctaLink", label: "Primary Button Link", type: "text" as const },
  { name: "secondaryCtaText", label: "Secondary Button Text", type: "text" as const },
  { name: "secondaryCtaLink", label: "Secondary Button Link", type: "text" as const },
  { name: "isActive", label: "Active", type: "checkbox" as const },
  { name: "showOnHomepage", label: "Show On Homepage", type: "checkbox" as const }
];

const SOCIAL_PLATFORM_OPTIONS: OptionCard[] = [
  {
    value: "Instagram",
    label: "Instagram",
    description: "Visual-first social feed for campaigns and products.",
    icon: Camera
  },
  {
    value: "Facebook",
    label: "Facebook",
    description: "Community updates and broader audience reach.",
    icon: MessageCircle
  },
  {
    value: "TikTok",
    label: "TikTok",
    description: "Short-form social campaigns and trends.",
    icon: Music4
  },
  {
    value: "WhatsApp",
    label: "WhatsApp",
    description: "Direct messaging and quick customer engagement.",
    icon: MessageCircleMore
  },
  {
    value: "YouTube",
    label: "YouTube",
    description: "Video storytelling, tutorials, and product features.",
    icon: CirclePlay
  },
  {
    value: "LinkedIn",
    label: "LinkedIn",
    description: "Company and brand-facing updates.",
    icon: BriefcaseBusiness
  }
];

const SOCIAL_LINK_FORM_FIELDS = [{ name: "url", label: "URL", type: "text" as const }, { name: "isActive", label: "Active", type: "checkbox" as const }];

const FOOTER_SECTION_OPTIONS: OptionCard[] = [
  { value: "Shop", label: "Shop", description: "Shopping shortcuts and category links." },
  { value: "Company", label: "Company", description: "About, careers, and brand information." },
  { value: "Support", label: "Support", description: "Help center, FAQ, and customer support links." },
  { value: "Policies", label: "Policies", description: "Terms, privacy, and delivery policies." }
];

const FOOTER_LINK_FORM_FIELDS = [
  { name: "label", label: "Label", type: "text" as const },
  { name: "url", label: "URL", type: "text" as const },
  { name: "isActive", label: "Active", type: "checkbox" as const }
];

const FAQ_CATEGORY_OPTIONS: OptionCard[] = [
  { value: "General", label: "General", description: "General store and shopping questions." },
  { value: "Orders", label: "Orders", description: "Order placement and tracking questions." },
  { value: "Shipping", label: "Shipping", description: "Delivery zones, timing, and shipping details." },
  { value: "Payments", label: "Payments", description: "Payment methods, billing, and coupon usage." },
  { value: "Returns", label: "Returns", description: "Returns, refunds, and exchange policy questions." }
];

const FAQ_FORM_FIELDS = [
  { name: "question", label: "Question", type: "text" as const },
  { name: "answer", label: "Answer", type: "textarea" as const },
  { name: "isActive", label: "Active", type: "checkbox" as const }
];

const LEGAL_PAGE_FORM_FIELDS = [
  { name: "title", label: "Title", type: "text" as const },
  { name: "content", label: "Content", type: "textarea" as const },
  { name: "metaTitle", label: "Meta Title", type: "text" as const },
  { name: "metaDescription", label: "Meta Description", type: "textarea" as const }
];

const EMPTY_BANNER_FORM = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaText: "",
  ctaLink: "",
  startsAt: "",
  endsAt: "",
  isActive: true
};

const EMPTY_BANNER_PLACEMENT = {
  positionCode: "homepage_hero",
  sortOrder: 0,
  ctaPosition: "bottom_left"
};

const EMPTY_ANNOUNCEMENT_FORM = {
  title: "",
  content: "",
  backgroundColor: "#0f766e",
  textColor: "#ffffff",
  ctaText: "",
  ctaLink: "",
  startsAt: "",
  endsAt: "",
  isActive: true
};

const EMPTY_SECTION_FORM = {
  title: "",
  subtitle: "",
  content: "",
  eyebrow: "",
  badgeText: "",
  imageUrl: "",
  ctaText: "",
  ctaLink: "",
  secondaryCtaText: "",
  secondaryCtaLink: "",
  isActive: true,
  showOnHomepage: true
};

const EMPTY_SECTION_SETUP = {
  sectionKey: HOMEPAGE_SECTION_OPTIONS[0].value,
  sortOrder: 0
};

const EMPTY_SOCIAL_FORM = {
  url: "",
  isActive: true
};

const EMPTY_SOCIAL_SETUP = {
  platform: SOCIAL_PLATFORM_OPTIONS[0].value,
  sortOrder: 0
};

const EMPTY_FOOTER_FORM = {
  label: "",
  url: "",
  isActive: true
};

const EMPTY_FOOTER_SETUP = {
  sectionName: FOOTER_SECTION_OPTIONS[0].value,
  sortOrder: 0
};

const EMPTY_FAQ_FORM = {
  question: "",
  answer: "",
  isActive: true
};

const EMPTY_FAQ_SETUP = {
  category: FAQ_CATEGORY_OPTIONS[0].value,
  sortOrder: 0
};

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

const formatDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateTimeLabel = (value?: string | null) => {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const toIsoDateTime = (value: unknown) => {
  if (typeof value !== "string" || !value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const getCtaPreviewClassName = (positionCode: string) => `banner-preview-cta is-${positionCode.replace(/_/g, "-")}`;

const buildSortSlots = ({
  items,
  currentId,
  maxSlots,
  filter
}: {
  items: any[];
  currentId: number | null;
  maxSlots?: number;
  filter?: (item: any) => boolean;
}): SortSlot[] => {
  const filteredItems = (filter ? items.filter(filter) : items).sort(
    (left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0)
  );
  const slotCount = maxSlots ?? Math.max(filteredItems.length + 1, 4);

  return Array.from({ length: slotCount }, (_, index) => {
    const occupant = filteredItems.find((item) => Number(item.sort_order ?? 0) === index) ?? null;
    const isTaken = Boolean(occupant && Number(occupant.id) !== currentId);

    return {
      sortOrder: index,
      label: `Spot ${index + 1}`,
      isTaken,
      occupant
    };
  });
};

const getPreferredSortOrder = (slots: SortSlot[], currentId: number | null, preferredSortOrder?: number) => {
  const preferredSlot = slots.find(
    (slot) =>
      slot.sortOrder === preferredSortOrder &&
      (!slot.occupant || Number(slot.occupant.id) === currentId)
  );

  if (preferredSlot) {
    return preferredSlot.sortOrder;
  }

  return slots.find((slot) => !slot.occupant || Number(slot.occupant.id) === currentId)?.sortOrder ?? 0;
};

const combineOptions = (baseOptions: OptionCard[], extraValues: string[]) => {
  const existingValues = new Set(baseOptions.map((option) => option.value));
  const nextOptions = [...baseOptions];

  extraValues
    .filter((value) => value && !existingValues.has(value))
    .sort((left, right) => left.localeCompare(right))
    .forEach((value) => {
      nextOptions.push({
        value,
        label: value,
        description: "Existing value from current content."
      });
    });

  return nextOptions;
};

const getSocialPlatformOption = (platform?: string | null) =>
  SOCIAL_PLATFORM_OPTIONS.find((option) => option.value === platform) ?? null;

const getSocialPlatformIcon = (platform?: string | null) => getSocialPlatformOption(platform)?.icon ?? Link2;

const SocialPlatformBadge = ({
  platform,
  compact,
  active
}: {
  platform?: string | null;
  compact?: boolean;
  active?: boolean;
}) => {
  const Icon = getSocialPlatformIcon(platform);
  const label = getSocialPlatformOption(platform)?.label ?? platform ?? "Social link";

  return (
    <span
      className={`social-icon-badge${compact ? " compact" : ""}${active ? " active" : ""}`}
      title={label}
      aria-label={label}
    >
      <Icon size={compact ? 16 : 20} />
    </span>
  );
};

const OptionCardsField = ({
  label,
  options,
  selectedValue,
  onSelect,
  meta
}: {
  label: string;
  options: OptionCard[];
  selectedValue: string;
  onSelect: (value: string) => void;
  meta?: (option: OptionCard) => { note?: string; disabled?: boolean } | undefined;
}) => (
  <div className="field">
    <span>{label}</span>
    <div className="banner-position-grid">
      {options.map((option) => {
        const details = meta?.(option);
        const isSelected = selectedValue === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            disabled={details?.disabled}
            className={`banner-position-card${isSelected ? " selected" : ""}${details?.disabled ? " occupied" : ""}`}
            onClick={() => onSelect(option.value)}
          >
            {Icon ? (
              <span className="option-card-icon">
                <Icon size={20} />
              </span>
            ) : null}
            <strong>{option.label}</strong>
            <span>{option.description || "Choose this option."}</span>
            {details?.note ? <small>{details.note}</small> : null}
          </button>
        );
      })}
    </div>
  </div>
);

const SortSlotsField = ({
  label,
  description,
  slots,
  selectedSortOrder,
  currentId,
  onSelect
}: {
  label: string;
  description?: string;
  slots: SortSlot[];
  selectedSortOrder: number;
  currentId: number | null;
  onSelect: (sortOrder: number) => void;
}) => (
  <div className="field">
    <div className="banner-slot-header">
      <span>{label}</span>
      {description ? <strong>{description}</strong> : null}
    </div>
    <div className="banner-slot-grid">
      {slots.map((slot) => {
        const occupiedByCurrent = Boolean(slot.occupant && Number(slot.occupant.id) === currentId);
        const isSelected = selectedSortOrder === slot.sortOrder;

        return (
          <button
            key={slot.sortOrder}
            type="button"
            disabled={slot.isTaken}
            className={`banner-slot-card${isSelected ? " selected" : ""}${slot.isTaken ? " occupied" : ""}`}
            onClick={() => onSelect(slot.sortOrder)}
          >
            <strong>{slot.label}</strong>
            <span>
              {occupiedByCurrent
                ? "Current item"
                : slot.isTaken
                  ? slot.occupant?.title || slot.occupant?.label || slot.occupant?.platform || "Taken"
                  : "Available"}
            </span>
            <small>{slot.isTaken ? "Choose another spot" : "Ready for use"}</small>
          </button>
        );
      })}
    </div>
  </div>
);

const BannerManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_BANNER_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_BANNER_FORM);
  const [placement, setPlacement] = useState(EMPTY_BANNER_PLACEMENT);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const bannersQuery = useQuery({
    queryKey: ["content-banners"],
    queryFn: () => api.get<{ data: any[] }>("/content/banners")
  });

  const bannerLayoutQuery = useQuery({
    queryKey: ["content-banner-layout"],
    queryFn: () =>
      api.get<{
        positions: Array<{
          code: string;
          label: string;
          description: string;
          maxSlots: number;
          slots: Array<{
            sortOrder: number;
            label: string;
            isTaken: boolean;
            banner: null | {
              id: number;
              title: string | null;
              isActive: boolean;
              startsAt: string | null;
              endsAt: string | null;
            };
          }>;
        }>;
        ctaPositions: Array<{ code: string; label: string; description: string }>;
      }>("/content/banners/layout")
  });

  const positions = bannerLayoutQuery.data?.positions ?? [];
  const ctaPositions = bannerLayoutQuery.data?.ctaPositions ?? [];
  const selectedPosition = positions.find((position) => position.code === placement.positionCode) ?? positions[0];
  const selectedSlot = selectedPosition?.slots.find((slot) => slot.sortOrder === placement.sortOrder) ?? null;

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/banners/${editingId}`, payload) : api.post("/content/banners", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-banners"] });
      await queryClient.invalidateQueries({ queryKey: ["content-banner-layout"] });
      setFormSuccess(editingId ? "Banner updated." : "Banner created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setPlacement(EMPTY_BANNER_PLACEMENT);
      setFormDefaults(EMPTY_BANNER_FORM);
      setFormSnapshot(EMPTY_BANNER_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save banner");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (bannerId: number) => api.delete(`/content/banners/${bannerId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-banners"] });
      await queryClient.invalidateQueries({ queryKey: ["content-banner-layout"] });
      setFormSuccess("Banner deleted.");
      setFormError(null);
      if (editingId) {
        setIsEditorOpen(false);
        setEditingId(null);
        setPlacement(EMPTY_BANNER_PLACEMENT);
        setFormDefaults(EMPTY_BANNER_FORM);
        setFormSnapshot(EMPTY_BANNER_FORM);
      }
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete banner");
    }
  });

  const resetBannerForm = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setPlacement(EMPTY_BANNER_PLACEMENT);
    setFormDefaults(EMPTY_BANNER_FORM);
    setFormSnapshot(EMPTY_BANNER_FORM);
  };

  const handleEdit = (row: any) => {
    setIsEditorOpen(true);
    setEditingId(Number(row.id));
    setFormError(null);
    setFormSuccess(null);
    setFormDefaults({
      title: row.title ?? "",
      subtitle: row.subtitle ?? "",
      imageUrl: row.image_url ?? "",
      ctaText: row.cta_text ?? "",
      ctaLink: row.cta_link ?? "",
      startsAt: formatDateTimeInputValue(row.starts_at),
      endsAt: formatDateTimeInputValue(row.ends_at),
      isActive: Boolean(row.is_active)
    });
    setFormSnapshot({
      title: row.title ?? "",
      subtitle: row.subtitle ?? "",
      imageUrl: row.image_url ?? "",
      ctaText: row.cta_text ?? "",
      ctaLink: row.cta_link ?? "",
      startsAt: formatDateTimeInputValue(row.starts_at),
      endsAt: formatDateTimeInputValue(row.ends_at),
      isActive: Boolean(row.is_active)
    });
    setPlacement({
      positionCode: row.position_code ?? EMPTY_BANNER_PLACEMENT.positionCode,
      sortOrder: Number(row.sort_order ?? 0),
      ctaPosition: row.cta_position ?? EMPTY_BANNER_PLACEMENT.ctaPosition
    });
  };

  const previewImageUrl =
    typeof formSnapshot.imageUrl === "string" && formSnapshot.imageUrl.trim()
      ? resolveMediaUrl(formSnapshot.imageUrl)
      : null;
  const previewTitle =
    typeof formSnapshot.title === "string" && formSnapshot.title.trim() ? formSnapshot.title : "Banner headline";
  const previewSubtitle =
    typeof formSnapshot.subtitle === "string" && formSnapshot.subtitle.trim()
      ? formSnapshot.subtitle
      : "Use the builder to place the banner in a real storefront spot.";
  const previewCtaText =
    typeof formSnapshot.ctaText === "string" && formSnapshot.ctaText.trim() ? formSnapshot.ctaText : "";

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Megaphone size={18} />
            </span>
            Banners
          </h3>
          <Button
            onClick={() => {
              setFormError(null);
              setFormSuccess(null);
              setEditingId(null);
              setPlacement(EMPTY_BANNER_PLACEMENT);
              setFormDefaults(EMPTY_BANNER_FORM);
              setFormSnapshot(EMPTY_BANNER_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Banner
          </Button>
        </div>

        <DataTable
          rows={bannersQuery.data?.data ?? []}
          columns={[
            {
              key: "banner",
              title: "Banner",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.title || "Untitled banner"}</strong>
                  <span className="field-hint">{row.subtitle || "No subtitle"}</span>
                </div>
              )
            },
            {
              key: "placement",
              title: "Placement",
              render: (row) => {
                const position = positions.find((item) => item.code === row.position_code);
                return (
                  <div className="stack-sm">
                    <strong>{position?.label || row.position_code}</strong>
                    <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span>
                  </div>
                );
              }
            },
            {
              key: "cta",
              title: "CTA",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.cta_text || "No CTA"}</strong>
                  <span className="field-hint">
                    {ctaPositions.find((item) => item.code === row.cta_position)?.label || "Bottom Left"}
                  </span>
                </div>
              )
            },
            {
              key: "window",
              title: "Schedule",
              render: (row) => (
                <div className="stack-sm">
                  <span>{formatDateTimeLabel(row.starts_at)}</span>
                  <span className="field-hint">to {formatDateTimeLabel(row.ends_at)}</span>
                </div>
              )
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span className={`banner-status-chip${row.is_active ? " active" : ""}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              )
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button variant="ghost" onClick={() => handleEdit(row)}>
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Banner" : "Create Banner"} onClose={resetBannerForm}>
        <div className="grid-two banner-builder-grid">
          <Card className="stack-md">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <PanelsTopLeft size={18} />
                </span>
                Banner Setup
              </h3>
            </div>

            <OptionCardsField
              label="Banner Area"
              options={positions.map((position) => ({
                value: position.code,
                label: position.label,
                description: position.description
              }))}
              selectedValue={placement.positionCode}
              onSelect={(positionCode) => {
                const nextPosition = positions.find((position) => position.code === positionCode);
                setPlacement((currentPlacement) => ({
                  ...currentPlacement,
                  positionCode,
                  sortOrder: getPreferredSortOrder(
                    (nextPosition?.slots ?? []).map((slot) => ({
                      sortOrder: slot.sortOrder,
                      label: slot.label,
                      isTaken: Boolean(slot.banner && slot.banner.id !== editingId),
                      occupant: slot.banner
                    })),
                    editingId,
                    currentPlacement.sortOrder
                  )
                }));
              }}
              meta={(option) => {
                const position = positions.find((item) => item.code === option.value);
                const availableCount =
                  position?.slots.filter((slot) => !slot.banner || slot.banner.id === editingId).length ?? 0;
                return { note: `${availableCount} of ${position?.maxSlots ?? 0} spots open` };
              }}
            />

            <SortSlotsField
              label="Available Spots"
              description={selectedPosition?.label}
              slots={
                (selectedPosition?.slots ?? []).map((slot) => ({
                  sortOrder: slot.sortOrder,
                  label: slot.label,
                  isTaken: Boolean(slot.banner && slot.banner.id !== editingId),
                  occupant: slot.banner
                })) as SortSlot[]
              }
              selectedSortOrder={placement.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setPlacement((currentPlacement) => ({ ...currentPlacement, sortOrder }))}
            />

            <OptionCardsField
              label="CTA Button Position"
              options={ctaPositions.map((position) => ({
                value: position.code,
                label: position.label,
                description: position.description
              }))}
              selectedValue={placement.ctaPosition}
              onSelect={(ctaPosition) => setPlacement((currentPlacement) => ({ ...currentPlacement, ctaPosition }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={BANNER_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Banner" : "Create Banner"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                if (typeof values.imageUrl !== "string" || !values.imageUrl.trim()) {
                  setFormError("Banner image is required.");
                  return;
                }

                if (!selectedPosition || !selectedSlot) {
                  setFormError("Select a banner area and spot.");
                  return;
                }

                if (selectedSlot.banner && selectedSlot.banner.id !== editingId) {
                  setFormError("Selected spot is already taken. Choose another available spot.");
                  return;
                }

                const hasCtaText = typeof values.ctaText === "string" && values.ctaText.trim().length > 0;
                const hasCtaLink = typeof values.ctaLink === "string" && values.ctaLink.trim().length > 0;

                if (hasCtaText !== hasCtaLink) {
                  setFormError("CTA text and CTA link must be filled together.");
                  return;
                }

                if (values.startsAt && values.endsAt && new Date(String(values.endsAt)) < new Date(String(values.startsAt))) {
                  setFormError("End time must be after the start time.");
                  return;
                }

                setFormError(null);

                saveMutation.mutate({
                  title: typeof values.title === "string" && values.title.trim() ? values.title.trim() : null,
                  subtitle: typeof values.subtitle === "string" && values.subtitle.trim() ? values.subtitle.trim() : null,
                  imageUrl: values.imageUrl,
                  ctaText: hasCtaText ? String(values.ctaText).trim() : null,
                  ctaLink: hasCtaLink ? String(values.ctaLink).trim() : null,
                  ctaPosition: placement.ctaPosition,
                  positionCode: selectedPosition.code,
                  sortOrder: selectedSlot.sortOrder,
                  startsAt: toIsoDateTime(values.startsAt),
                  endsAt: toIsoDateTime(values.endsAt),
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md banner-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Banner Preview
              </h3>
            </div>

            <div className="banner-preview-stage">
              {previewImageUrl ? <img src={previewImageUrl} alt={previewTitle} className="banner-preview-image" /> : null}
              <div className="banner-preview-overlay" />
              <div className="banner-preview-copy">
                <span className="eyebrow">
                  {selectedPosition?.label || "Banner position"} / Spot {(placement.sortOrder ?? 0) + 1}
                </span>
                <h4>{previewTitle}</h4>
                <p>{previewSubtitle}</p>
              </div>
              {previewCtaText ? <span className={getCtaPreviewClassName(placement.ctaPosition)}>{previewCtaText}</span> : null}
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Selected area</span>
                <strong>{selectedPosition?.label || "Not selected"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Chosen spot</span>
                <strong>{selectedSlot?.label || "No spot selected"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">CTA placement</span>
                <strong>{ctaPositions.find((item) => item.code === placement.ctaPosition)?.label || "Bottom Left"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Spot status</span>
                <strong>{selectedSlot?.banner && selectedSlot.banner.id !== editingId ? "Taken" : "Available"}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const AnnouncementsManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_ANNOUNCEMENT_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_ANNOUNCEMENT_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const announcementsQuery = useQuery({
    queryKey: ["content-announcements"],
    queryFn: () => api.get<{ data: any[] }>("/content/announcements")
  });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/announcements/${editingId}`, payload) : api.post("/content/announcements", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-announcements"] });
      setFormSuccess(editingId ? "Announcement updated." : "Announcement created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setFormDefaults(EMPTY_ANNOUNCEMENT_FORM);
      setFormSnapshot(EMPTY_ANNOUNCEMENT_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save announcement");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (announcementId: number) => api.delete(`/content/announcements/${announcementId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-announcements"] });
      setFormSuccess("Announcement deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete announcement");
    }
  });

  const resetAnnouncementForm = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setFormDefaults(EMPTY_ANNOUNCEMENT_FORM);
    setFormSnapshot(EMPTY_ANNOUNCEMENT_FORM);
  };

  const announcementBackground =
    typeof formSnapshot.backgroundColor === "string" && formSnapshot.backgroundColor.trim()
      ? formSnapshot.backgroundColor
      : "#0f766e";
  const announcementTextColor =
    typeof formSnapshot.textColor === "string" && formSnapshot.textColor.trim()
      ? formSnapshot.textColor
      : "#ffffff";

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Quote size={18} />
            </span>
            Announcements
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setFormDefaults(EMPTY_ANNOUNCEMENT_FORM);
              setFormSnapshot(EMPTY_ANNOUNCEMENT_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Announcement
          </Button>
        </div>

        <DataTable
          rows={announcementsQuery.data?.data ?? []}
          columns={[
            { key: "title", title: "Title", render: (row) => row.title },
            { key: "content", title: "Content", render: (row) => row.content },
            {
              key: "window",
              title: "Schedule",
              render: (row) => (
                <div className="stack-sm">
                  <span>{formatDateTimeLabel(row.starts_at)}</span>
                  <span className="field-hint">to {formatDateTimeLabel(row.ends_at)}</span>
                </div>
              )
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span className={`banner-status-chip${row.is_active ? " active" : ""}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              )
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setFormDefaults({
                        title: row.title ?? "",
                        content: row.content ?? "",
                        backgroundColor: row.background_color ?? "#0f766e",
                        textColor: row.text_color ?? "#ffffff",
                        ctaText: row.cta_text ?? "",
                        ctaLink: row.cta_link ?? "",
                        startsAt: formatDateTimeInputValue(row.starts_at),
                        endsAt: formatDateTimeInputValue(row.ends_at),
                        isActive: Boolean(row.is_active)
                      });
                      setFormSnapshot({
                        title: row.title ?? "",
                        content: row.content ?? "",
                        backgroundColor: row.background_color ?? "#0f766e",
                        textColor: row.text_color ?? "#ffffff",
                        ctaText: row.cta_text ?? "",
                        ctaLink: row.cta_link ?? "",
                        startsAt: formatDateTimeInputValue(row.starts_at),
                        endsAt: formatDateTimeInputValue(row.ends_at),
                        isActive: Boolean(row.is_active)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Announcement" : "Create Announcement"} onClose={resetAnnouncementForm}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            {formError ? <div className="error-banner">{formError}</div> : null}
            <DynamicForm
              fields={ANNOUNCEMENT_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Announcement" : "Create Announcement"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const hasCtaText = typeof values.ctaText === "string" && values.ctaText.trim().length > 0;
                const hasCtaLink = typeof values.ctaLink === "string" && values.ctaLink.trim().length > 0;

                if (hasCtaText !== hasCtaLink) {
                  setFormError("CTA text and CTA link must be filled together.");
                  return;
                }

                if (values.startsAt && values.endsAt && new Date(String(values.endsAt)) < new Date(String(values.startsAt))) {
                  setFormError("End time must be after the start time.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  title: values.title,
                  content: values.content,
                  backgroundColor: values.backgroundColor || null,
                  textColor: values.textColor || null,
                  ctaText: hasCtaText ? String(values.ctaText).trim() : null,
                  ctaLink: hasCtaLink ? String(values.ctaLink).trim() : null,
                  startsAt: toIsoDateTime(values.startsAt),
                  endsAt: toIsoDateTime(values.endsAt),
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Announcement Preview
              </h3>
            </div>

            <div className="announcement-preview-strip" style={{ background: announcementBackground, color: announcementTextColor }}>
              <div className="stack-sm">
                <strong>{typeof formSnapshot.title === "string" && formSnapshot.title.trim() ? formSnapshot.title : "Announcement title"}</strong>
                <span>
                  {typeof formSnapshot.content === "string" && formSnapshot.content.trim()
                    ? formSnapshot.content
                    : "This announcement preview updates while you edit the content."}
                </span>
              </div>
              {typeof formSnapshot.ctaText === "string" && formSnapshot.ctaText.trim() ? (
                <span className="content-preview-chip">{formSnapshot.ctaText}</span>
              ) : null}
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Starts</span>
                <strong>{formatDateTimeLabel(typeof formSnapshot.startsAt === "string" ? formSnapshot.startsAt : null)}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Ends</span>
                <strong>{formatDateTimeLabel(typeof formSnapshot.endsAt === "string" ? formSnapshot.endsAt : null)}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const HomepageSectionsManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_SECTION_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_SECTION_FORM);
  const [sectionSetup, setSectionSetup] = useState(EMPTY_SECTION_SETUP);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const sectionsQuery = useQuery({
    queryKey: ["content-sections"],
    queryFn: () => api.get<{ data: any[] }>("/content/homepage-sections")
  });

  const sections = sectionsQuery.data?.data ?? [];
  const sectionOptions = useMemo(
    () => combineOptions(HOMEPAGE_SECTION_OPTIONS, sections.map((section) => String(section.section_key ?? ""))),
    [sections]
  );
  const selectedSectionOption = sectionOptions.find((option) => option.value === sectionSetup.sectionKey) ?? sectionOptions[0];
  const occupiedSection = sections.find(
    (section) => section.section_key === sectionSetup.sectionKey && Number(section.id) !== editingId
  );
  const sectionSortSlots = buildSortSlots({ items: sections, currentId: editingId, maxSlots: Math.max(sections.length + 1, 6) });
  const selectedSectionSortSlot = sectionSortSlots.find((slot) => slot.sortOrder === sectionSetup.sortOrder) ?? null;

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/homepage-sections/${editingId}`, payload) : api.post("/content/homepage-sections", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-sections"] });
      setFormSuccess(editingId ? "Homepage section updated." : "Homepage section created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setSectionSetup(EMPTY_SECTION_SETUP);
      setFormDefaults(EMPTY_SECTION_FORM);
      setFormSnapshot(EMPTY_SECTION_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save homepage section");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (sectionId: number) => api.delete(`/content/homepage-sections/${sectionId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-sections"] });
      setFormSuccess("Homepage section deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete homepage section");
    }
  });

  const resetSectionForm = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setFormError(null);
    setSectionSetup(EMPTY_SECTION_SETUP);
    setFormDefaults(EMPTY_SECTION_FORM);
    setFormSnapshot(EMPTY_SECTION_FORM);
  };

  const previewSectionImage =
    typeof formSnapshot.imageUrl === "string" && formSnapshot.imageUrl.trim() ? resolveMediaUrl(formSnapshot.imageUrl) : null;

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <LayoutTemplate size={18} />
            </span>
            Homepage Sections
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSectionSetup(EMPTY_SECTION_SETUP);
              setFormDefaults(EMPTY_SECTION_FORM);
              setFormSnapshot(EMPTY_SECTION_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Section
          </Button>
        </div>

        <DataTable
          rows={sections}
          columns={[
            {
              key: "section",
              title: "Section",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{sectionOptions.find((option) => option.value === row.section_key)?.label || row.section_key}</strong>
                  <span className="field-hint">{row.title || row.subtitle || "No headline set"}</span>
                </div>
              )
            },
            {
              key: "order",
              title: "Order",
              render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span>
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span className={`banner-status-chip${row.is_active ? " active" : ""}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              )
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const config = parseJsonObject(row.content_json);
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSectionSetup({
                        sectionKey: row.section_key ?? EMPTY_SECTION_SETUP.sectionKey,
                        sortOrder: Number(row.sort_order ?? 0)
                      });
                      setFormDefaults({
                        title: row.title ?? "",
                        subtitle: row.subtitle ?? "",
                        content: row.content ?? "",
                        eyebrow: typeof config.eyebrow === "string" ? config.eyebrow : "",
                        badgeText: typeof config.badgeText === "string" ? config.badgeText : "",
                        imageUrl: typeof config.imageUrl === "string" ? config.imageUrl : "",
                        ctaText: typeof config.ctaText === "string" ? config.ctaText : "",
                        ctaLink: typeof config.ctaLink === "string" ? config.ctaLink : "",
                        secondaryCtaText: typeof config.secondaryCtaText === "string" ? config.secondaryCtaText : "",
                        secondaryCtaLink: typeof config.secondaryCtaLink === "string" ? config.secondaryCtaLink : "",
                        isActive: Boolean(row.is_active),
                        showOnHomepage: Boolean(row.show_on_homepage)
                      });
                      setFormSnapshot({
                        title: row.title ?? "",
                        subtitle: row.subtitle ?? "",
                        content: row.content ?? "",
                        eyebrow: typeof config.eyebrow === "string" ? config.eyebrow : "",
                        badgeText: typeof config.badgeText === "string" ? config.badgeText : "",
                        imageUrl: typeof config.imageUrl === "string" ? config.imageUrl : "",
                        ctaText: typeof config.ctaText === "string" ? config.ctaText : "",
                        ctaLink: typeof config.ctaLink === "string" ? config.ctaLink : "",
                        secondaryCtaText: typeof config.secondaryCtaText === "string" ? config.secondaryCtaText : "",
                        secondaryCtaLink: typeof config.secondaryCtaLink === "string" ? config.secondaryCtaLink : "",
                        isActive: Boolean(row.is_active),
                        showOnHomepage: Boolean(row.show_on_homepage)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Homepage Section" : "Create Homepage Section"} onClose={resetSectionForm}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="Section Spot"
              options={sectionOptions}
              selectedValue={sectionSetup.sectionKey}
              onSelect={(sectionKey) => setSectionSetup((current) => ({ ...current, sectionKey }))}
              meta={(option) => {
                const occupant = sections.find(
                  (section) => section.section_key === option.value && Number(section.id) !== editingId
                );
                return occupant ? { note: `Already used by ${occupant.title || option.label}`, disabled: true } : undefined;
              }}
            />

            <SortSlotsField
              label="Homepage Order"
              description="Choose where this block sits in the homepage flow."
              slots={sectionSortSlots}
              selectedSortOrder={sectionSetup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSectionSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={HOMEPAGE_SECTION_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Section" : "Create Section"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                if (occupiedSection) {
                  setFormError("Selected section spot is already used. Choose another spot.");
                  return;
                }

                if (selectedSectionSortSlot?.occupant && Number(selectedSectionSortSlot.occupant.id) !== editingId) {
                  setFormError("Selected homepage order spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  sectionKey: sectionSetup.sectionKey,
                  title: values.title || null,
                  subtitle: values.subtitle || null,
                  content: values.content || null,
                  sortOrder: sectionSetup.sortOrder,
                  isActive: Boolean(values.isActive),
                  showOnHomepage: Boolean(values.showOnHomepage),
                  contentJson: Object.fromEntries(
                    Object.entries({
                      eyebrow: values.eyebrow,
                      badgeText: values.badgeText,
                      imageUrl: values.imageUrl,
                      ctaText: values.ctaText,
                      ctaLink: values.ctaLink,
                      secondaryCtaText: values.secondaryCtaText,
                      secondaryCtaLink: values.secondaryCtaLink
                    }).filter(([, value]) => typeof value === "string" && value.trim())
                  )
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Section Preview
              </h3>
            </div>

            <div className="content-preview-stage">
              {previewSectionImage ? <img src={previewSectionImage} alt={String(formSnapshot.title || selectedSectionOption?.label || "Section")} className="content-preview-image" /> : null}
              <div className="content-preview-copy">
                <span className="eyebrow">
                  {typeof formSnapshot.eyebrow === "string" && formSnapshot.eyebrow.trim()
                    ? formSnapshot.eyebrow
                    : selectedSectionOption?.label || "Homepage section"}
                </span>
                <h4>
                  {typeof formSnapshot.title === "string" && formSnapshot.title.trim()
                    ? formSnapshot.title
                    : "Homepage section title"}
                </h4>
                <p>
                  {typeof formSnapshot.subtitle === "string" && formSnapshot.subtitle.trim()
                    ? formSnapshot.subtitle
                    : typeof formSnapshot.content === "string" && formSnapshot.content.trim()
                      ? formSnapshot.content
                      : "Preview the way this section will read before publishing it."}
                </p>
                <div className="content-preview-actions">
                  {typeof formSnapshot.ctaText === "string" && formSnapshot.ctaText.trim() ? (
                    <span className="content-preview-chip">{formSnapshot.ctaText}</span>
                  ) : null}
                  {typeof formSnapshot.secondaryCtaText === "string" && formSnapshot.secondaryCtaText.trim() ? (
                    <span className="content-preview-chip secondary">{formSnapshot.secondaryCtaText}</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Section type</span>
                <strong>{selectedSectionOption?.label || "Not selected"}</strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Order spot</span>
                <strong>Spot {sectionSetup.sortOrder + 1}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const SocialLinksManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_SOCIAL_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_SOCIAL_FORM);
  const [setup, setSetup] = useState(EMPTY_SOCIAL_SETUP);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const socialLinksQuery = useQuery({
    queryKey: ["content-social-links"],
    queryFn: () => api.get<{ data: any[] }>("/content/social-links")
  });

  const socialLinks = socialLinksQuery.data?.data ?? [];
  const socialOptions = useMemo(
    () =>
      combineOptions(SOCIAL_PLATFORM_OPTIONS, socialLinks.map((link) => String(link.platform ?? ""))).map((option) => ({
        ...option,
        icon: option.icon ?? getSocialPlatformIcon(option.value)
      })),
    [socialLinks]
  );
  const socialSortSlots = buildSortSlots({ items: socialLinks, currentId: editingId, maxSlots: Math.max(socialLinks.length + 1, 6) });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/social-links/${editingId}`, payload) : api.post("/content/social-links", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-social-links"] });
      setFormSuccess(editingId ? "Social link updated." : "Social link created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setSetup(EMPTY_SOCIAL_SETUP);
      setFormDefaults(EMPTY_SOCIAL_FORM);
      setFormSnapshot(EMPTY_SOCIAL_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save social link");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (linkId: number) => api.delete(`/content/social-links/${linkId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-social-links"] });
      setFormSuccess("Social link deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete social link");
    }
  });

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Share2 size={18} />
            </span>
            Social Links
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSetup(EMPTY_SOCIAL_SETUP);
              setFormDefaults(EMPTY_SOCIAL_FORM);
              setFormSnapshot(EMPTY_SOCIAL_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Social Link
          </Button>
        </div>

        <DataTable
          rows={socialLinks}
          columns={[
            {
              key: "platform",
              title: "Platform",
              render: (row) => <SocialPlatformBadge platform={row.platform} compact />
            },
            { key: "url", title: "URL", render: (row) => row.url },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <span className={`banner-status-chip${row.is_active ? " active" : ""}`}>
                  {row.is_active ? "Active" : "Inactive"}
                </span>
              )
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSetup({
                        platform: row.platform ?? EMPTY_SOCIAL_SETUP.platform,
                        sortOrder: Number(row.sort_order ?? 0)
                      });
                      setFormDefaults({
                        url: row.url ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setFormSnapshot({
                        url: row.url ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Social Link" : "Create Social Link"} onClose={() => setIsEditorOpen(false)}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="Platform"
              options={socialOptions}
              selectedValue={setup.platform}
              onSelect={(platform) => setSetup((current) => ({ ...current, platform }))}
            />

            <SortSlotsField
              label="Social Order"
              description="Choose the display order in the social links row."
              slots={socialSortSlots}
              selectedSortOrder={setup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={SOCIAL_LINK_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Social Link" : "Create Social Link"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = socialSortSlots.find((item) => item.sortOrder === setup.sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected social order spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  platform: setup.platform,
                  url: values.url,
                  icon: setup.platform,
                  sortOrder: setup.sortOrder,
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Social Preview
              </h3>
            </div>
            <div className="social-preview-row">
              {socialLinks
                .filter((link) => Number(link.id) !== editingId)
                .map((link) => ({ platform: link.platform, sortOrder: Number(link.sort_order ?? 0), isCurrent: false }))
                .concat([{ platform: setup.platform, sortOrder: setup.sortOrder, isCurrent: true }])
                .sort((left, right) => left.sortOrder - right.sortOrder)
                .map((item, index) => (
                  <span
                    key={`${item.platform}-${index}`}
                    className={`social-preview-chip${item.isCurrent ? " active" : ""}`}
                    title={getSocialPlatformOption(item.platform)?.label ?? item.platform ?? "Social link"}
                    aria-label={getSocialPlatformOption(item.platform)?.label ?? item.platform ?? "Social link"}
                  >
                    <SocialPlatformBadge platform={item.platform} active={item.isCurrent} />
                  </span>
                ))}
            </div>

            <div className="banner-preview-meta">
              <div className="banner-meta-card">
                <span className="field-hint">Selected platform</span>
                <strong className="social-meta-value">
                  <SocialPlatformBadge platform={setup.platform} />
                </strong>
              </div>
              <div className="banner-meta-card">
                <span className="field-hint">Order spot</span>
                <strong>Spot {setup.sortOrder + 1}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const FooterLinksManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_FOOTER_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_FOOTER_FORM);
  const [setup, setSetup] = useState(EMPTY_FOOTER_SETUP);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const footerLinksQuery = useQuery({
    queryKey: ["content-footer-links"],
    queryFn: () => api.get<{ data: any[] }>("/content/footer-links")
  });

  const footerLinks = footerLinksQuery.data?.data ?? [];
  const footerOptions = useMemo(
    () => combineOptions(FOOTER_SECTION_OPTIONS, footerLinks.map((link) => String(link.section_name ?? ""))),
    [footerLinks]
  );
  const footerSortSlots = buildSortSlots({
    items: footerLinks,
    currentId: editingId,
    maxSlots: Math.max(footerLinks.filter((link) => (link.section_name ?? "") === setup.sectionName).length + 1, 4),
    filter: (link) => (link.section_name ?? "") === setup.sectionName
  });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/footer-links/${editingId}`, payload) : api.post("/content/footer-links", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-footer-links"] });
      setFormSuccess(editingId ? "Footer link updated." : "Footer link created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setSetup(EMPTY_FOOTER_SETUP);
      setFormDefaults(EMPTY_FOOTER_FORM);
      setFormSnapshot(EMPTY_FOOTER_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save footer link");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (linkId: number) => api.delete(`/content/footer-links/${linkId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-footer-links"] });
      setFormSuccess("Footer link deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete footer link");
    }
  });

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <Link2 size={18} />
            </span>
            Footer Links
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSetup(EMPTY_FOOTER_SETUP);
              setFormDefaults(EMPTY_FOOTER_FORM);
              setFormSnapshot(EMPTY_FOOTER_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create Footer Link
          </Button>
        </div>

        <DataTable
          rows={footerLinks}
          columns={[
            { key: "section", title: "Section", render: (row) => row.section_name },
            { key: "label", title: "Label", render: (row) => row.label },
            { key: "url", title: "URL", render: (row) => row.url },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSetup({
                        sectionName: row.section_name ?? EMPTY_FOOTER_SETUP.sectionName,
                        sortOrder: Number(row.sort_order ?? 0)
                      });
                      setFormDefaults({
                        label: row.label ?? "",
                        url: row.url ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setFormSnapshot({
                        label: row.label ?? "",
                        url: row.url ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit Footer Link" : "Create Footer Link"} onClose={() => setIsEditorOpen(false)}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="Footer Section"
              options={footerOptions}
              selectedValue={setup.sectionName}
              onSelect={(sectionName) =>
                setSetup((current) => ({
                  ...current,
                  sectionName,
                  sortOrder: getPreferredSortOrder(
                    buildSortSlots({
                      items: footerLinks,
                      currentId: editingId,
                      maxSlots: Math.max(footerLinks.filter((link) => (link.section_name ?? "") === sectionName).length + 1, 4),
                      filter: (link) => (link.section_name ?? "") === sectionName
                    }),
                    editingId,
                    current.sortOrder
                  )
                }))
              }
            />

            <SortSlotsField
              label="Section Order"
              description={setup.sectionName}
              slots={footerSortSlots}
              selectedSortOrder={setup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={FOOTER_LINK_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update Footer Link" : "Create Footer Link"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = footerSortSlots.find((item) => item.sortOrder === setup.sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected footer link spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  sectionName: setup.sectionName,
                  label: values.label,
                  url: values.url,
                  sortOrder: setup.sortOrder,
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Footer Preview
              </h3>
            </div>
            <div className="stack-md">
              <strong>{setup.sectionName}</strong>
              <div className="content-chip-row">
                {footerLinks
                  .filter((link) => (link.section_name ?? "") === setup.sectionName && Number(link.id) !== editingId)
                  .map((link) => ({ label: link.label, sortOrder: Number(link.sort_order ?? 0), isCurrent: false }))
                  .concat([
                    {
                      label:
                        typeof formSnapshot.label === "string" && formSnapshot.label.trim()
                          ? formSnapshot.label
                          : "New footer link",
                      sortOrder: setup.sortOrder,
                      isCurrent: true
                    }
                  ])
                  .sort((left, right) => left.sortOrder - right.sortOrder)
                  .map((item, index) => (
                    <span key={`${item.label}-${index}`} className={`content-preview-chip${item.isCurrent ? " active" : ""}`}>
                      {item.label}
                    </span>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const FaqManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>(EMPTY_FAQ_FORM);
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>(EMPTY_FAQ_FORM);
  const [setup, setSetup] = useState(EMPTY_FAQ_SETUP);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const faqsQuery = useQuery({
    queryKey: ["content-faqs"],
    queryFn: () => api.get<{ data: any[] }>("/content/faqs")
  });

  const faqs = faqsQuery.data?.data ?? [];
  const faqOptions = useMemo(
    () => combineOptions(FAQ_CATEGORY_OPTIONS, faqs.map((faq) => String(faq.category || "General"))),
    [faqs]
  );
  const faqSortSlots = buildSortSlots({
    items: faqs,
    currentId: editingId,
    maxSlots: Math.max(faqs.filter((faq) => String(faq.category || "General") === setup.category).length + 1, 4),
    filter: (faq) => String(faq.category || "General") === setup.category
  });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId ? api.put(`/content/faqs/${editingId}`, payload) : api.post("/content/faqs", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-faqs"] });
      setFormSuccess(editingId ? "FAQ updated." : "FAQ created.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingId(null);
      setSetup(EMPTY_FAQ_SETUP);
      setFormDefaults(EMPTY_FAQ_FORM);
      setFormSnapshot(EMPTY_FAQ_FORM);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to save FAQ");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (faqId: number) => api.delete(`/content/faqs/${faqId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-faqs"] });
      setFormSuccess("FAQ deleted.");
      setFormError(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      setFormError(error instanceof Error ? error.message : "Failed to delete FAQ");
    }
  });

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <HelpCircle size={18} />
            </span>
            FAQs
          </h3>
          <Button
            onClick={() => {
              setFormSuccess(null);
              setFormError(null);
              setEditingId(null);
              setSetup(EMPTY_FAQ_SETUP);
              setFormDefaults(EMPTY_FAQ_FORM);
              setFormSnapshot(EMPTY_FAQ_FORM);
              setIsEditorOpen(true);
            }}
          >
            <Plus size={16} />
            Create FAQ
          </Button>
        </div>

        <DataTable
          rows={faqs}
          columns={[
            { key: "question", title: "Question", render: (row) => row.question },
            { key: "category", title: "Category", render: (row) => row.category || "General" },
            { key: "order", title: "Order", render: (row) => <span className="field-hint">Spot {Number(row.sort_order ?? 0) + 1}</span> },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(Number(row.id));
                      setFormSuccess(null);
                      setFormError(null);
                      setSetup({
                        category: row.category || "General",
                        sortOrder: Number(row.sort_order ?? 0)
                      });
                      setFormDefaults({
                        question: row.question ?? "",
                        answer: row.answer ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setFormSnapshot({
                        question: row.question ?? "",
                        answer: row.answer ?? "",
                        isActive: Boolean(row.is_active)
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(Number(row.id))}>
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingId ? "Edit FAQ" : "Create FAQ"} onClose={() => setIsEditorOpen(false)}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            <OptionCardsField
              label="FAQ Category"
              options={faqOptions}
              selectedValue={setup.category}
              onSelect={(category) =>
                setSetup((current) => ({
                  ...current,
                  category,
                  sortOrder: getPreferredSortOrder(
                    buildSortSlots({
                      items: faqs,
                      currentId: editingId,
                      maxSlots: Math.max(faqs.filter((faq) => String(faq.category || "General") === category).length + 1, 4),
                      filter: (faq) => String(faq.category || "General") === category
                    }),
                    editingId,
                    current.sortOrder
                  )
                }))
              }
            />

            <SortSlotsField
              label="Category Order"
              description={setup.category}
              slots={faqSortSlots}
              selectedSortOrder={setup.sortOrder}
              currentId={editingId}
              onSelect={(sortOrder) => setSetup((current) => ({ ...current, sortOrder }))}
            />

            {formError ? <div className="error-banner">{formError}</div> : null}

            <DynamicForm
              fields={FAQ_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={saveMutation.isPending ? "Saving..." : editingId ? "Update FAQ" : "Create FAQ"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                const slot = faqSortSlots.find((item) => item.sortOrder === setup.sortOrder);
                if (slot?.occupant && Number(slot.occupant.id) !== editingId) {
                  setFormError("Selected FAQ spot is already taken.");
                  return;
                }

                setFormError(null);
                saveMutation.mutate({
                  question: values.question,
                  answer: values.answer,
                  category: setup.category,
                  sortOrder: setup.sortOrder,
                  isActive: Boolean(values.isActive)
                });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                FAQ Preview
              </h3>
            </div>
            <div className="faq-preview-card">
              <span className="faq-category">{setup.category}</span>
              <strong>
                {typeof formSnapshot.question === "string" && formSnapshot.question.trim()
                  ? formSnapshot.question
                  : "FAQ question"}
              </strong>
              <p>
                {typeof formSnapshot.answer === "string" && formSnapshot.answer.trim()
                  ? formSnapshot.answer
                  : "The answer preview will appear here while you edit the FAQ."}
              </p>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

const LegalPagesManager = () => {
  const queryClient = useQueryClient();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPageKey, setEditingPageKey] = useState<string | null>(null);
  const [formDefaults, setFormDefaults] = useState<Record<string, unknown>>({});
  const [formSnapshot, setFormSnapshot] = useState<Record<string, unknown>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const legalPagesQuery = useQuery({
    queryKey: ["content-legal-pages"],
    queryFn: () => api.get<{ data: any[] }>("/content/legal-pages")
  });

  const legalPages = (legalPagesQuery.data?.data ?? []).reduce(
    (map, page) => {
      map[page.page_key] = page;
      return map;
    },
    {} as Record<string, any>
  );

  const mutation = useMutation({
    mutationFn: ({ pageKey, values }: { pageKey: string; values: Record<string, unknown> }) =>
      api.put(`/content/legal-pages/${pageKey}`, { ...values, pageKey }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content-legal-pages"] });
      setFormSuccess("Legal page saved.");
      setFormError(null);
      setIsEditorOpen(false);
      setEditingPageKey(null);
    },
    onError: (error) => {
      setFormSuccess(null);
      let message = "Failed to save legal page";
      if (error instanceof ApiError) {
        const details =
          error.details && typeof error.details === "object"
            ? (error.details as {
                details?: {
                  fieldErrors?: Record<string, string[] | undefined>;
                  formErrors?: string[];
                };
              })
            : null;

        const fieldMessages = details?.details?.fieldErrors
          ? Object.entries(details.details.fieldErrors)
              .map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`)
              .join("; ")
          : "";
        const formMessages = details?.details?.formErrors?.join(", ") ?? "";

        if (fieldMessages || formMessages) {
          message = `Validation failed - ${fieldMessages || formMessages}`;
        } else {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setFormError(message);
    }
  });

  const editingConfig = LEGAL_PAGE_CONFIG.find((page) => page.pageKey === editingPageKey);

  return (
    <div className="stack-lg">
      {formSuccess ? <div className="success-banner">{formSuccess}</div> : null}

      <Card className="stack-md">
        <div className="section-header">
          <h3 className="section-title">
            <span className="section-icon">
              <FileText size={18} />
            </span>
            Legal Pages
          </h3>
        </div>

        <DataTable
          rows={LEGAL_PAGE_CONFIG.map((page) => ({
            ...page,
            record: legalPages[page.pageKey] ?? null
          }))}
          columns={[
            {
              key: "page",
              title: "Page",
              render: (row) => (
                <div className="stack-sm">
                  <strong>{row.title}</strong>
                  <span className="field-hint">{row.description}</span>
                </div>
              )
            },
            {
              key: "meta",
              title: "Current Title",
              render: (row) => row.record?.title || "Not configured"
            },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFormSuccess(null);
                      setFormError(null);
                      setEditingPageKey(row.pageKey);
                      setFormDefaults({
                        title: row.record?.title || "",
                        content: row.record?.content || "",
                        metaTitle: row.record?.meta_title || "",
                        metaDescription: row.record?.meta_description || ""
                      });
                      setFormSnapshot({
                        title: row.record?.title || "",
                        content: row.record?.content || "",
                        metaTitle: row.record?.meta_title || "",
                        metaDescription: row.record?.meta_description || ""
                      });
                      setIsEditorOpen(true);
                    }}
                  >
                    <PencilLine size={16} />
                    Edit
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      <Modal open={isEditorOpen} title={editingConfig ? `Edit ${editingConfig.title}` : "Edit Legal Page"} onClose={() => setIsEditorOpen(false)}>
        <div className="grid-two content-manager-grid">
          <Card className="stack-md">
            {formError ? <div className="error-banner">{formError}</div> : null}
            <DynamicForm
              fields={LEGAL_PAGE_FORM_FIELDS}
              defaultValues={formDefaults}
              submitLabel={mutation.isPending ? "Saving..." : "Save page"}
              onValuesChange={(values) => setFormSnapshot(values)}
              onSubmit={async (values) => {
                if (!editingPageKey) {
                  return;
                }

                mutation.mutate({ pageKey: editingPageKey, values });
              }}
            />
          </Card>

          <Card className="stack-md content-preview-card">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">
                  <MousePointerClick size={18} />
                </span>
                Page Preview
              </h3>
            </div>
            <div className="faq-preview-card">
              <strong>
                {typeof formSnapshot.title === "string" && formSnapshot.title.trim()
                  ? formSnapshot.title
                  : editingConfig?.title || "Page title"}
              </strong>
              <p>
                {typeof formSnapshot.content === "string" && formSnapshot.content.trim()
                  ? formSnapshot.content
                  : "The body copy preview will appear here while you edit the legal page."}
              </p>
              <div className="stack-sm">
                <span className="field-hint">Meta Title</span>
                <strong>{typeof formSnapshot.metaTitle === "string" && formSnapshot.metaTitle.trim() ? formSnapshot.metaTitle : "Not set"}</strong>
              </div>
            </div>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export const ContentPage = () => {
  return (
    <div className="page stack-lg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Content & Branding</p>
          <h2 className="title-with-icon">
            <span className="title-icon">
              <AppWindow size={20} />
            </span>
            Control banners, homepage sections, announcements, links, FAQs, and legal content
          </h2>
        </div>
      </div>

      <BannerManager />

      <div className="grid-two">
        <AnnouncementsManager />
        <HomepageSectionsManager />
      </div>

      <div className="grid-two">
        <SocialLinksManager />
        <FooterLinksManager />
      </div>

      <div className="grid-two">
        <FaqManager />
        <LegalPagesManager />
      </div>

      <div className="grid-two">
        <div className="card stack-sm">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <Megaphone size={18} />
              </span>
              Content Areas
            </h3>
          </div>
          <p>Every content section now opens only when clicked, with previews and structured placement choices instead of raw form fields.</p>
        </div>
        <div className="card stack-sm">
          <div className="section-header">
            <h3 className="section-title">
              <span className="section-icon">
                <LayoutTemplate size={18} />
              </span>
              Homepage Layout
            </h3>
          </div>
          <p>Ordering, visibility, and section selection now follow the same clearer flow used for banner creation and editing.</p>
        </div>
      </div>
    </div>
  );
};
