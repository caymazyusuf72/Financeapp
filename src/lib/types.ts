import type { ReactNode } from "react";

export type AssetType = 'currency' | 'crypto' | 'stock' | 'metal';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // as a percentage
  type: AssetType;
  iconUrl?: string;
  sparkline?: number[];
}

export interface HistoricalDataPoint {
  time: number;
  price: number;
}

export interface NewsItem {
  guid: string;
  title: string;
  link: string;
  isoDate: string;
  contentSnippet?: string;
}
