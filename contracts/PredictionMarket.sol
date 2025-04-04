// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PredictionMarket {
    struct Order {
        uint256 id;
        address trader;
        uint256 marketId;
        bool isYes;
        uint256 price;  // Price in basis points (1/100 of a percent), e.g. 5000 = 50%
        uint256 amount;
        uint256 filled;
        bool isActive;
    }
    
    struct Market {
        uint256 id;
        string title;
        string description;
        uint256 yesPrice;
        uint256 noPrice;
        uint256 liquidity;
        uint256 volume;
        bool resolved;
        bool outcome;
        address creator;
        uint256 creationTime;
        uint256 resolutionTime;
    }
    
    struct Position {
        uint256 yesShares;
        uint256 noShares;
    }
    
    // Market data
    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    
    // Order book data
    uint256 public orderCount;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => uint256[]) public marketYesOrders;
    mapping(uint256 => uint256[]) public marketNoOrders;
    
    // User positions
    mapping(address => mapping(uint256 => Position)) public userPositions;
    
    // Events
    event MarketCreated(uint256 indexed marketId, string title, address creator);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed marketId, address indexed trader, bool isYes, uint256 price, uint256 amount);
    event OrderFilled(uint256 indexed orderId, uint256 indexed marketId, address indexed trader, bool isYes, uint256 price, uint256 amount);
    event OrderCancelled(uint256 indexed orderId);
    event SharesPurchased(address indexed buyer, uint256 indexed marketId, bool isYes, uint256 shares, uint256 cost);
    event MarketResolved(uint256 indexed marketId, bool outcome);
    
    constructor() {
        // Initialize with empty state - no markets created in constructor
        marketCount = 0;
        orderCount = 0;
    }
    
    function createMarket(string memory title, string memory description, uint256 resolutionTime) public {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(resolutionTime > block.timestamp, "Resolution time must be in the future");
        
        marketCount++;
        markets[marketCount] = Market({
            id: marketCount,
            title: title,
            description: description,
            yesPrice: 5000, // Starting at 50% (5000 basis points)
            noPrice: 5000,  // Starting at 50% (5000 basis points)
            liquidity: 1 ether,
            volume: 0,
            resolved: false,
            outcome: false,
            creator: msg.sender,
            creationTime: block.timestamp,
            resolutionTime: resolutionTime
        });
        
        emit MarketCreated(marketCount, title, msg.sender);
    }
    
    function placeOrder(uint256 marketId, bool isYes, uint256 price, uint256 amount) external payable returns (uint256) {
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        require(!markets[marketId].resolved, "Market already resolved");
        require(price > 0 && price < 10000, "Price must be between 0 and 100%");
        require(msg.value > 0, "Must send ETH to place order");
        
        // Calculate the maximum amount of shares that can be bought with the sent ETH
        uint256 maxShares = (msg.value * 10000) / price;
        uint256 shares = amount > 0 && amount < maxShares ? amount : maxShares;
        
        orderCount++;
        orders[orderCount] = Order({
            id: orderCount,
            trader: msg.sender,
            marketId: marketId,
            isYes: isYes,
            price: price,
            amount: shares,
            filled: 0,
            isActive: true
        });
        
        // Add to the appropriate order list
        if (isYes) {
            marketYesOrders[marketId].push(orderCount);
        } else {
            marketNoOrders[marketId].push(orderCount);
        }
        
        emit OrderPlaced(orderCount, marketId, msg.sender, isYes, price, shares);
        
        // Try to match with existing orders
        matchOrders(orderCount);
        
        return orderCount;
    }
    
    function matchOrders(uint256 orderId) internal {
        Order storage order = orders[orderId];
        if (!order.isActive || order.filled >= order.amount) return;
        
        uint256 marketId = order.marketId;
        bool isYes = order.isYes;
        
        // Get the opposite order list
        uint256[] storage oppositeOrders = isYes ? marketNoOrders[marketId] : marketYesOrders[marketId];
        
        for (uint i = 0; i < oppositeOrders.length && order.filled < order.amount; i++) {
            uint256 oppositeOrderId = oppositeOrders[i];
            Order storage oppositeOrder = orders[oppositeOrderId];
            
            // Skip if not active or fully filled
            if (!oppositeOrder.isActive || oppositeOrder.filled >= oppositeOrder.amount) continue;
            
            // Check if prices are compatible (YES price + NO price <= 100%)
            if (order.price + oppositeOrder.price <= 10000) {
                // Calculate how many shares can be matched
                uint256 remainingOrder = order.amount - order.filled;
                uint256 remainingOpposite = oppositeOrder.amount - oppositeOrder.filled;
                uint256 matchAmount = remainingOrder < remainingOpposite ? remainingOrder : remainingOpposite;
                
                // Update filled amounts
                order.filled += matchAmount;
                oppositeOrder.filled += matchAmount;
                
                // Update user positions
                Position storage buyerPosition = userPositions[order.trader][marketId];
                Position storage sellerPosition = userPositions[oppositeOrder.trader][marketId];
                
                if (isYes) {
                    buyerPosition.yesShares += matchAmount;
                    sellerPosition.noShares += matchAmount;
                } else {
                    buyerPosition.noShares += matchAmount;
                    sellerPosition.yesShares += matchAmount;
                }
                
                // Update market data
                Market storage market = markets[marketId];
                market.volume += matchAmount * (order.price + oppositeOrder.price) / 10000;
                
                // Update market price based on last trade
                if (isYes) {
                    market.yesPrice = order.price;
                    market.noPrice = 10000 - order.price;
                } else {
                    market.noPrice = order.price;
                    market.yesPrice = 10000 - order.price;
                }
                
                // Emit events
                emit OrderFilled(order.id, marketId, order.trader, isYes, order.price, matchAmount);
                emit OrderFilled(oppositeOrder.id, marketId, oppositeOrder.trader, !isYes, oppositeOrder.price, matchAmount);
                
                // Check if opposite order is fully filled
                if (oppositeOrder.filled >= oppositeOrder.amount) {
                    oppositeOrder.isActive = false;
                }
            }
        }
        
        // Check if order is fully filled
        if (order.filled >= order.amount) {
            order.isActive = false;
        }
    }
    
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.trader == msg.sender, "Not your order");
        require(order.isActive, "Order not active");
        
        order.isActive = false;
        
        // Calculate refund amount for unfilled portion
        uint256 unfilled = order.amount - order.filled;
        uint256 refundAmount = (unfilled * order.price) / 10000;
        
        // Refund the unfilled amount
        if (refundAmount > 0) {
            payable(msg.sender).transfer(refundAmount);
        }
        
        emit OrderCancelled(orderId);
    }
    
    function getMarketOrders(uint256 marketId, bool isYes) external view returns (uint256[] memory) {
        return isYes ? marketYesOrders[marketId] : marketNoOrders[marketId];
    }
    
    function getOrderDetails(uint256 orderId) external view returns (
        address trader,
        uint256 marketId,
        bool isYes,
        uint256 price,
        uint256 amount,
        uint256 filled,
        bool isActive
    ) {
        Order storage order = orders[orderId];
        return (
            order.trader,
            order.marketId,
            order.isYes,
            order.price,
            order.amount,
            order.filled,
            order.isActive
        );
    }
    
    function resolveMarket(uint256 marketId, bool outcome) external {
        // In a real implementation, this would be restricted to an oracle or governance
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        require(!markets[marketId].resolved, "Market already resolved");
        
        markets[marketId].resolved = true;
        markets[marketId].outcome = outcome;
        
        emit MarketResolved(marketId, outcome);
    }
    
    function getMarketPrice(uint256 marketId) external view returns (uint256 yesPrice, uint256 noPrice) {
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        Market storage market = markets[marketId];
        return (market.yesPrice, market.noPrice);
    }
    
    function getMarketLiquidity(uint256 marketId) external view returns (uint256) {
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        return markets[marketId].liquidity;
    }
    
    function getUserPosition(address user, uint256 marketId) external view returns (uint256 yesShares, uint256 noShares) {
        Position storage position = userPositions[user][marketId];
        return (position.yesShares, position.noShares);
    }
}