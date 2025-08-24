"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchHistoricalData } from '@/lib/api';
import type { Asset, HistoricalDataPoint } from '@/lib/types';
import { format, fromUnixTime, isToday } from 'date-fns';
import { formatCurrency, formatPrice } from '@/lib/format';

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
}

const timeRanges = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
];

export function AssetDetailModal({ asset, isOpen, onClose }: AssetDetailModalProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState(timeRanges[1]);

  useEffect(() => {
    if (asset && isOpen) {
      const loadData = async () => {
        setLoading(true);
        setHistoricalData([]); // Clear old data
        const data = await fetchHistoricalData(asset, selectedRange.days);
        setHistoricalData(data);
        setLoading(false);
      };
      loadData();
    }
  }, [asset, selectedRange, isOpen]);
  
  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--primary))",
    },
  };

  const isChartAvailable = asset && historicalData.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] glass">
        <DialogHeader>
          {asset && (
             <div className="flex items-center gap-4">
                <Image
                    src={asset.iconUrl || `https://placehold.co/40x40.png`}
                    alt={`${asset.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <DialogTitle className="font-headline text-2xl">{asset.name}</DialogTitle>
                    <DialogDescription>{asset.symbol} - {formatCurrency(asset.price)}</DialogDescription>
                </div>
             </div>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                {timeRanges.map((range) => (
                <Button
                    key={range.label}
                    variant={selectedRange.label === range.label ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRange(range)}
                    disabled={loading}
                >
                    {range.label}
                </Button>
                ))}
            </div>
            <div className="h-[250px]">
              {loading ? (
                  <Skeleton className="h-full w-full" />
              ) : isChartAvailable ? (
              <ChartContainer config={chartConfig} className="h-full w-full">
                  <AreaChart 
                    data={historicalData}
                    margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
                  >
                  <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = fromUnixTime(value / 1000);
                        if (selectedRange.days === 1) return format(date, 'HH:mm');
                        if (isToday(date)) return format(date, 'HH:mm');
                        return format(date, 'MMM d');
                      }}
                  />
                  <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8}
                      orientation="right"
                      tickFormatter={(value) => formatPrice(value)}
                      domain={['dataMin', 'dataMax']}
                  />
                  <ChartTooltip 
                      cursor={true}
                      content={<ChartTooltipContent 
                          formatter={(value, name, item) => (
                              <>
                               <div className="font-medium">{formatCurrency(item.payload.price)}</div>
                               <div className="text-xs text-muted-foreground">{format(new Date(item.payload.time), 'MMM d, yyyy, h:mm:ss a')}</div>
                              </>
                          )}
                          hideLabel
                      />} 
                  />
                  <Area
                      dataKey="price"
                      type="natural"
                      fill="url(#chartFill)"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                  />
                  </AreaChart>
              </ChartContainer>
              ) : (
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed bg-muted/50">
                      <p className="text-muted-foreground">Historical chart data not available for this asset.</p>
                  </div>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
