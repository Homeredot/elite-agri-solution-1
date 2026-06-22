import {
  ChevronDown,
  Home,
  Menu,
  MoonStar,
  Search,
  ShoppingCart,
  SunMedium,
  Tag,
  Twitter,
  UserRound,
  X
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { StoreNotifications } from "./StoreNotifications";
import { WhatsAppWidget } from "../shop/WhatsAppWidget";

const isExternalUrl = (value: string) =>
  /^(?:https?:)?\/\//i.test(value) || value.startsWith("mailto:") || value.startsWith("tel:");
const normalizePath = (value: string) => (value.startsWith("/") ? value : `/${value}`);

export const StoreLayout = () => {
  const { count } = useCart();
  const { customer, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("store_theme") as "light" | "dark") || "light"
  );
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 6);
  const [searchValue, setSearchValue] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const settingsQuery = useQuery({
    queryKey: ["store-settings"],
    queryFn: () => api.get<{ data: { websiteSettings: any; themeSettings: any } }>("/store/settings")
  });
  const contentQuery = useQuery({
    queryKey: ["store-content"],
    queryFn: () => api.get<{ data: { socialLinks: any[]; footerLinks: any[] } }>("/store/content")
  });
  const categoriesQuery = useQuery({
    queryKey: ["store-categories-nav"],
    queryFn: () => api.get<{ data: any[] }>("/store/categories")
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("store_theme", theme);
  }, [theme]);

  useEffect(() => {
    const themeSettings = settingsQuery.data?.data.themeSettings;
    if (!themeSettings) return;
    document.documentElement.style.setProperty("--olive", themeSettings.primary_color || "#556b2f");
    document.documentElement.style.setProperty("--orange", themeSettings.button_color || "#f97316");
  }, [settingsQuery.data]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 6);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const siteName = settingsQuery.data?.data.websiteSettings?.website_name || "Fresh Market";
  const supportPhone = settingsQuery.data?.data.websiteSettings?.support_phone;
  const supportEmail = settingsQuery.data?.data.websiteSettings?.support_email;
  const whatsappNumber: string | null = settingsQuery.data?.data.websiteSettings?.whatsapp_number || null;
  const footerLinks = contentQuery.data?.data.footerLinks || [];
  const socialLinks = contentQuery.data?.data.socialLinks || [];
  const categories = categoriesQuery.data?.data || [];
  const footerSections = footerLinks.reduce(
    (groups, item) => {
      const sectionName = item.section_name || "Explore";
      groups[sectionName] = groups[sectionName] || [];
      groups[sectionName].push(item);
      return groups;
    },
    {} as Record<string, any[]>
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) navigate(`/catalog?search=${encodeURIComponent(searchValue.trim())}`);
  };

  return (
    <div className="store-shell">
      {/* ── 3-ROW HEADER ── */}
      <div className={`bazaar-header-wrap ${isScrolled ? "is-scrolled" : ""}`}>

        {/* ROW 1 – top utility bar */}
        <div className="bh-top-bar">
          <div className="bh-top-left">
            <span className="bh-hot-badge">HOT</span>
            <span className="bh-promo-text">Free Express Shipping on orders over RWF&nbsp;50,000</span>
          </div>
          <div className="bh-top-right">
            <button
              className={`bh-theme-btn`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonStar size={14} /> : <SunMedium size={14} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
            {socialLinks.slice(0, 3).map((s: any) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="bh-social-link">
                {s.platform?.toLowerCase().includes("twitter") ? (
                  <Twitter size={14} />
                ) : s.platform?.toLowerCase().includes("instagram") ? (
                  <span className="bh-social-icon">IG</span>
                ) : (
                  <span className="bh-social-icon">{s.platform?.[0] || "•"}</span>
                )}
              </a>
            ))}
            {!socialLinks.length && (
              <>
                <a href="#" className="bh-social-link"><Twitter size={13} /></a>
                <a href="#" className="bh-social-link"><span className="bh-social-icon">FB</span></a>
                <a href="#" className="bh-social-link"><span className="bh-social-icon">IG</span></a>
              </>
            )}
          </div>
        </div>

        {/* ROW 2 – logo + search + cart */}
        <div className="bh-main-bar">
          {/* Logo */}
          <Link to="/" className="bh-logo">
            <img src="/logo.png" alt={siteName} className="bh-logo-img" />
          </Link>

          {/* Search */}
          <form className="bh-search-form" onSubmit={handleSearch}>
            <button type="submit" className="bh-search-icon-btn" aria-label="Search">
              <Search size={17} />
            </button>
            <input
              className="bh-search-input"
              placeholder="Searching for..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            <div className="bh-search-divider" />
            {/* Category dropdown */}
            <div className="bh-cat-dropdown" ref={catRef}>
              <button
                type="button"
                className="bh-cat-btn"
                onClick={() => setCatOpen(v => !v)}
                aria-expanded={catOpen}
              >
                All Categories <ChevronDown size={13} />
              </button>
              {catOpen && (
                <div className="bh-cat-menu">
                  <button
                    type="button"
                    className="bh-cat-item"
                    onClick={() => { navigate("/catalog"); setCatOpen(false); }}
                  >
                    All Categories
                  </button>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.id}
                      type="button"
                      className="bh-cat-item"
                      onClick={() => {
                        navigate(`/catalog?categoryId=${cat.id}`);
                        setCatOpen(false);
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Right actions */}
          <div className="bh-main-actions">
            <StoreNotifications />
            <Link to="/account" className="bh-icon-btn" aria-label="Account">
              <UserRound size={20} />
              {customer && <span className="bh-icon-label">{customer.firstName}</span>}
            </Link>
            <Link to="/cart" className="bh-cart-btn" aria-label="Cart">
              <ShoppingCart size={20} />
              {count > 0 && <span className="bh-cart-badge">{count}</span>}
            </Link>
          </div>
        </div>

        {/* ROW 3 – categories pill + main nav */}
        <div className="bh-nav-bar">
          <Link to="/catalog" className="bh-categories-pill">
            <Menu size={16} />
            <span>Categories</span>
            <ChevronDown size={13} />
          </Link>
          <nav className="bh-nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}>
              Home
            </NavLink>
            <NavLink to="/catalog" className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}>
              Shop
            </NavLink>
            <NavLink
              to="/catalog?bestSeller=1"
              className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}
            >
              Best Sellers
            </NavLink>
            <NavLink
              to="/catalog?discounted=1"
              className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}
            >
              Deals <Tag size={12} />
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}
            >
              About
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}
            >
              Terms
            </NavLink>
            <NavLink
              to="/privacy"
              className={({ isActive }) => isActive ? "bh-nav-link active" : "bh-nav-link"}
            >
              Privacy
            </NavLink>
            {customer && (
              <button className="bh-nav-link bh-nav-signout" onClick={logout}>Sign out</button>
            )}
          </nav>
        </div>
      </div>

      <main className="store-main">
        <Outlet />
      </main>

      <footer className="store-footer glass">
        <div className="store-footer-top">
          <div className="store-footer-brand">
            <img src="/logo.png" alt={siteName} className="footer-logo-img" />
            <p>Fresh groceries, bundles, and daily essentials.</p>
            <div className="store-footer-contact">
              {supportPhone ? <span>{supportPhone}</span> : null}
              {supportEmail ? <span>{supportEmail}</span> : null}
            </div>
          </div>
          <div className="store-footer-links">
            {Object.entries(footerSections).length ? (
              (Object.entries(footerSections) as Array<[string, any[]]>).map(([sectionName, items]) => (
                <div key={sectionName} className="footer-link-group">
                  <strong>{sectionName}</strong>
                  <div className="footer-link-list">
                    {items.map((item: any) =>
                      isExternalUrl(item.url) ? (
                        <a key={item.id} href={item.url} target="_blank" rel="noreferrer">{item.label}</a>
                      ) : (
                        <Link key={item.id} to={normalizePath(item.url)}>{item.label}</Link>
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="footer-link-group">
                <strong>Explore</strong>
                <div className="footer-link-list">
                  <Link to="/catalog">Shop</Link>
                  <Link to="/faq">FAQ</Link>
                  <Link to="/contact">Contact</Link>
                </div>
              </div>
            )}
            <div className="footer-link-group">
              <strong>Legal</strong>
              <div className="footer-link-list">
                <Link to="/terms">Terms &amp; Conditions</Link>
                <Link to="/privacy">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
        {socialLinks.length ? (
          <div className="store-social-links">
            {socialLinks.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer">{item.platform}</a>
            ))}
          </div>
        ) : null}
      </footer>

      {/* Mobile bottom nav */}
      <nav className="mobile-store-nav glass">
        <NavLink to="/" end className={({ isActive }) => `mobile-store-link ${isActive ? "active" : ""}`}>
          <Home size={18} /><span>Home</span>
        </NavLink>
        <NavLink to="/catalog" className={({ isActive }) => `mobile-store-link ${isActive ? "active" : ""}`}>
          <Search size={18} /><span>Shop</span>
        </NavLink>
        <NavLink to="/catalog?discounted=1" className={({ isActive }) => `mobile-store-link ${isActive ? "active" : ""}`}>
          <Menu size={18} /><span>Deals</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `mobile-store-link ${isActive ? "active" : ""}`}>
          <ShoppingCart size={18} />
          <span>Cart {count > 0 && `(${count})`}</span>
        </NavLink>
        <NavLink to="/account" className={({ isActive }) => `mobile-store-link ${isActive ? "active" : ""}`}>
          <UserRound size={18} /><span>Account</span>
        </NavLink>
      </nav>

      {/* WhatsApp floating widget – rendered once for the whole site */}
      {whatsappNumber && <WhatsAppWidget number={whatsappNumber} />}
    </div>
  );
};
