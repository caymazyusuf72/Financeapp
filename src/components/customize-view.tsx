"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useViewPrefs, type ViewPreferences } from "@/hooks/use-view-prefs";
import { SlidersHorizontal } from "lucide-react";

export function CustomizeView() {
  const { setViewPreference, _hasHydrated, ...viewPreferences } = useViewPrefs();

  const menuItems: { id: keyof ViewPreferences; label: string }[] = [
    { id: "showCurrencies", label: "Currencies" },
    { id: "showMetals", label: "Precious Metals" },
    { id: "showCrypto", label: "Cryptocurrencies" },
    { id: "showStocks", label: "Stock Indices" },
  ];

  if (!_hasHydrated) {
    return (
        <Button variant="ghost" size="icon" disabled>
          <SlidersHorizontal />
        </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SlidersHorizontal />
          <span className="sr-only">Customize View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Customize Dashboard</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-4 p-2">
          {menuItems.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={viewPreferences[id]}
                onCheckedChange={(checked) =>
                  setViewPreference(id, Boolean(checked))
                }
              />
              <Label htmlFor={id} className="text-sm font-normal">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
