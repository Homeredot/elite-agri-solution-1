export const getEffectivePrice = (price: number, discountPrice?: number | null) =>
  discountPrice && discountPrice > 0 && discountPrice < price ? discountPrice : price;

export const formatMoney = (amount: number, currencyCode = "RWF") =>
  `${currencyCode} ${new Intl.NumberFormat("en-RW", {
    maximumFractionDigits: 0
  }).format(amount)}`;
