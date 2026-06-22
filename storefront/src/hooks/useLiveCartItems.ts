import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useCart, type CartItem } from "../context/CartContext";
import type { StoreProductSummary } from "../types/store";
import { getEffectivePrice } from "../utils/pricing";

export type LiveCartItem = CartItem & {
  isUnavailable: boolean;
};

export const useLiveCartItems = () => {
  const { items, syncItems } = useCart();
  const ids = items.map((item) => item.productId);

  const cartProductsQuery = useQuery({
    queryKey: ["store-cart-products", ids],
    queryFn: () =>
      api.get<{ data: StoreProductSummary[] }>(`/store/products/batch?ids=${ids.join(",")}`),
    enabled: ids.length > 0
  });

  useEffect(() => {
    if (cartProductsQuery.data?.data?.length) {
      syncItems(cartProductsQuery.data.data);
    }
  }, [cartProductsQuery.data?.data]);

  const liveItems = useMemo<LiveCartItem[]>(() => {
    const productMap = new Map(
      (cartProductsQuery.data?.data || []).map((product) => [product.id, product])
    );

    return items.map((item) => {
      const liveProduct = productMap.get(item.productId);

      if (!liveProduct) {
        return {
          ...item,
          isUnavailable: true
        };
      }

      return {
        ...item,
        slug: liveProduct.slug,
        name: liveProduct.name,
        price: liveProduct.price,
        discountPrice: liveProduct.discount_price,
        imageUrl: liveProduct.og_image_url || null,
        stockQuantity: liveProduct.stock_quantity,
        isUnavailable: liveProduct.stock_quantity < item.quantity
      };
    });
  }, [cartProductsQuery.data, items]);

  const subtotal = liveItems.reduce(
    (sum, item) => sum + getEffectivePrice(item.price, item.discountPrice) * item.quantity,
    0
  );

  return {
    items: liveItems,
    subtotal,
    isLoading: cartProductsQuery.isPending,
    hasUnavailableItems: liveItems.some((item) => item.isUnavailable)
  };
};
