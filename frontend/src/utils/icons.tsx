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

export const categoryIconMap: Record<string, IconComponent> = {
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

export const CATEGORY_ICON_OPTIONS = [
  { label: "Apple", value: "Apple" },
  { label: "Beef", value: "Beef" },
  { label: "Candy", value: "Candy" },
  { label: "Carrot", value: "Carrot" },
  { label: "Croissant", value: "Croissant" },
  { label: "Cup Soda", value: "CupSoda" },
  { label: "Egg", value: "Egg" },
  { label: "Fish", value: "Fish" },
  { label: "Grape", value: "Grape" },
  { label: "Ice Cream", value: "IceCreamCone" },
  { label: "Leaf", value: "Leaf" },
  { label: "Milk", value: "Milk" },
  { label: "Package", value: "Package" },
  { label: "Pizza", value: "Pizza" },
  { label: "Sandwich", value: "Sandwich" },
  { label: "Shopping Basket", value: "ShoppingBasket" },
  { label: "Soup", value: "Soup" },
  { label: "Store", value: "Store" },
  { label: "Vegan", value: "Vegan" },
  { label: "Wheat", value: "Wheat" }
];
