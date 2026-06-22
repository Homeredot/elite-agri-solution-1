import { ArrowRight, LayoutGrid, Leaf, ShieldCheck, Sparkles, Store, Tag, Truck, WalletCards, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { resolveCategoryIcon } from "../utils/category-icons";
import { handleStoreImageError, resolveStoreImage } from "../utils/media";
import { ProductCard } from "../components/shop/ProductCard";

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

const normalizePath = (value: string) => (value.startsWith("/") ? value : `/${value}`);
const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

export const HomePage = () => {
  const [dismissedAnnouncementIds, setDismissedAnnouncementIds] = useState<number[]>([]);
  const homeQuery = useQuery({
    queryKey: ["store-home"],
    queryFn: () => api.get<{ data: any }>("/store/home")
  });

  const data = homeQuery.data?.data;
  const sections = data?.sections || [];
  const sectionsByKey = sections.reduce(
    (acc: Record<string, any>, section: any) => {
      acc[section.section_key] = section;
      return acc;
    },
    {}
  );
  const heroSection = sectionsByKey.hero;
  const categoriesSection = sectionsByKey.featured_categories;
  const productsSection = sectionsByKey.featured_products;
  const promoSection = sectionsByKey.promo_strip;
  const extraSections = sections.filter(
    (section: any) => !["hero", "featured_categories", "featured_products", "promo_strip"].includes(section.section_key)
  );
  const heroConfig = parseJsonObject(heroSection?.content_json);
  const promoConfig = parseJsonObject(promoSection?.content_json);
  const productsConfig = parseJsonObject(productsSection?.content_json);
  const visibleAnnouncements = (data?.announcements || []).filter(
    (item: any) => !dismissedAnnouncementIds.includes(Number(item.id))
  );

  return (
    <div className="page-stack">
      <section className="hero-panel hero-panel--minimal">
        <div className="hero-copy hero-copy--minimal">
          <p className="hero-kicker">
            {(typeof heroConfig.eyebrow === "string" && heroConfig.eyebrow) || heroSection?.title || "Welcome to our store"}
          </p>
          <h1>
            {heroSection?.subtitle || "Offers a 50% discount on your first order"}
          </h1>
          <p className="hero-summary">
            {heroSection?.content || "Shop fresh produce, household essentials, and top picks curated for you."}
          </p>
          <div className="hero-actions hero-actions--left">
            <Link
              to={
                typeof heroConfig.ctaLink === "string" && heroConfig.ctaLink.trim()
                  ? normalizePath(heroConfig.ctaLink)
                  : "/catalog"
              }
              className="primary-btn"
            >
              <ArrowRight size={16} />
              {(typeof heroConfig.ctaText === "string" && heroConfig.ctaText) || "Start Shopping"}
            </Link>
            <Link
              to={
                typeof heroConfig.secondaryCtaLink === "string" && heroConfig.secondaryCtaLink.trim()
                  ? normalizePath(heroConfig.secondaryCtaLink)
                  : "/catalog?sort=popular"
              }
              className="secondary-btn"
            >
              <Sparkles size={16} />
              {(typeof heroConfig.secondaryCtaText === "string" && heroConfig.secondaryCtaText) || "Popular Picks"}
            </Link>
          </div>
        </div>
      </section>

      {visibleAnnouncements.length ? (
        <section className="announcement-strip glass">
          {visibleAnnouncements.map((item: any) => {
            const announcementStyle = {
              background: item.background_color || "linear-gradient(135deg, #1f3b2d, #345c43)",
              color: item.text_color || "#ffffff"
            };
            const ctaLink = typeof item.cta_link === "string" ? item.cta_link.trim() : "";
            const ctaLabel = typeof item.cta_text === "string" ? item.cta_text.trim() : "";
            const closeAnnouncement = () =>
              setDismissedAnnouncementIds((currentIds) => [...currentIds, Number(item.id)]);

            return (
              <article key={item.id} className="announcement-card" style={announcementStyle}>
                <div className="announcement-content">
                  <span className="announcement-badge">Announcement</span>
                  <div className="announcement-copy">
                    <strong>{item.title}</strong>
                    <p>{item.content}</p>
                  </div>
                </div>
                <div className="announcement-actions">
                  {ctaLabel && ctaLink ? (
                    isExternalUrl(ctaLink) ? (
                      <a
                        href={ctaLink}
                        className="announcement-cta"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{ctaLabel}</span>
                        <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link to={normalizePath(ctaLink)} className="announcement-cta">
                        <span>{ctaLabel}</span>
                        <ArrowRight size={16} />
                      </Link>
                    )
                  ) : null}
                  <button type="button" className="announcement-close" onClick={closeAnnouncement} aria-label="Close announcement">
                    <X size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{categoriesSection?.title || "Categories"}</p>
            <h2 className="title-with-icon">
              <span className="title-icon">
                <LayoutGrid size={20} />
              </span>
              {categoriesSection?.subtitle || "Shop by aisle"}
            </h2>
            {categoriesSection?.content ? <p>{categoriesSection.content}</p> : null}
          </div>
          <Link to="/catalog" className="primary-btn">
            View all
          </Link>
        </div>
          <div className="category-grid category-scroll-row">
          {(data?.featuredCategories || []).map((category: any) => {
            const Icon = resolveCategoryIcon(category.icon);
            const imageUrl = category.image_url || category.imageUrl;

            return (
              <Link key={category.id} to={`/catalog?categoryId=${category.id}`} className="category-card glass">
                <div className="category-image-wrap">
                  <img
                    src={resolveStoreImage(imageUrl, category.name, "#E8F0D8")}
                    alt={category.name}
                    onError={(event) => handleStoreImageError(event, category.name, "#E8F0D8")}
                  />
                  {Icon ? (
                    <span className="category-icon-badge">
                      <Icon size={18} />
                    </span>
                  ) : null}
                </div>
                <strong>{category.name}</strong>
              </Link>
            );
          })}
        </div>
      </section>

      {promoSection ? (
        <section className="desktop-feature-band">
          <article className="glass desktop-feature-panel">
            <p className="eyebrow">
              {(typeof promoConfig.eyebrow === "string" && promoConfig.eyebrow) || promoSection.title || "Promotion"}
            </p>
            <h2>{promoSection.subtitle || "Homepage promotion"}</h2>
            <p>{promoSection.content || "Manage promotional strips and supporting content from admin."}</p>
            <Link
              to={
                typeof promoConfig.ctaLink === "string" && promoConfig.ctaLink.trim()
                  ? normalizePath(promoConfig.ctaLink)
                  : "/catalog?discounted=1"
              }
              className="primary-btn"
            >
              <ArrowRight size={16} />
              {(typeof promoConfig.ctaText === "string" && promoConfig.ctaText) || "View current offers"}
            </Link>
          </article>
          <article className="glass desktop-feature-panel secondary">
            <p className="eyebrow">
              {(typeof productsConfig.eyebrow === "string" && productsConfig.eyebrow) || productsSection?.title || "Featured products"}
            </p>
            <h2>{productsSection?.subtitle || "Best sellers and new arrivals"}</h2>
            <p>{productsSection?.content || "Featured product rows stay aligned with what the admin team marks as featured, best seller, or discounted."}</p>
            <Link
              to={
                typeof productsConfig.ctaLink === "string" && productsConfig.ctaLink.trim()
                  ? normalizePath(productsConfig.ctaLink)
                  : "/catalog"
              }
              className="secondary-btn"
            >
              <Tag size={16} />
              {(typeof productsConfig.ctaText === "string" && productsConfig.ctaText) || "Browse catalog"}
            </Link>
          </article>
        </section>
      ) : null}

      {extraSections.length ? (
        <section className="dynamic-home-sections">
          {extraSections.map((section: any) => {
            const config = parseJsonObject(section.content_json);

            return (
              <article key={section.id} className="glass dynamic-home-card">
                {typeof config.imageUrl === "string" && config.imageUrl ? (
                  <img
                    src={resolveStoreImage(config.imageUrl, section.title || section.section_key, "#E8F0D8")}
                    alt={section.title || section.section_key}
                    onError={(event) =>
                      handleStoreImageError(event, section.title || section.section_key, "#E8F0D8")
                    }
                  />
                ) : null}
                <p className="eyebrow">
                  {(typeof config.eyebrow === "string" && config.eyebrow) || section.title || section.section_key}
                </p>
                <h2>{section.subtitle || "Homepage section"}</h2>
                <p>{section.content || "This section is managed from the admin content area."}</p>
                {typeof config.badgeText === "string" && config.badgeText ? (
                  <span className="faq-category">{config.badgeText}</span>
                ) : null}
                {typeof config.ctaText === "string" && config.ctaText && typeof config.ctaLink === "string" && config.ctaLink ? (
                  <Link to={normalizePath(config.ctaLink)} className="primary-btn">
                    <ArrowRight size={16} />
                    {config.ctaText}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}

      {[
        {
          title: productsSection?.title || "Featured products",
          subtitle: productsSection?.subtitle,
          items: data?.featuredProducts || [],
          icon: Sparkles
        },
        { title: "Best sellers", items: data?.bestSellers || [], icon: Leaf },
        { title: "New arrivals", items: data?.newArrivals || [], icon: Store },
        { title: "Discounted picks", items: data?.discountedProducts || [], icon: Tag }
      ].map((section) => (
        <section className="section-block" key={section.title}>
          <div className="section-heading">
            <div>
              <h2 className="title-with-icon">
                <span className="title-icon">
                  <section.icon size={20} />
                </span>
                {section.title}
              </h2>
              {"subtitle" in section && section.subtitle ? <p>{section.subtitle}</p> : null}
            </div>
            <Link to="/catalog" className="primary-btn">
              View all
            </Link>
          </div>
          <div className="product-grid mobile-scroll-grid">
            {section.items.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <section className="service-band glass">
        <div>
          <Truck size={18} />
          <strong>Fast delivery</strong>
          <p>Delivery fees and thresholds come from the admin panel.</p>
        </div>
        <div>
          <ShieldCheck size={18} />
          <strong>Fresh stock only</strong>
          <p>Products honor live stock and availability managed by staff.</p>
        </div>
        <div>
          <WalletCards size={18} />
          <strong>Flexible payment</strong>
          <p>Urubuto, V-Pay, and enabled methods appear dynamically at checkout.</p>
        </div>
      </section>
    </div>
  );
};
