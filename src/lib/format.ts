export const formatPrice = (price: number | undefined | null) => {
  if (price === undefined || price === null) return "N/A";
  
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: price > 10 ? 2 : 6,
  };

  return new Intl.NumberFormat('en-US', options).format(price);
};

export const formatCurrency = (price: number | undefined | null) => {
  if (price === undefined || price === null) return "N/A";
  
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: price > 10 ? 2 : 6,
  };

  return new Intl.NumberFormat('en-US', options).format(price);
}

export const formatPercentage = (percentage: number | undefined | null) => {
  if (percentage === undefined || percentage === null) return "N/A";
  return `${percentage.toFixed(2)}%`;
};
