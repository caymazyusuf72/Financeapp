// Symbols are based on CoinGecko API IDs and Yahoo Finance tickers

export const DEFAULT_CURRENCIES = [
    { id: 'ethereum', name: 'EUR to USD', symbol: 'EUR' },
    { id: 'tether', name: 'GBP to USD', symbol: 'GBP' },
    { id: 'usd-coin', name: 'JPY to USD', symbol: 'JPY' },
    { id: 'binance-usd', name: 'AUD to USD', symbol: 'AUD' },
    { id: 'dai', name: 'CAD to USD', symbol: 'CAD' },
    // Note: These are crypto representations of currencies on CoinGecko
    // This is a limitation of using a crypto-focused API for forex.
];

export const DEFAULT_METALS = [
    { id: 'pax-gold', name: 'Gold', symbol: 'XAU' },
    { id: 'tether-gold', name: 'Silver', symbol: 'XAG' },
    { id: 'usd-coin', name: 'Platinum', symbol: 'XPT'}, 
    { id: 'dai', name: 'Palladium', symbol: 'XPD'}
     // Note: These are crypto representations of metals on CoinGecko
];

export const DEFAULT_CRYPTO = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
];

export const DEFAULT_STOCKS = [
    { symbol: '^GSPC', name: 'S&P 500'},
    { symbol: '^DJI', name: 'Dow Jones Industrial'},
    { symbol: '^IXIC', name: 'NASDAQ Composite'},
    { symbol: 'AAPL', name: 'Apple Inc.'}, 
    { symbol: 'AMZN', name: 'Amazon.com Inc.'},
    { symbol: 'NVDA', name: 'NVIDIA Corp.'},
    { symbol: 'TSLA', name: 'Tesla Inc.'},
];
