import { ethers } from 'ethers';

// ABI for the Prediction Market contract
export const PredictionMarketABI = [
  // Market functions
  "function createMarket(string memory title, string memory description, uint256 resolutionTime) public",
  "function resolveMarket(uint256 marketId, bool outcome) external",
  "function getMarketPrice(uint256 marketId) external view returns (uint256 yesPrice, uint256 noPrice)",
  "function getMarketLiquidity(uint256 marketId) external view returns (uint256)",
  
  // Order book functions
  "function placeOrder(uint256 marketId, bool isYes, uint256 price, uint256 amount) external payable returns (uint256)",
  "function cancelOrder(uint256 orderId) external",
  "function getMarketOrders(uint256 marketId, bool isYes) external view returns (uint256[] memory)",
  "function getOrderDetails(uint256 orderId) external view returns (address trader, uint256 marketId, bool isYes, uint256 price, uint256 amount, uint256 filled, bool isActive)",
  
  // User position functions
  "function getUserPosition(address user, uint256 marketId) external view returns (uint256 yesShares, uint256 noShares)",
  
  // Market data
  "function markets(uint256) external view returns (uint256 id, string title, string description, uint256 yesPrice, uint256 noPrice, uint256 liquidity, uint256 volume, bool resolved, bool outcome, address creator, uint256 creationTime, uint256 resolutionTime)",
  "function marketCount() external view returns (uint256)",
  
  // Events
  "event MarketCreated(uint256 indexed marketId, string title, address creator)",
  "event OrderPlaced(uint256 indexed orderId, uint256 indexed marketId, address indexed trader, bool isYes, uint256 price, uint256 amount)",
  "event OrderFilled(uint256 indexed orderId, uint256 indexed marketId, address indexed trader, bool isYes, uint256 price, uint256 amount)",
  "event OrderCancelled(uint256 indexed orderId)",
  "event SharesPurchased(address indexed buyer, uint256 indexed marketId, bool isYes, uint256 shares, uint256 cost)",
  "event MarketResolved(uint256 indexed marketId, bool outcome)"
];

// Contract address from deployment
export const PREDICTION_MARKET_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getPredictionMarketContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(PREDICTION_MARKET_ADDRESS, PredictionMarketABI, signer);
};

// Function to get all markets from the contract
export const getAllMarkets = async () => {
  try {
    const contract = await getPredictionMarketContract();
    const marketCount = await contract.marketCount();
    
    const markets = [];
    for (let i = 1; i <= marketCount.toNumber(); i++) {
      const market = await contract.markets(i);
      
      // Format the market data
      markets.push({
        id: market.id.toString(),
        title: market.title,
        description: market.description,
        yesPrice: market.yesPrice.toNumber() / 10000, // Convert from basis points to decimal
        noPrice: market.noPrice.toNumber() / 10000,
        liquidity: parseFloat(ethers.utils.formatEther(market.liquidity)),
        volume: parseFloat(ethers.utils.formatEther(market.volume)),
        resolved: market.resolved,
        outcome: market.outcome,
        creator: market.creator,
        creationTime: new Date(market.creationTime.toNumber() * 1000).toISOString(),
        resolutionTime: new Date(market.resolutionTime.toNumber() * 1000).toISOString()
      });
    }
    
    return markets;
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
};

// Function to get market orders
export const getMarketOrderBook = async (marketId) => {
  try {
    const contract = await getPredictionMarketContract();
    
    // Get YES orders
    const yesOrderIds = await contract.getMarketOrders(marketId, true);
    const yesOrders = await Promise.all(
      yesOrderIds.map(async (id) => {
        const order = await contract.getOrderDetails(id);
        return {
          id: id.toString(),
          trader: order.trader,
          marketId: order.marketId.toString(),
          isYes: order.isYes,
          price: order.price.toNumber() / 10000, // Convert from basis points to decimal
          amount: order.amount.toNumber(),
          filled: order.filled.toNumber(),
          isActive: order.isActive
        };
      })
    );
    
    // Get NO orders
    const noOrderIds = await contract.getMarketOrders(marketId, false);
    const noOrders = await Promise.all(
      noOrderIds.map(async (id) => {
        const order = await contract.getOrderDetails(id);
        return {
          id: id.toString(),
          trader: order.trader,
          marketId: order.marketId.toString(),
          isYes: order.isYes,
          price: order.price.toNumber() / 10000,
          amount: order.amount.toNumber(),
          filled: order.filled.toNumber(),
          isActive: order.isActive
        };
      })
    );
    
    // Format into bids and asks for the order book
    const bids = yesOrders
      .filter(order => order.isActive && order.filled < order.amount)
      .map(order => ({
        price: order.price,
        size: order.amount - order.filled,
        total: order.amount,
        orderId: order.id
      }))
      .sort((a, b) => b.price - a.price); // Sort highest to lowest
    
    const asks = noOrders
      .filter(order => order.isActive && order.filled < order.amount)
      .map(order => ({
        price: 1 - order.price, // Convert NO price to YES price equivalent
        size: order.amount - order.filled,
        total: order.amount,
        orderId: order.id
      }))
      .sort((a, b) => a.price - b.price); // Sort lowest to highest
    
    return { bids, asks };
  } catch (error) {
    console.error("Error fetching order book:", error);
    return { bids: [], asks: [] };
  }
};

// Function to place an order
export const placeOrder = async (marketId, isYes, price, amount, value) => {
  try {
    const contract = await getPredictionMarketContract();
    
    // Convert price from decimal to basis points (e.g., 0.75 -> 7500)
    const priceInBasisPoints = Math.floor(price * 10000);
    
    const tx = await contract.placeOrder(
      marketId,
      isYes,
      priceInBasisPoints,
      amount,
      { value: ethers.utils.parseEther(value.toString()) }
    );
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error placing order:", error);
    return false;
  }
};

// Function to cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const contract = await getPredictionMarketContract();
    const tx = await contract.cancelOrder(orderId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error cancelling order:", error);
    return false;
  }
};

// Function to create a new market
export const createNewMarket = async (title, description, resolutionTime) => {
  try {
    const contract = await getPredictionMarketContract();
    
    // Convert resolution time to Unix timestamp
    const resolutionTimestamp = Math.floor(new Date(resolutionTime).getTime() / 1000);
    
    const tx = await contract.createMarket(title, description, resolutionTimestamp);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error creating market:", error);
    return false;
  }
};