// Final deployment script for PredictionMarket
const hardhat = require("hardhat");

async function main() {
  // Get the current blockchain timestamp
  const blockNumBefore = await hardhat.ethers.provider.getBlockNumber();
  const blockBefore = await hardhat.ethers.provider.getBlock(blockNumBefore);
  const currentTimestamp = blockBefore.timestamp;
  console.log("Current blockchain timestamp:", currentTimestamp);
  
  // Calculate future timestamps based on blockchain time
  // Add a large buffer to ensure it's definitely in the future (1 year + 1 day)
  const oneYearFromNow = currentTimestamp + (366 * 24 * 60 * 60); 
  console.log("Using resolution time:", oneYearFromNow);
  
  try {
    // Get the contract factory directly
    const PredictionMarket = await hardhat.ethers.getContractFactory("PredictionMarket");
    
    console.log("Deploying PredictionMarket...");
    
    // Deploy the contract without constructor arguments
    const predictionMarketDeployment = await PredictionMarket.deploy();
    
    // Wait for deployment to complete - use the correct method for your ethers version
    console.log("Waiting for deployment transaction to be mined...");
    await predictionMarketDeployment.deployed();
    
    // Get the deployed contract address
    const predictionMarketAddress = predictionMarketDeployment.address;
    console.log("PredictionMarket deployed to:", predictionMarketAddress);
    
    // Create sample markets with future timestamps
    console.log("Creating a sample market...");
    const tx = await predictionMarketDeployment.createMarket(
      "Will Bitcoin exceed $100,000 by the end of 2025?",
      "This market resolves to YES if the price of Bitcoin (BTC) exceeds $100,000 USD at any point before December 31, 2025, 23:59:59 UTC according to Coinbase Pro.",
      oneYearFromNow
    );
    
    await tx.wait();
    console.log("Sample market created!");
    
    // Create a few more sample markets
    console.log("Creating additional sample markets...");
    
    const sixMonthsFromNow = currentTimestamp + (180 * 24 * 60 * 60) + (24 * 60 * 60); // Add 1 day buffer
    const tx2 = await predictionMarketDeployment.createMarket(
      "Will Ethereum merge to Proof of Stake successfully?",
      "This market resolves to YES if Ethereum successfully transitions to Proof of Stake without major issues.",
      sixMonthsFromNow
    );
    await tx2.wait();
    
    const threeMonthsFromNow = currentTimestamp + (90 * 24 * 60 * 60) + (24 * 60 * 60); // Add 1 day buffer
    const tx3 = await predictionMarketDeployment.createMarket(
      "Will the US Federal Reserve raise interest rates?",
      "This market resolves to YES if the Federal Reserve raises the federal funds rate at any point in the next 3 months.",
      threeMonthsFromNow
    );
    await tx3.wait();
    
    console.log("All sample markets created!");
    
    // Save the contract address to a file for frontend use
    const fs = require("fs");
    const contractData = {
      "31337": predictionMarketAddress, // Hardhat local network
    };
    
    fs.writeFileSync(
      "contract-address.json",
      JSON.stringify(contractData, null, 2)
    );
    console.log("Contract address saved to contract-address.json");
    
  } catch (error) {
    console.error("Deployment error:", error);
    console.error("Error details:", error.toString());
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });