import { useQuery } from "@tanstack/react-query";
import { Heart, Minus, ShoppingBag, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/shop/ProductCard";
import { WhatsAppProductButton } from "../components/shop/WhatsAppWidget";
import { resolveStoreImage } from "../utils/media";

export const ProductPage = () => {
  const { identifier = "" } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleWishlist, wishlist } = useCart();

  const productQuery = useQuery({
    queryKey: ["store-product", identifier],
    queryFn: () => api.get<{ data: any }>(`/store/products/${identifier}`)
  });

  const settingsQuery = useQuery({
    queryKey: ["store-settings"],
    queryFn: () => api.get<{ data: { websiteSettings: any } }>("/store/settings"),
    staleTime: 5 * 60 * 1000
  });

  const product = productQuery.data?.data;
  const whatsappNumber: string | null =
    settingsQuery.data?.data?.websiteSettings?.whatsapp_number || null;

  if (!product) {
    return <div className="page-stack"><p>Loading product...</p></div>;
  }

  const effectivePrice =
    product.discount_price && product.discount_price > 0 && product.discount_price < product.price
      ? product.discount_price
      : product.price;

  const productUrl = `${window.location.origin}/products/${product.slug}`;
  const imageUrl = product.images?.[0]?.image_url || product.og_image_url || null;

  return (
    <div className="page-stack">
      <div className="product-breadcrumb">
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>
      <section className="product-hero glass">
        <div className="product-gallery">
          <img
            src={resolveStoreImage(imageUrl, product.name, "#F3E3BA")}
            alt={product.name}
          />
        </div>
        <div className="product-detail-pane">
          <p className="eyebrow">Fresh today</p>
          <h1>{product.name}</h1>
          <p>{product.short_description || product.description}</p>
          <div className="price-row large">
            <strong>RWF {effectivePrice}</strong>
            {effectivePrice !== product.price ? <span>RWF {product.price}</span> : null}
          </div>
          <div className="detail-meta">
            <span>{product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}</span>
            <span>{product.average_rating || 0} / 5</span>
          </div>
          <div className="quantity-row">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="hero-actions">
            <button
              className="primary-btn"
              disabled={product.stock_quantity <= 0}
              onClick={() =>
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  discountPrice: product.discount_price,
                  imageUrl,
                  quantity,
                  stockQuantity: product.stock_quantity
                })
              }
            >
              <ShoppingBag size={16} />
              {product.stock_quantity > 0 ? "Add to cart" : "Out of stock"}
            </button>
            <button className="secondary-btn" onClick={() => toggleWishlist(product.id)}>
              <Heart size={16} />
              {wishlist.includes(product.id) ? "Saved" : "Wishlist"}
            </button>
          </div>

          {/* WhatsApp product inquiry button */}
          {whatsappNumber && (
            <WhatsAppProductButton
              number={whatsappNumber}
              productName={product.name}
              productPrice={effectivePrice}
              productUrl={productUrl}
              imageUrl={imageUrl}
            />
          )}

          <div className="desktop-detail-strip">
            <div className="glass detail-chip">
              <strong>Delivery</strong>
              <span>Delivery fees and timing come from live zone settings.</span>
            </div>
            <div className="glass detail-chip">
              <strong>Categories</strong>
              <span>
                {(product.categories || []).map((c: any) => c.name).join(", ") || "Fresh produce"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Reviews</h2>
        </div>
        <div className="review-list">
          {(product.reviews || []).length ? (
            product.reviews.map((review: any, i: number) => (
              <article className="glass review-card" key={i}>
                <strong>{review.customer_name}</strong>
                <span>{review.rating}/5</span>
                <p>{review.review_text || review.title}</p>
              </article>
            ))
          ) : (
            <div className="glass review-card">No reviews yet.</div>
          )}
        </div>
      </section>

      {(product.relatedProducts || []).length > 0 && (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">You might also like</p>
              <h2>Recommended products</h2>
            </div>
          </div>
          <div className="product-grid">
            {product.relatedProducts.map((related: any) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
