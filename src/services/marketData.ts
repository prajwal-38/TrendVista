
export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  resolutionDate: string;
  createdAt: string;
  volume: number;
  liquidity: number;
  yesPrice: number;
  noPrice: number;
  currentPrice?: number; // Make this optional but include it in the interface
  imageUrl?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  tags?: string[];
}

export interface PricePoint {
  time: number;
  price: number;
  volume?: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface UserPosition {
  marketId: string;
  marketTitle: string;
  outcome: 'YES' | 'NO';
  quantity: number;
  avgPrice: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
}

// Mock market data
export const mockMarkets: Market[] = [
  {
    id: "market-1",
    title: "Will Bitcoin exceed $100,000 by the end of 2025?",
    description: "This market resolves to YES if the price of Bitcoin (BTC) exceeds $100,000 USD at any point before December 31, 2025, 23:59:59 UTC according to Coinbase Pro.",
    category: "Crypto",
    resolutionDate: "2025-12-31",
    createdAt: "2023-11-15",
    volume: 240500,
    liquidity: 120000,
    yesPrice: 0.62,
    noPrice: 0.38,
    imageUrl: "/assets/bitcoin.png",
    isPopular: true,
    isTrending: true,
    tags: ["Bitcoin", "Crypto", "BTC", "Price"]
  },
  {
    id: "market-2",
    title: "Will Ethereum complete 'The Surge' upgrade before July 2025?",
    description: "This market resolves to YES if Ethereum successfully completes and implements 'The Surge' upgrade to the mainnet before July 1, 2025.",
    category: "Crypto",
    resolutionDate: "2025-06-30",
    createdAt: "2023-12-01",
    volume: 145000,
    liquidity: 87000,
    yesPrice: 0.71,
    noPrice: 0.29,
    isPopular: true,
    tags: ["Ethereum", "ETH", "Upgrade"]
  },
  {
    id: "market-3",
    title: "Will Donald Trump win the 2024 US Presidential Election?",
    description: "This market resolves to YES if Donald Trump is elected as the President of the United States in the 2024 election.",
    category: "Politics",
    resolutionDate: "2024-11-05",
    createdAt: "2023-10-20",
    volume: 540000,
    liquidity: 320000,
    yesPrice: 0.48,
    noPrice: 0.52,
    isTrending: true,
    tags: ["Politics", "USA", "Election"]
  },
  {
    id: "market-4",
    title: "Will Apple release a foldable device in 2025?",
    description: "This market resolves to YES if Apple releases a consumer foldable device (phone, tablet, or hybrid) before December 31, 2025.",
    category: "Technology",
    resolutionDate: "2025-12-31",
    createdAt: "2024-01-05",
    volume: 89000,
    liquidity: 42000,
    yesPrice: 0.33,
    noPrice: 0.67,
    isNew: true,
    tags: ["Apple", "Technology", "Foldable"]
  },
  {
    id: "market-5",
    title: "Will global average temperature exceed 1.5°C above pre-industrial levels in 2025?",
    description: "This market resolves to YES if the global average temperature in 2025 exceeds 1.5°C above pre-industrial levels according to NASA GISS.",
    category: "Climate",
    resolutionDate: "2026-01-31",
    createdAt: "2023-11-30",
    volume: 76000,
    liquidity: 38000,
    yesPrice: 0.58,
    noPrice: 0.42,
    tags: ["Climate", "Environment", "Temperature"]
  },
  {
    id: "market-6",
    title: "Will SpaceX successfully complete a human Mars mission by 2030?",
    description: "This market resolves to YES if SpaceX successfully lands humans on Mars and returns them safely to Earth before January 1, 2031.",
    category: "Space",
    resolutionDate: "2030-12-31",
    createdAt: "2023-12-10",
    volume: 125000,
    liquidity: 62000,
    yesPrice: 0.24,
    noPrice: 0.76,
    isPopular: true,
    tags: ["Space", "SpaceX", "Mars", "Exploration"]
  }
];

// Generate price history data for a market
export const generatePriceHistory = (days: number, volatility: number, initialPrice: number): PricePoint[] => {
  const now = Date.now();
  const history: PricePoint[] = [];
  let currentPrice = initialPrice;
  
  for (let i = days; i >= 0; i--) {
    const time = now - (i * 24 * 60 * 60 * 1000);
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = Math.max(0.01, Math.min(0.99, currentPrice + change));
    
    // Add some randomized volume
    const volume = Math.floor(Math.random() * 10000) + 1000;
    
    history.push({
      time,
      price: currentPrice,
      volume
    });
  }
  
  return history;
};

// Get market by ID
export const getMarketById = (id: string): Market | null => {
  const market = mockMarkets.find(m => m.id === id);
  
  if (market) {
    // Ensure currentPrice is set (use yesPrice if not available)
    return {
      ...market,
      currentPrice: market.currentPrice || market.yesPrice
    };
  }
  
  return null;
};

// Generate order book data
export const generateOrderBook = (currentPrice: number): OrderBook => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  let totalBid = 0;
  let totalAsk = 0;
  
  // Generate bid orders (buy YES)
  for (let i = 0; i < 15; i++) {
    const price = Math.max(0.01, currentPrice - (i * 0.01) - (Math.random() * 0.005));
    const size = Math.floor(Math.random() * 500) + 100;
    totalBid += size;
    bids.push({
      price: parseFloat(price.toFixed(3)),
      size,
      total: totalBid
    });
  }
  
  // Generate ask orders (buy NO)
  for (let i = 0; i < 15; i++) {
    const price = Math.min(0.99, currentPrice + (i * 0.01) + (Math.random() * 0.005));
    const size = Math.floor(Math.random() * 500) + 100;
    totalAsk += size;
    asks.push({
      price: parseFloat(price.toFixed(3)),
      size,
      total: totalAsk
    });
  }
  
  // Sort bids high to low, asks low to high
  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price);
  
  return { bids, asks };
};

// Simulate user positions
export const mockPositions: UserPosition[] = [
  {
    marketId: "market-1",
    marketTitle: "Will Bitcoin exceed $100,000 by the end of 2025?",
    outcome: "YES",
    quantity: 1000,
    avgPrice: 0.56,
    currentValue: 620, // Current price * quantity
    profit: 60, // (Current price - avg price) * quantity
    profitPercentage: 10.71
  },
  {
    marketId: "market-3",
    marketTitle: "Will Donald Trump win the 2024 US Presidential Election?",
    outcome: "NO",
    quantity: 500,
    avgPrice: 0.45,
    currentValue: 260, // Current price * quantity
    profit: 35, // (Current price - avg price) * quantity
    profitPercentage: 15.56
  },
  {
    marketId: "market-6",
    marketTitle: "Will SpaceX successfully complete a human Mars mission by 2030?",
    outcome: "NO",
    quantity: 200,
    avgPrice: 0.68,
    currentValue: 152, // Current price * quantity
    profit: 16, // (Current price - avg price) * quantity
    profitPercentage: 11.76
  }
];
