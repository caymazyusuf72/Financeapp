"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { summarizeMarket } from "@/ai/flows/summarize-market-flow";
import { useToast } from "@/hooks/use-toast";
import type { Asset } from "@/lib/types";
import { fetchAllAssets } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketSummary() {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setSummary("");
    try {
      const assetsData = await fetchAllAssets();
      const allAssets = Object.values(assetsData).flat();
      if (allAssets.length === 0) {
        throw new Error("No market data available to summarize.");
      }
      const result = await summarizeMarket({ assets: allAssets });
      setSummary(result);
    } catch (error) {
      console.error("Failed to summarize market:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate market summary. Please try again later.",
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isLoading}>
        <Sparkles className="mr-2 h-4 w-4" />
        AI Market Summary
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Market Summary
            </DialogTitle>
            <DialogDescription>
              An AI-generated overview of the current market conditions based on real-time data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm text-foreground">{summary}</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
