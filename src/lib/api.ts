
import CoinGecko from 'coingecko-api';
import yahooFinance from 'yahoo-finance2';
import { getMockStockData } from './mock';
import { DEFAULT_CURRENCIES, DEFAULT_CRYPTO, DEFAULT_METALS, DEFAULT_STOCKS } from './constants';
import type { Asset, HistoricalDataPoint } from './types';
import { subDays, getUnixTime, startOfDay } from 'date-fns';
import { fetchStockHistoricalData } from './actions';

const cg = new CoinGecko();

const fetchCurrencies = async (): Promise<Asset[]> => {
  try {
    const ids = DEFAULT_CURRENCIES.map(c => c.id).join(',');
    const response = await cg.simple.price({
      ids: ids,
      vs_currencies: 'usd',
      include_24hr_change: true,
    });
    
    return DEFAULT_CURRENCIES.map(currency => {
      const currencyData = response.data[currency.id];
      return {
        id: currency.id,
        name: currency.name,
        symbol: currency.symbol,
        price: currencyData?.usd ?? 0,
        change24h: currencyData?.usd_24h_change ?? 0,
        type: 'currency',
        iconUrl: `https://placehold.co/40x40.png`,
      };
    });
  } catch (error) {
    console.warn("Could not fetch currency data from CoinGecko. This might be a temporary API issue. Currency data will be unavailable or stale.", error);
    return DEFAULT_CURRENCIES.map(c => ({ ...c, price: 0, change24h: 0, type: 'currency', iconUrl: `https://placehold.co/40x40.png` }));
  }
};

const fetchMetals = async (): Promise<Asset[]> => {
  try {
    const ids = DEFAULT_METALS.map(c => c.id).join(',');
    const response = await cg.simple.price({
      ids: ids,
      vs_currencies: 'usd',
      include_24hr_change: true,
    });

    return DEFAULT_METALS.map(metal => {
      const metalData = response.data[metal.id];
      return {
        id: metal.id,
        name: metal.name,
        symbol: metal.symbol,
        price: metalData?.usd ?? 0,
        change24h: metalData?.usd_24h_change ?? 0,
        type: 'metal',
        iconUrl: `https://placehold.co/40x40.png`,
      };
    });
  } catch (error) {
    console.warn("Could not fetch metal data from CoinGecko. This might be a temporary API issue. Metal data will be unavailable.", error);
    return [];
  }
};

const fetchCrypto = async (): Promise<Asset[]> => {
  try {
    const ids = DEFAULT_CRYPTO.map(c => c.id);
    const response = await cg.coins.markets({
        vs_currency: 'usd',
        ids: ids,
    });

    return response.data.map((crypto: any) => ({
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol.toUpperCase(),
        price: crypto.current_price ?? 0,
        change24h: crypto.price_change_percentage_24h ?? 0,
        type: 'crypto',
        iconUrl: crypto.image,
    }));
  } catch (error) {
    console.warn("Could not fetch crypto data from CoinGecko. This might be a temporary API issue. Crypto data will be unavailable or stale.", error);
    return DEFAULT_CRYPTO.map(c => ({ ...c, price: 0, change24h: 0, type: 'crypto', iconUrl: '' }));
  }
};

const fetchStocks = async (): Promise<Asset[]> => {
  try {
    const symbols = DEFAULT_STOCKS.map(s => s.symbol);
    const quotes = await yahooFinance.quote(symbols);
    
    return quotes.map(quote => {
      const stockInfo = DEFAULT_STOCKS.find(s => s.symbol === quote.symbol);
      const stockName = stockInfo?.name || quote.longName || quote.shortName || quote.symbol;
      const domainName = stockName.replace(/\s+/g, '').replace(/Inc\.?|Corp\.?/g, '').toLowerCase();
      return {
        id: quote.symbol,
        name: stockName,
        symbol: quote.symbol,
        price: quote.regularMarketPrice ?? 0,
        change24h: quote.regularMarketChangePercent ?? 0,
        type: 'stock',
        iconUrl: `https://logo.clearbit.com/${domainName}.com`
      };
    });
  } catch (error) {
    console.warn("Failed to fetch stock data from Yahoo Finance. Falling back to mock data.", error);
    return getMockStockData();
  }
};
  

export const fetchAllAssets = async (): Promise<Record<Asset['type'], Asset[]>> => {
  const [currency, metal, crypto, stock] = await Promise.all([
    fetchCurrencies(),
    fetchMetals(),
    fetchCrypto(),
    fetchStocks(),
  ]);
  return { currency, metal, crypto, stock };
};

export const fetchHistoricalData = async (asset: Asset, days: number): Promise<HistoricalDataPoint[]> => {
  const to = new Date();
  const from = subDays(to, days);

  if (asset.type === 'stock') {
    return fetchStockHistoricalData(asset.symbol, from, to);
  }
  
  // For crypto, currency and metals, use CoinGecko
  try {
    const fromTimestamp = getUnixTime(from);
    const toTimestamp = getUnixTime(to);

    const response = await cg.coins.fetchMarketChartRange(asset.id, {
      vs_currency: 'usd',
      from: fromTimestamp,
      to: toTimestamp,
    });

    if (!response.data || !response.data.prices || response.data.prices.length === 0) {
      throw new Error("No historical data from fetchMarketChartRange");
    }

    return response.data.prices.map(([time, price]: [number, number]) => ({
      time,
      price,
    }));
  } catch (error) {
    console.warn(`CoinGecko fetchMarketChartRange failed for ${asset.id}. Attempting daily history fallback...`, error);
    // Fallback for any asset type if fetchMarketChartRange fails
    return fetchAssetHistoryDayByDay(asset, days);
  }
};


// Fallback to fetch historical data day-by-day, more reliable for non-crypto assets
const fetchAssetHistoryDayByDay = async (asset: Asset, days: number): Promise<HistoricalDataPoint[]> => {
    const today = startOfDay(new Date());
  
    const promises = Array.from({ length: days }).map((_, i) => {
      const date = subDays(today, i);
      const dateStr = date.toISOString().split('T')[0].split('-').reverse().join('-'); // dd-mm-yyyy format
  
      return cg.coins.fetchHistory(asset.id, {
        date: dateStr,
        localization: false,
      }).then(response => {
        if (response.data && response.data.market_data && response.data.market_data.current_price) {
          return {
            time: date.getTime(),
            price: response.data.market_data.current_price.usd,
          };
        }
        return null;
      }).catch(e => {
        // It's common for CoinGecko to not have data for every single day for these assets.
        // We just skip the day by returning null.
        return null;
      });
    });
  
    const results = await Promise.all(promises);
    
    return results
      .filter((point): point is HistoricalDataPoint => point !== null && point.price !== undefined)
      .sort((a, b) => a.time - b.time);
}
