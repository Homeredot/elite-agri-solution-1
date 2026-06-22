import { ArrowRight, Minus, Plus, ReceiptText, ShoppingBasket, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLiveCartItems } from "../hooks/useLiveCartItems";
import { resolveStoreImage } from "../utils/media";
import { formatMoney, getEffectivePrice } from "../utils/pricing";

export const CartPage = () => {
  const { updateQuantity, removeItem } = useCart();
  const { items, subtotal, hasUnavailableItems } = useLiveCartItems();

  return (
    <div className="page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cart</p>
            <h1 className="title-with-icon">
              <span className="title-icon">
                <ShoppingBasket size={20} />
              </span>
              Your basket
            </h1>
          </div>
        </div>
        {items.length ? (
          <div className="cart-list">
            {items.map((item) => {
              const effectivePrice = getEffectivePrice(item.price, item.discountPrice);
              return (
                <article key={item.productId} className="cart-card glass">
                  <img
                    src={resolveStoreImage(item.imageUrl, item.name, "#F2F4EA")}
                    alt={item.name}
                  />
                  <div className="cart-copy">
                    <strong>{item.name}</strong>
                    <span>{formatMoney(effectivePrice)}</span>
                    {item.isUnavailable ? (
                      <div className="error-chip compact-chip">
                        Quantity exceeds current stock or the product is no longer available.
                      </div>
                    ) : null}
                    <div className="quantity-row">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button className="secondary-btn" onClick={() => removeItem(item.productId)}>
                    <Trash2 size={16} />
                    Remove
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass empty-card">
            <ShoppingBasket size={22} />
            <h3>Your cart is empty</h3>
            <p>Start browsing fresh groceries and add them here.</p>
            <Link to="/catalog" className="primary-btn">
              <ArrowRight size={16} />
              Browse products
            </Link>
          </div>
        )}
      </section>

      {items.length ? (
        <section className="checkout-summary glass">
          <div>
            <ReceiptText size={18} />
            <strong>Subtotal</strong>
            <span>{formatMoney(subtotal)}</span>
          </div>
          {hasUnavailableItems ? (
            <div className="error-chip">Adjust unavailable items before checkout.</div>
          ) : null}
          {hasUnavailableItems ? (
            <button className="secondary-btn" type="button" disabled>
              <ArrowRight size={16} />
              Continue to checkout
            </button>
          ) : (
            <Link to="/checkout" className="primary-btn">
              <ArrowRight size={16} />
              Continue to checkout
            </Link>
          )}
        </section>
      ) : null}
    </div>
  );
};
