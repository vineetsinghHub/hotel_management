import { useCurrency } from "@/context/AppContext";

// Drop-in replacement for hardcoded $XXXX prices. Pass USD amount.
// <Price value={4460} /> or <Price value={4460} className="font-mono" />
export const Price = ({ value, className = "", showSymbol = true, decimals, testid }) => {
  const { formatPrice } = useCurrency();
  return (
    <span className={className} data-testid={testid}>{formatPrice(value, { showSymbol, decimals })}</span>
  );
};

export default Price;
