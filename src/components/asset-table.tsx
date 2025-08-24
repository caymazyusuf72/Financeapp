"use client";

import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Asset } from "@/lib/types";
import { formatPrice, formatPercentage } from "@/lib/format";
import { cn } from '@/lib/utils';
import type { useWatchlist } from '@/hooks/use-watchlist';

interface AssetTableProps {
  id: string;
  title: string;
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
  watchlistProps: ReturnType<typeof useWatchlist>;
}

export function AssetTable({ id, title, assets, onAssetSelect, watchlistProps }: AssetTableProps) {
  const { toggleWatchlist, isWatchlisted } = watchlistProps;

  return (
    <Card id={id} className="glass">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} onClick={() => onAssetSelect(asset)} className="cursor-pointer">
                <TableCell>
                  <Image
                    src={asset.iconUrl || `https://placehold.co/32x32.png`}
                    alt={`${asset.name} logo`}
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint={`${asset.type} icon`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                </TableCell>
                <TableCell className="text-right font-mono">{formatPrice(asset.price)}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={asset.change24h >= 0 ? "default" : "destructive"} className={cn(
                    "flex items-center justify-end gap-1",
                    asset.change24h >= 0 ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                  )}>
                    {asset.change24h >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {formatPercentage(asset.change24h)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(asset.id);
                    }}
                    aria-label={`Add ${asset.name} to watchlist`}
                  >
                    <Star className={cn(
                      "h-5 w-5 text-muted-foreground transition-colors hover:text-yellow-500",
                      isWatchlisted(asset.id) && "fill-yellow-400 text-yellow-500"
                    )} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
