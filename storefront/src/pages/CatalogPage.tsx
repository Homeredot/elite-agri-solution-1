import { LayoutGrid, ScanSearch, Search, SlidersHorizontal, Tags } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { ProductCard } from "../components/shop/ProductCard";
import { handleStoreImageError, resolveStoreImage } from "../utils/media";

type StoreCategory = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  subcategories?: Array<{ id: number; name: string }>;
};

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const selectedCategoryId = searchParams.get("categoryId") || "";
  const currentPage = Math.max(Number(searchParams.get("page") || 1), 1);

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    if (!params.get("pageSize")) {
      params.set("pageSize", "40");
    }
    return params.toString() ? `?${params.toString()}` : "";
  }, [searchParams]);

  const productsQuery = useQuery({
    queryKey: ["store-products", queryString],
    queryFn: () => api.get<{ data: any[]; meta: any }>(`/store/products${queryString}`)
  });

  const categoriesQuery = useQuery({
    queryKey: ["store-categories"],
    queryFn: () => api.get<{ data: StoreCategory[] }>("/store/categories")
  });

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");
    setSearchParams(params);
  };

  const setCatalogPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    setSearchParams(params);
  };

  const toggleFlag = (key: string) => {
    updateParams({ [key]: searchParams.get(key) === "1" ? null : "1" });
  };

  const setCategoryFilter = (categoryId: string | null) => {
    updateParams({
      categoryId,
      subcategoryId: null
    });
  };

  return (
    <div className="page-stack">
      <section className="toolbar glass">
        <div>
          <p className="eyebrow">Discover</p>
          <h1 className="title-with-icon">
            <span className="title-icon">
              <LayoutGrid size={20} />
            </span>
            Shop produce and pantry essentials
          </h1>
        </div>
        <div className="toolbar-grid">
          <input
            className="search-input"
            placeholder="Search vegetables, fruits, bundles..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="primary-btn"
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (search.trim()) {
                params.set("search", search.trim());
              } else {
                params.delete("search");
              }
              params.delete("page");
              setSearchParams(params);
            }}
          >
            <Search size={16} />
            Search
          </button>
          <select
            className="search-input"
            value={selectedCategoryId}
            onChange={(event) => {
              setCategoryFilter(event.target.value || null);
            }}
          >
            <option value="">All categories</option>
            {(categoriesQuery.data?.data || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="search-input"
            value={searchParams.get("sort") || "newest"}
            onChange={(event) => {
              const params = new URLSearchParams(searchParams);
              params.set("sort", event.target.value);
              params.delete("page");
              setSearchParams(params);
            }}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most popular</option>
            <option value="price_low">Price low to high</option>
            <option value="price_high">Price high to low</option>
          </select>
        </div>
      </section>

      <section className="category-browser glass">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Browse categories</p>
            <h2 className="title-with-icon">
              <span className="title-icon">
                <LayoutGrid size={20} />
              </span>
              Filter visually by category
            </h2>
          </div>
        </div>

        {/* ── All categories in a single horizontal scroll strip ── */}
        <div className="cat-scroll-row">
          <button
            type="button"
            className={`cat-tile ${!selectedCategoryId ? "active" : ""}`}
            onClick={() => setCategoryFilter(null)}
          >
            <div className="cat-tile-img-wrap">
              <img
                src={resolveStoreImage(null, "All", "#d4dce4")}
                alt="All categories"
                onError={(event) => handleStoreImageError(event, "All", "#d4dce4")}
              />
              <div className="cat-tile-overlay" />
            </div>
            <span className="cat-tile-name">All</span>
          </button>
          {(categoriesQuery.data?.data || []).map((category) => {
            const imageUrl = category.image_url || category.imageUrl;
            return (
              <button
                key={category.id}
                type="button"
                className={`cat-tile ${selectedCategoryId === String(category.id) ? "active" : ""}`}
                onClick={() => setCategoryFilter(String(category.id))}
              >
                <div className="cat-tile-img-wrap">
                  <img
                    src={resolveStoreImage(imageUrl, category.name, "#c8d5a8")}
                    alt={category.name}
                    onError={(event) => handleStoreImageError(event, category.name, "#c8d5a8")}
                  />
                  <div className="cat-tile-overlay" />
                </div>
                <span className="cat-tile-name">{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mobile-filter-panel glass">
        <div className="mobile-filter-group">
          <p className="eyebrow">Categories</p>
          <div className="mobile-filter-row">
            <button
              type="button"
              className={`filter-chip ${!selectedCategoryId ? "active" : ""}`}
              onClick={() => setCategoryFilter(null)}
            >
              All
            </button>
            {(categoriesQuery.data?.data || []).map((category) => (
              <button
                type="button"
                key={category.id}
                className={`filter-chip ${selectedCategoryId === String(category.id) ? "active" : ""}`}
                onClick={() => setCategoryFilter(String(category.id))}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mobile-filter-group">
          <p className="eyebrow">Quick filters</p>
          <div className="mobile-filter-row">
            {[
              ["bestSeller", "Best sellers"],
              ["newArrival", "New arrivals"],
              ["discounted", "Discounts"],
              ["inStock", "In stock"]
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={`filter-chip ${searchParams.get(key) === "1" ? "active" : ""}`}
                onClick={() => toggleFlag(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="catalog-layout">
        <aside className="catalog-sidebar glass">
          <div className="sidebar-block">
            <p className="eyebrow">Shop by category</p>
            <div className="sidebar-links">
              <button
                type="button"
                className={`sidebar-link ${!selectedCategoryId ? "active" : ""}`}
                onClick={() => setCategoryFilter(null)}
              >
                All categories
              </button>
              {(categoriesQuery.data?.data || []).map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={`sidebar-link ${selectedCategoryId === String(category.id) ? "active" : ""}`}
                  onClick={() => setCategoryFilter(String(category.id))}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="sidebar-block">
            <p className="eyebrow">Quick filters</p>
            <div className="sidebar-links">
              {[
                ["bestSeller", "Best sellers"],
                ["newArrival", "New arrivals"],
                ["discounted", "Discounts"],
                ["inStock", "In stock"]
              ].map(([key, label]) => (
                <button
                  type="button"
                  key={key}
                  className={`sidebar-link ${searchParams.get(key) === "1" ? "active" : ""}`}
                  onClick={() => toggleFlag(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="catalog-results">
          <div className="results-toolbar glass">
            <strong className="title-with-icon">
              <span className="section-icon">
                <ScanSearch size={18} />
              </span>
              {productsQuery.data?.meta?.total || 0} products
            </strong>
            <span>
              Showing {(productsQuery.data?.data || []).length} on this page. Use the controls below to browse every product.
            </span>
          </div>
          <div className="product-grid catalog-grid">
            {(productsQuery.data?.data || []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="catalog-pagination glass">
            <button
              type="button"
              className="secondary-btn"
              disabled={currentPage <= 1}
              onClick={() => setCatalogPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {productsQuery.data?.meta?.page || currentPage} of{" "}
              {Math.max(Math.ceil((productsQuery.data?.meta?.total || 0) / (productsQuery.data?.meta?.pageSize || 40)), 1)}
            </span>
            <button
              type="button"
              className="secondary-btn"
              disabled={
                currentPage >=
                Math.max(Math.ceil((productsQuery.data?.meta?.total || 0) / (productsQuery.data?.meta?.pageSize || 40)), 1)
              }
              onClick={() => setCatalogPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </div>

      <section className="service-band glass">
        <div>
          <Tags size={18} />
          <strong>Admin-driven assortments</strong>
          <p>Categories, searchability, stock, and featured flags all sync from the admin panel.</p>
        </div>
        <div>
          <SlidersHorizontal size={18} />
          <strong>Responsive filters</strong>
          <p>Desktop gets wider discovery panels while mobile keeps the browsing flow compact.</p>
        </div>
      </section>
    </div>
  );
};
