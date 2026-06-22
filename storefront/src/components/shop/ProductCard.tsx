import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { resolveStoreImage } from "../../utils/media";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  average_rating?: number;
  og_image_url?: string | null;
  short_description?: string | null;
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const image = resolveStoreImage(product.og_image_url, product.name, "#D8E5B2");
  const effectivePrice =
    product.discount_price && product.discount_price > 0 && product.discount_price < product.price
      ? product.discount_price
      : product.price;

  return (
    <article className="product-card">
      <button
        className={`wishlist-btn ${wishlist.includes(product.id) ? "active" : ""}`}
        onClick={() => toggleWishlist(product.id)}
        type="button"
      >
        <Heart size={16} />
      </button>
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        <img src={image} alt={product.name} className="product-image" />
      </Link>
      <div className="product-copy">
        <Link to={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-meta">{product.short_description || "Freshly prepared for everyday kitchens."}</p>
        <div className="price-row">
          <strong>RWF {effectivePrice}</strong>
          {effectivePrice !== product.price ? <span>RWF {product.price}</span> : null}
        </div>
      </div>
      <button
        className="cta-chip"
        type="button"
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            discountPrice: product.discount_price,
            imageUrl: product.og_image_url || null,
            quantity: 1,
            stockQuantity: product.stock_quantity
          })
        }
        disabled={product.stock_quantity <= 0}
      >
        <ShoppingBag size={16} />
        {product.stock_quantity > 0 ? "Add" : "Out"}
      </button>
    </article>
  );
};
