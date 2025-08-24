"use client"

import { useState, useEffect, useMemo } from "react";
import { AssetTable } from "./asset-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Asset, AssetType } from "@/lib/types";
import { fetchAllAssets } from "@/lib/api";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useViewPrefs } from "@/hooks/use-view-prefs";

const REFRESH_INTERVAL = 30000; // 30 seconds

interface DashboardProps {
  onAssetsFetched: (assets: Asset[]) => void;
  onAssetSelect: (asset: Asset) => void;
}

export function Dashboard({ onAssetsFetched, onAssetSelect }: DashboardProps) {
  const [assets, setAssets] = useState<Record<AssetType, Asset[]>>({
    currency: [],
    crypto: [],
    metal: [],
    stock: [],
  });
  const [loading, setLoading] = useState(true);
  const watchlist = useWatchlist();
  const { toast } = useToast();
  const { _hasHydrated, ...viewPreferences } = useViewPrefs();

  const allAssets = useMemo(() => {
    return Object.values(assets).flat();
  }, [assets]);

  useEffect(() => {
    onAssetsFetched(allAssets);
  }, [allAssets, onAssetsFetched]);

  const fetchData = async (isInitialFetch = false) => {
    if (isInitialFetch) {
      setLoading(true);
    }
    try {
      const allAssetsData = await fetchAllAssets();
      setAssets(allAssetsData);
    } catch (error) {
      console.error("Failed to fetch assets", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch latest market data. Please try again later.",
      });
    } finally {
      if (isInitialFetch) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData(true);
    const intervalId = setInterval(() => fetchData(false), REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  if ((loading && allAssets.length === 0) || !_hasHydrated) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {viewPreferences.showCurrencies && (
        <AssetTable
          id="currencies"
          title="Currencies"
          assets={assets.currency}
          onAssetSelect={onAssetSelect}
          watchlistProps={watchlist}
        />
      )}
      {viewPreferences.showMetals && (
        <AssetTable
          id="metals"
          title="Precious Metals"
          assets={assets.metal}
          onAssetSelect={onAssetSelect}
          watchlistProps={watchlist}
        />
      )}
      {viewPreferences.showCrypto && (
        <AssetTable
          id="crypto"
          title="Cryptocurrencies"
          assets={assets.crypto}
          onAssetSelect={onAssetSelect}
          watchlistProps={watchlist}
        />
      )}
      {viewPreferences.showStocks && (
        <AssetTable
          id="stocks"
          title="Stock Indices"
          assets={assets.stock}
          onAssetSelect={onAssetSelect}
          watchlistProps={watchlist}
        />
      )}
    </div>
  );
}
