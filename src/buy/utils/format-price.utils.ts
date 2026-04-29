export const formatBuyPrice = (raw: string | number): string => {
  const num = typeof raw === "string" ? parseFloat(raw) : raw;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(num);
};
