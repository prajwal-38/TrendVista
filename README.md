# Trend Vista - Decentralized Prediction Market

![image](https://github.com/user-attachments/assets/44d78c46-d684-4879-8dd2-9439bb663789)

https://trend-vista-flax.vercel.app/

A next-generation decentralized prediction market that empowers individuals to trade insights on future events with unmatched transparency and efficiency.

## Features functionality

- Connect with MetaMask wallet
- Browse prediction markets
- Trade YES/NO positions
- View order book and market depth
- Track portfolio performance

## Quick Start

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```
# Trend Vista: Prediction Market Platform Guide

Welcome to Trend Vista, a decentralized prediction market platform! This guide will help you understand the project structure, set it up, and run it locally, even if you're new to blockchain technology.

## What is This Project?

Trend Vista is a platform where users can:
- Trade on the outcomes of future events (like "Will Bitcoin exceed $100,000?")
- Create their own prediction markets for others to trade on
- Connect their cryptocurrency wallet to place trades
- Track their portfolio of predictions

Think of it like a stock market, but instead of trading company shares, you're trading on the probability of future events happening.

## Prerequisites

Before you start, make sure you have:

1. **Node.js** (v16 or newer) - Download from nodejs.org
2. **MetaMask browser extension** - Download from metamask.io/download
3. **Git** (optional, for cloning) - Download from git-scm.com/downloads

## Project Setup

### Step 1: Install Dependencies

Open a terminal/command prompt in the project directory and run:
```bash
npm install --legacy-peer-deps
```

This will install all the required packages for the project.

### Step 2: Set Up MetaMask

1. Install the MetaMask extension in your browser
2. Create a wallet (or import an existing one)
3. Make sure you have some test ETH (we'll cover this later)

### Step 3: Start the Local Blockchain

This project uses Hardhat to run a local blockchain for development:

npx hardhat node


This will start a local blockchain and create several test accounts with ETH.

### Step 4: Deploy the Smart Contract

In a new terminal window (keep the blockchain running), deploy the contract:

npx hardhat run scripts/deploy-v6-fixed.cjs --network localhost


This will:
- Deploy the PredictionMarket smart contract to your local blockchain
- Create some sample prediction markets
- Save the contract address to `contract-address.json`

### Step 5: Start the Frontend

In another terminal window, start the development server:

npm run dev 


This will start the web application, typically at http://localhost:5173

## Understanding the Project Structure

### Key Directories

- `/contracts`: Contains the Solidity smart contracts
  - `PredictionMarket.sol`: The main contract that handles markets, orders, and trades
  
- `/src`: Contains the frontend React application
  - `/components`: UI components like Navbar, OrderBook, TradeForm
  - `/pages`: Main application pages (Home, MarketDetail, Portfolio)
  - `/services`: Backend services for wallet connection and market data

### Key Files

- `hardhat.config.cjs`: Configuration for the Hardhat blockchain
- `src/App.tsx`: Main application component with routing
- `src/services/walletService.ts`: Handles wallet connection and blockchain interactions
- `src/services/marketData.ts`: Provides market data and interfaces

## How to Use the Application

### 1. Connect Your Wallet

When you first open the app, you'll need to connect your MetaMask wallet:
- Click "Connect Wallet" in the top right corner
- Approve the connection in the MetaMask popup

### 2. Browse Prediction Markets

On the home page, you'll see a list of available prediction markets. Each market shows:
- The question (e.g., "Will Bitcoin exceed $100,000?")
- Current YES and NO prices (representing probability)
- Trading volume and liquidity

### 3. Trade on a Market

1. Click on a market to view details
2. In the trade form:
   - Choose YES or NO (depending on what you think will happen)
   - Enter the amount you want to trade
   - Click "Buy YES" or "Buy NO"
3. Confirm the transaction in MetaMask

### 4. View Your Portfolio

Click "Portfolio" in the navigation to see:
- Your current positions
- Profit/loss on each position
- Total portfolio value

### 5. Create a Market (Advanced)

If you want to create your own prediction market:
1. Click "Create Market" in the navigation
2. Fill in the market details (question, description, resolution date)
3. Submit and confirm the transaction

## Blockchain Concepts for Beginners

### What is a Blockchain?

A blockchain is a distributed database that maintains a continuously growing list of records (blocks) that are secured using cryptography. For this project, we're using Ethereum, which adds smart contract functionality.

### What is a Smart Contract?

A smart contract is a self-executing contract with the terms directly written into code. Our PredictionMarket.sol is a smart contract that handles:
- Creating markets
- Matching buy and sell orders
- Tracking user positions
- Resolving markets when the outcome is known

### What is a Wallet?

A cryptocurrency wallet (like MetaMask) stores your private keys and allows you to interact with the blockchain. In our app, you use your wallet to:
- Connect to the application
- Sign transactions (like placing trades)
- Pay for transaction fees (gas)

### What is ETH?

ETH (Ether) is the cryptocurrency of the Ethereum blockchain. You need a small amount of ETH to pay for transaction fees. For development, we're using a local blockchain with test ETH that has no real value.

## Troubleshooting

### MetaMask Not Connecting

1. Make sure MetaMask is installed and unlocked
2. Ensure you're on the correct network (Localhost 8545)
3. Try refreshing the page

### Transactions Failing

1. Check that you have enough test ETH for gas fees
2. Make sure you're connected to the correct network
3. Try increasing the gas limit in MetaMask

### Contract Not Found

If you see errors about the contract not being found:
1. Make sure you ran the deployment script
2. Check that `contract-address.json` was created
3. Verify you're connected to the same network where you deployed
