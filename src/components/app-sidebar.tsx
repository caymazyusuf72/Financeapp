"use client"

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Icons } from "@/components/icons"
import { DollarSign, BarChart2, Gem, Building, Star, Globe } from "lucide-react"
import { useWatchlist } from "@/hooks/use-watchlist"
import type { Asset } from "@/lib/types"

interface AppSidebarProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
}

export function AppSidebar({ assets, onAssetSelect }: AppSidebarProps) {
  const { watchlist, isInitialized } = useWatchlist();

  const watchlistItems = isInitialized 
    ? assets.filter(asset => watchlist.includes(asset.id)) 
    : [];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <h2 className="font-headline text-lg font-semibold">FinTrack</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Watchlist</SidebarGroupLabel>
          <SidebarMenu>
            {isInitialized && watchlistItems.length === 0 ? (
                <p className="px-2 text-xs text-muted-foreground">Your watchlist is empty. Add assets with the star icon.</p>
            ) : (
                watchlistItems.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => onAssetSelect(item)} size="sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Markets</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => scrollTo('currencies')}>
                <DollarSign />
                <span>Currencies</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => scrollTo('metals')}>
                <Gem />
                <span>Metals</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => scrollTo('crypto')}>
                <Globe />
                <span>Crypto</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => scrollTo('stocks')}>
                <Building />
                <span>Stocks</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  )
}
