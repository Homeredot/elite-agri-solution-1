import type { ComponentType } from "react";
import {
  Apple,
  Beef,
  Candy,
  Carrot,
  Croissant,
  CupSoda,
  Egg,
  Fish,
  Grape,
  IceCreamCone,
  Leaf,
  Milk,
  Package,
  Pizza,
  Sandwich,
  ShoppingBasket,
  Soup,
  Store,
  Vegan,
  Wheat
} from "lucide-react";

type IconComponent = ComponentType<{ size?: string | number; className?: string }>;

const categoryIconMap: Record<string, IconComponent> = {
  Apple,
  Beef,
  Candy,
  Carrot,
  Croissant,
  CupSoda,
  Egg,
  Fish,
  Grape,
  IceCreamCone,
  Leaf,
  Milk,
  Package,
  Pizza,
  Sandwich,
  ShoppingBasket,
  Soup,
  Store,
  Vegan,
  Wheat
};

export const resolveCategoryIcon = (icon?: string | null) => {
  if (!icon) {
    return null;
  }

  return categoryIconMap[icon] ?? null;
};
