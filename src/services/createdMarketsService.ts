import { Market } from './marketData';

// Get created markets from local storage
export const getCreatedMarkets = (): Market[] => {
  const createdMarkets = localStorage.getItem('created_markets');
  return createdMarkets ? JSON.parse(createdMarkets) : [];
};

// Add a new market to created markets
export const addCreatedMarket = (market: Market): void => {
  const createdMarkets = getCreatedMarkets();
  createdMarkets.push(market);
  localStorage.setItem('created_markets', JSON.stringify(createdMarkets));
};

// Remove a market from created markets
export const removeCreatedMarket = (marketId: string): void => {
  const createdMarkets = getCreatedMarkets();
  const updatedMarkets = createdMarkets.filter(market => market.id !== marketId);
  localStorage.setItem('created_markets', JSON.stringify(updatedMarkets));
};