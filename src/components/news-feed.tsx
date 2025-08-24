
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";

async function fetchNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      const newsData = await fetchNews();
      setNews(newsData);
      setLoading(false);
    };
    getNews();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Financial News</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">News could not be loaded at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="font-headline">Financial News</CardTitle>
        <CardDescription>Latest headlines from Yahoo Finance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.guid} className="space-y-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">
                {item.title}
              </a>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.contentSnippet}</p>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.isoDate), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
