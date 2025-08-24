"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const VIEW_PREFS_STORAGE_KEY = 'fintech-view-prefs';

export interface ViewPreferences {
  showCurrencies: boolean;
  showMetals: boolean;
  showCrypto: boolean;
  showStocks: boolean;
}

interface ViewPrefsState extends ViewPreferences {
  setViewPreference: <K extends keyof ViewPreferences>(key: K, value: ViewPreferences[K]) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// A helper function to return an empty storage implementation for SSR
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useViewPrefs = create<ViewPrefsState>()(
  persist(
    (set) => ({
      showCurrencies: true,
      showMetals: true,
      showCrypto: true,
      showStocks: true,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setViewPreference: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: VIEW_PREFS_STORAGE_KEY,
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? window.localStorage : dummyStorage
      ),
      onRehydrateStorage: () => (state) => {
        if (state) {
            state.setHasHydrated(true);
        }
      },
    }
  )
);
