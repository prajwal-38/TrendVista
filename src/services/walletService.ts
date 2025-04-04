
import { toast } from "sonner";

// Types
export interface WalletInfo {
  address: string;
  balance: number;
  network: string;
  connected: boolean;
  authToken?: string; // Add auth token for login
}

// Define ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Connect wallet function with authentication
export const connectWallet = async (authenticate = false): Promise<WalletInfo | null> => {
  try {
    // Check if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask is not installed. Please install MetaMask to connect your wallet.");
      window.open("https://metamask.io/download/", "_blank");
      return null;
    }
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length === 0) {
      toast.error("No accounts found. Please create an account in MetaMask.");
      return null;
    }
    
    // Get the first account
    const address = accounts[0];
    
    // Get account balance
    const balanceHex = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    // Convert balance from hex to decimal and from wei to ether
    const balanceInWei = parseInt(balanceHex, 16);
    const balanceInEther = balanceInWei / 1e18;
    
    // Get network information
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    let network = "Unknown Network";
    let isTestnet = false;
    
    // Map chain IDs to network names
    switch (chainId) {
      case "0x1":
        network = "Ethereum Mainnet";
        break;
      case "0x3":
        network = "Ropsten Testnet";
        isTestnet = true;
        break;
      case "0x4":
        network = "Rinkeby Testnet";
        isTestnet = true;
        break;
      case "0x5":
        network = "Goerli Testnet";
        isTestnet = true;
        break;
      case "0xaa36a7":
        network = "Sepolia Testnet";
        isTestnet = true;
        break;
      case "0x13881":
        network = "Mumbai Testnet (Polygon)";
        isTestnet = true;
        break;
      case "0x89":
        network = "Polygon Mainnet";
        break;
      default:
        network = `Chain ID: ${chainId}`;
    }
    
    // If not on a testnet, show a warning
    if (!isTestnet) {
      toast.warning("You are connected to a mainnet. For testing, we recommend using a testnet like Goerli or Sepolia.");
    }
    
    let authToken = undefined;
    
    // If authentication is requested, perform wallet signature
    if (authenticate) {
      try {
        // Create a message for the user to sign
        const timestamp = Date.now();
        const message = `Login to TrendVista: ${timestamp}`;
        
        // Request signature from user
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, address],
        });
        
        // In a real app, you would send this signature to your backend for verification
        // For this demo, we'll just create a simple token
        authToken = `${address}:${timestamp}:${signature.slice(0, 10)}`;
        
        toast.success("Authentication successful!");
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed. Please try again.");
        // Continue with connection but without authentication
      }
    }
    
    const connectedWallet: WalletInfo = {
      address,
      balance: balanceInEther,
      network,
      connected: true,
      authToken
    };
    
    // Save to localStorage
    localStorage.setItem('wallet', JSON.stringify(connectedWallet));
    
    // Set up event listeners for account and chain changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else {
        // User switched accounts, refresh the page to update
        window.location.reload();
      }
    });
    
    window.ethereum.on('chainChanged', () => {
      // Chain changed, refresh the page to update
      window.location.reload();
    });
    
    toast.success(`Wallet connected successfully to ${network}!`);
    return connectedWallet;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    toast.error("Failed to connect wallet. Please try again.");
    return null;
  }
};

// Disconnect wallet
export const disconnectWallet = (): void => {
  localStorage.removeItem('wallet');
  localStorage.removeItem('user_session');
  toast.success("Wallet disconnected");
};

// Get wallet information from localStorage
export const getWalletInfo = (): WalletInfo | null => {
  if (typeof window === 'undefined') return null;
  
  const walletData = localStorage.getItem('wallet');
  if (!walletData) return null;
  
  try {
    return JSON.parse(walletData) as WalletInfo;
  } catch (error) {
    console.error("Error parsing wallet data:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const walletInfo = getWalletInfo();
  return !!walletInfo?.authToken;
};

// Login with wallet
export const loginWithWallet = async (): Promise<boolean> => {
  try {
    const wallet = await connectWallet(true);
    if (wallet?.authToken) {
      // Store user session
      localStorage.setItem('user_session', JSON.stringify({
        address: wallet.address,
        loggedInAt: Date.now(),
        authToken: wallet.authToken
      }));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Login failed. Please try again.");
    return false;
  }
};

// Format address to display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Helper function to switch to a test network
export const switchToTestNetwork = async (networkName: string): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    toast.error("MetaMask is not installed.");
    return false;
  }

  try {
    let chainId: string;
    let params: any;

    switch (networkName.toLowerCase()) {
      case "goerli":
        chainId = "0x5";
        params = {
          chainId: "0x5",
          chainName: "Goerli Testnet",
          nativeCurrency: {
            name: "Goerli ETH",
            symbol: "ETH",
            decimals: 18
          },
          rpcUrls: ["https://goerli.infura.io/v3/"],
          blockExplorerUrls: ["https://goerli.etherscan.io"]
        };
        break;
      case "sepolia":
        chainId = "0xaa36a7";
        params = {
          chainId: "0xaa36a7",
          chainName: "Sepolia Testnet",
          nativeCurrency: {
            name: "Sepolia ETH",
            symbol: "ETH",
            decimals: 18
          },
          rpcUrls: ["https://sepolia.infura.io/v3/"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"]
        };
        break;
      case "mumbai":
        chainId = "0x13881";
        params = {
          chainId: "0x13881",
          chainName: "Mumbai Testnet (Polygon)",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
        };
        break;
      default:
        toast.error("Unknown network");
        return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
          return true;
        } catch (addError) {
          console.error("Error adding network:", addError);
          toast.error("Failed to add network to MetaMask");
          return false;
        }
      }
      console.error("Error switching network:", switchError);
      toast.error("Failed to switch network");
      return false;
    }
  } catch (error) {
    console.error("Error in switchToTestNetwork:", error);
    toast.error("An error occurred while switching networks");
    return false;
  }
};

// Buy stock with ETH
export const buyStock = async (
  stockId: string, 
  shares: number, 
  pricePerShare: number
): Promise<boolean> => {
  try {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask is not installed.");
      return false;
    }
    
    const walletInfo = getWalletInfo();
    if (!walletInfo?.connected) {
      toast.error("Please connect your wallet first.");
      return false;
    }
    
    // Calculate total cost in ETH
    const totalCost = shares * pricePerShare;
    
    // Check if user has enough balance
    if (walletInfo.balance < totalCost) {
      toast.error(`Insufficient balance. You need ${totalCost.toFixed(4)} ETH to complete this purchase.`);
      return false;
    }
    
    // Convert ETH to Wei for the transaction
    const totalCostWei = `0x${Math.floor(totalCost * 1e18).toString(16)}`;
    
    // In a real app, this would be the contract address
    const marketContractAddress = "0x0000000000000000000000000000000000000000";
    
    // Request transaction approval from user
    toast.info("Please confirm the transaction in MetaMask...");
    
    // Send transaction
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: walletInfo.address,
        to: marketContractAddress,
        value: totalCostWei,
        // In a real app, you would include contract method data here
        data: `0x`, // Placeholder for contract interaction
      }],
    });
    
    // For demo purposes, we'll simulate a successful transaction
    // In a real app, you would wait for transaction confirmation
    
    // Update local storage with purchase info
    const purchases = JSON.parse(localStorage.getItem('stock_purchases') || '[]');
    purchases.push({
      id: Date.now(),
      stockId,
      shares,
      pricePerShare,
      totalCost,
      transactionHash,
      timestamp: Date.now(),
      status: 'completed'
    });
    localStorage.setItem('stock_purchases', JSON.stringify(purchases));
    
    // Update wallet balance (in a real app this would happen automatically)
    const updatedWallet = {
      ...walletInfo,
      balance: walletInfo.balance - totalCost
    };
    localStorage.setItem('wallet', JSON.stringify(updatedWallet));
    
    toast.success(`Successfully purchased ${shares} shares for ${totalCost.toFixed(4)} ETH`);
    return true;
  } catch (error) {
    console.error("Error buying stock:", error);
    toast.error("Transaction failed. Please try again.");
    return false;
  }
};

// Sell stock for ETH
export const sellStock = async (
  stockId: string, 
  shares: number, 
  pricePerShare: number
): Promise<boolean> => {
  try {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask is not installed.");
      return false;
    }
    
    const walletInfo = getWalletInfo();
    if (!walletInfo?.connected) {
      toast.error("Please connect your wallet first.");
      return false;
    }
    
    // Calculate total value in ETH
    const totalValue = shares * pricePerShare;
    
    // Check if user owns the shares
    const purchases = JSON.parse(localStorage.getItem('stock_purchases') || '[]');
    const ownedShares = purchases
      .filter((p: any) => p.stockId === stockId && p.status === 'completed')
      .reduce((total: number, p: any) => total + p.shares, 0);
    
    if (ownedShares < shares) {
      toast.error(`You don't own enough shares. You currently have ${ownedShares} shares.`);
      return false;
    }
    
    // In a real app, this would be the contract address
    const marketContractAddress = "0x0000000000000000000000000000000000000000";
    
    // Request transaction approval from user
    toast.info("Please confirm the transaction in MetaMask...");
    
    // Send transaction (in a real app, this would call a contract method)
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: walletInfo.address,
        to: marketContractAddress,
        // In a real app, you would include contract method data here
        data: `0x`, // Placeholder for contract interaction
      }],
    });
    
    // For demo purposes, we'll simulate a successful transaction
    // In a real app, you would wait for transaction confirmation
    
    // Update local storage with sale info
    const sales = JSON.parse(localStorage.getItem('stock_sales') || '[]');
    sales.push({
      id: Date.now(),
      stockId,
      shares,
      pricePerShare,
      totalValue,
      transactionHash,
      timestamp: Date.now(),
      status: 'completed'
    });
    localStorage.setItem('stock_sales', JSON.stringify(sales));
    
    // Update wallet balance (in a real app this would happen automatically)
    const updatedWallet = {
      ...walletInfo,
      balance: walletInfo.balance + totalValue
    };
    localStorage.setItem('wallet', JSON.stringify(updatedWallet));
    
    toast.success(`Successfully sold ${shares} shares for ${totalValue.toFixed(4)} ETH`);
    return true;
  } catch (error) {
    console.error("Error selling stock:", error);
    toast.error("Transaction failed. Please try again.");
    return false;
  }
};

// Get user's stock portfolio
export const getUserPortfolio = () => {
  const purchases = JSON.parse(localStorage.getItem('stock_purchases') || '[]');
  const sales = JSON.parse(localStorage.getItem('stock_sales') || '[]');
  
  // Calculate net positions
  const portfolio: Record<string, { stockId: string, shares: number }> = {};
  
  // Add purchases
  purchases.forEach((purchase: any) => {
    if (purchase.status === 'completed') {
      if (!portfolio[purchase.stockId]) {
        portfolio[purchase.stockId] = { stockId: purchase.stockId, shares: 0 };
      }
      portfolio[purchase.stockId].shares += purchase.shares;
    }
  });
  
  // Subtract sales
  sales.forEach((sale: any) => {
    if (sale.status === 'completed') {
      if (portfolio[sale.stockId]) {
        portfolio[sale.stockId].shares -= sale.shares;
      }
    }
  });
  
  // Convert to array and filter out zero positions
  return Object.values(portfolio).filter(position => position.shares > 0);
};
