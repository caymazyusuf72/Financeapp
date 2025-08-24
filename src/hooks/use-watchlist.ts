"use client";

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_STORAGE_KEY = 'fintech-watchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error("Failed to save watchlist to localStorage", error);
      }
    }
  }, [watchlist, isInitialized]);

  const addToWatchlist = useCallback((assetId: string) => {
    setWatchlist((prev) => [...new Set([...prev, assetId])]);
  }, []);

  const removeFromWatchlist = useCallback((assetId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== assetId));
  }, []);

  const isWatchlisted = useCallback((assetId: string) => {
    return watchlist.includes(assetId);
  }, [watchlist]);
  
  const toggleWatchlist = useCallback((assetId: string) => {
    if (isWatchlisted(assetId)) {
      removeFromWatchlist(assetId);
    } else {
      addToWatchlist(assetId);
    }
  }, [isWatchlisted, addToWatchlist, removeFromWatchlist]);

  return { watchlist, addToWatchlist, removeFromWatchlist, isWatchlisted, toggleWatchlist, isInitialized };
};
