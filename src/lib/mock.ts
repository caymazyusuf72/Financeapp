import { DEFAULT_STOCKS } from './constants';
import type { Asset } from './types';

// This file provides fallback mock data if the live API fails.
export const getMockStockData = (): Asset[] => {
  return DEFAULT_STOCKS.map(stock => ({
    id: stock.symbol,
    symbol: stock.symbol,
    name: stock.name,
    price: 100 + Math.random() * 500, // Random price between 100 and 600
    change24h: (Math.random() - 0.5) * 5, // Random change between -2.5% and +2.5%
    type: 'stock',
    iconUrl: `https://placehold.co/40x40.png`,
  }));
};
