import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren
} from "react";
import { api } from "../api/client";
import type { StoreProductSummary } from "../types/store";
import { useAuth } from "./AuthContext";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
  quantity: number;
  stockQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  wishlist: number[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  syncItems: (products: StoreProductSummary[]) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type ServerCartItem = StoreProductSummary & {
  productId: number;
  quantity: number;
};

const getStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => getStoredJson("store_cart", []));
  const [wishlist, setWishlist] = useState<number[]>(() => getStoredJson("store_wishlist", []));
  const previousTokenRef = useRef<string | null>(token);
  const hydratedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    localStorage.setItem("store_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("store_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (previousTokenRef.current && !token) {
      setItems([]);
      setWishlist([]);
      hydratedTokenRef.current = null;
    }

    previousTokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!token || hydratedTokenRef.current === token) {
      return;
    }

    let cancelled = false;

    const mapServerCartItems = (serverItems: ServerCartItem[]) =>
      serverItems.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        price: item.price,
        discountPrice: item.discount_price,
        imageUrl: item.og_image_url || null,
        quantity: item.quantity,
        stockQuantity: item.stock_quantity
      }));

    const hydrate = async () => {
      try {
        const [cartResponse, wishlistResponse] = await Promise.all([
          items.length
            ? api.post<{ data: ServerCartItem[] }>("/store/customers/cart/sync", {
                items: items.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity
                }))
              })
            : api.get<{ data: ServerCartItem[] }>("/store/customers/cart"),
          wishlist.length
            ? api.post<{ data: number[] }>("/store/customers/wishlist/sync", {
                productIds: wishlist
              })
            : api.get<{ data: number[] }>("/store/customers/wishlist")
        ]);

        if (cancelled) {
          return;
        }

        setItems(mapServerCartItems(cartResponse.data));
        setWishlist(wishlistResponse.data);
        hydratedTokenRef.current = token;
      } catch {
        if (!cancelled) {
          hydratedTokenRef.current = token;
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [items, token, wishlist]);

  const value = useMemo<CartContextValue>(
    () => {
      const mapServerCartItems = (serverItems: ServerCartItem[]) =>
        serverItems.map((item) => ({
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          price: item.price,
          discountPrice: item.discount_price,
          imageUrl: item.og_image_url || null,
          quantity: item.quantity,
          stockQuantity: item.stock_quantity
        }));

      return {
        items,
        wishlist,
        addItem: (item) => {
          setItems((current) => {
            const existing = current.find((entry) => entry.productId === item.productId);
            if (existing) {
              return current.map((entry) =>
                entry.productId === item.productId
                  ? {
                      ...entry,
                      quantity: Math.min(entry.quantity + item.quantity, entry.stockQuantity)
                    }
                  : entry
              );
            }
            return [...current, item];
          });

          if (token) {
            void api
              .post<{ data: ServerCartItem[] }>("/store/customers/cart/items", {
                productId: item.productId,
                quantity: item.quantity
              })
              .then((response) => setItems(mapServerCartItems(response.data)));
          }
        },
        updateQuantity: (productId, quantity) => {
          setItems((current) =>
            current
              .map((entry) =>
                entry.productId === productId
                  ? { ...entry, quantity: Math.max(1, Math.min(quantity, entry.stockQuantity)) }
                  : entry
              )
              .filter((entry) => entry.quantity > 0)
          );

          if (token) {
            void api
              .put<{ data: ServerCartItem[] }>(`/store/customers/cart/items/${productId}`, {
                quantity
              })
              .then((response) => setItems(mapServerCartItems(response.data)));
          }
        },
        removeItem: (productId) => {
          setItems((current) => current.filter((entry) => entry.productId !== productId));

          if (token) {
            void api
              .delete<{ data: ServerCartItem[] }>(`/store/customers/cart/items/${productId}`)
              .then((response) => setItems(mapServerCartItems(response.data)));
          }
        },
        toggleWishlist: (productId) => {
          const exists = wishlist.includes(productId);

          setWishlist((current) =>
            current.includes(productId)
              ? current.filter((entry) => entry !== productId)
              : [...current, productId]
          );

          if (token) {
            void (exists
              ? api.delete<{ data: number[] }>(`/store/customers/wishlist/items/${productId}`)
              : api.post<{ data: number[] }>("/store/customers/wishlist/items", { productId })
            ).then((response) => setWishlist(response.data));
          }
        },
        syncItems: (products) => {
          const productMap = new Map(products.map((product) => [product.id, product]));

          setItems((current) =>
            current.map((entry) => {
              const product = productMap.get(entry.productId);

              if (!product) {
                return entry;
              }

              return {
                ...entry,
                slug: product.slug,
                name: product.name,
                price: product.price,
                discountPrice: product.discount_price,
                imageUrl: product.og_image_url || null,
                stockQuantity: product.stock_quantity
              };
            })
          );
        },
        clearCart: () => {
          setItems([]);

          if (token) {
            void api.delete<{ data: ServerCartItem[] }>("/store/customers/cart");
          }
        },
        subtotal: items.reduce((sum, item) => {
          const effectivePrice =
            item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price
              ? item.discountPrice
              : item.price;
          return sum + effectivePrice * item.quantity;
        }, 0),
        count: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    },
    [items, token, wishlist]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
