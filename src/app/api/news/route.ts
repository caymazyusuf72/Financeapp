import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// Revalidate every 24 hours
export const revalidate = 86400; 

const parser = new Parser();
const YAHOO_FINANCE_RSS_URL = 'https://finance.yahoo.com/rss/topstories';

export async function GET() {
  try {
    const feed = await parser.parseURL(YAHOO_FINANCE_RSS_URL);
    const newsItems = feed.items.slice(0, 10).map(item => ({
        guid: item.guid,
        title: item.title,
        link: item.link,
        isoDate: item.isoDate,
        contentSnippet: item.contentSnippet?.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
    }));

    return NextResponse.json({ news: newsItems });
  } catch (error) {
    console.error("Failed to fetch or parse RSS feed:", error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
