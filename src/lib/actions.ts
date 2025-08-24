"use server";

import yahooFinance from 'yahoo-finance2';
import type { HistoricalDataPoint } from './types';

export const fetchStockHistoricalData = async (symbol: string, from: Date, to: Date): Promise<HistoricalDataPoint[]> => {
    try {
        const results = await yahooFinance.historical(symbol, {
            period1: from,
            period2: to,
            interval: '1d'
        });
        return results.map(item => ({
            time: new Date(item.date).getTime(),
            price: item.close,
        })).sort((a, b) => a.time - b.time);
    } catch (error) {
        console.error(`Failed to fetch historical stock data for ${symbol} from Yahoo Finance`, error);
        return [];
    }
};
