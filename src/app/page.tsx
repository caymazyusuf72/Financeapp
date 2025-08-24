"use client"

import { useState, useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MainHeader } from "@/components/main-header";
import { Dashboard } from "@/components/dashboard";
import type { Asset } from "@/lib/types";
import { AssetDetailModal } from "@/components/asset-detail-modal";
import { NewsFeed } from "@/components/news-feed";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleModalClose = () => {
    setSelectedAsset(null);
  };

  // This effect ensures that when the selected asset's data is refreshed,
  // the modal shows the updated information.
  useEffect(() => {
    if (selectedAsset) {
      const updatedAsset = allAssets.find(a => a.id === selectedAsset.id);
      if (updatedAsset) {
        setSelectedAsset(updatedAsset);
      }
    }
  }, [allAssets, selectedAsset]);

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar assets={allAssets} onAssetSelect={handleAssetSelect} />
      </Sidebar>
      <SidebarInset className="flex flex-col @container/main">
        <MainHeader />
        <main className="flex-1 p-4 md:p-6">
          <div className="grid grid-cols-1 @[80rem]:grid-cols-[1fr_380px] gap-8">
            <Dashboard 
              onAssetsFetched={setAllAssets}
              onAssetSelect={handleAssetSelect}
            />
            <aside className="space-y-8">
               <NewsFeed />
            </aside>
          </div>
        </main>
      </SidebarInset>
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={handleModalClose}
      />
    </SidebarProvider>
  );
}
