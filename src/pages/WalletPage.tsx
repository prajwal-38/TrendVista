import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WalletPage = () => {
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  
  // Connect wallet function
  const handleConnectWallet = async () => {
    const connected = await connectWallet();
    if (connected) {
      setWalletInfo(connected);
    }
  };
  
  // Disconnect wallet function
  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletInfo(null);
  };
  
  // Refresh wallet info
  const refreshWalletInfo = async () => {
    if (walletInfo?.connected) {
      const connected = await connectWallet();
      if (connected) {
        setWalletInfo(connected);
      }
    }
  };
  
  // Check for wallet connection on mount
  useEffect(() => {
    const storedWallet = getWalletInfo();
    if (storedWallet?.connected) {
      refreshWalletInfo();
    }
  }, []);

  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success("Address copied to clipboard");
    }
  };

  const viewOnExplorer = () => {
    if (walletInfo?.address) {
      let explorerUrl = 'https://etherscan.io/address/';
      
      // Adjust explorer URL based on network
      if (walletInfo.network.toLowerCase().includes('goerli')) {
        explorerUrl = 'https://goerli.etherscan.io/address/';
      } else if (walletInfo.network.toLowerCase().includes('sepolia')) {
        explorerUrl = 'https://sepolia.etherscan.io/address/';
      } else if (walletInfo.network.toLowerCase().includes('mumbai')) {
        explorerUrl = 'https://mumbai.polygonscan.com/address/';
      } else if (walletInfo.network.toLowerCase().includes('polygon')) {
        explorerUrl = 'https://polygonscan.com/address/';
      }
      
      window.open(`${explorerUrl}${walletInfo.address}`, '_blank');
    }
  };

  const isTestnet = walletInfo?.network ? 
    walletInfo.network.toLowerCase().includes('testnet') || 
    walletInfo.network.toLowerCase().includes('goerli') || 
    walletInfo.network.toLowerCase().includes('sepolia') || 
    walletInfo.network.toLowerCase().includes('mumbai') ||
    walletInfo.network.toLowerCase().includes('rinkeby') ||
    walletInfo.network.toLowerCase().includes('ropsten') : false;

  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        
        {walletInfo?.connected ? (
          <div className="space-y-8">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Wallet Details
                  <Button variant="ghost" size="icon" onClick={refreshWalletInfo} title="Refresh wallet details">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Connected to {walletInfo.network}
                  {isTestnet ? (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">Testnet</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">Mainnet</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Address</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
                      {walletInfo.address}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyAddress} title="Copy address">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={viewOnExplorer} title="View on explorer">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Balance</p>
                  <p className="text-2xl font-bold">{walletInfo.balance.toFixed(4)} ETH</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </CardFooter>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                variant="destructive" 
                onClick={handleDisconnectWallet}
                className="mt-4"
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No Wallet Connected</h3>
            <p className="text-muted-foreground mb-6">Connect your MetaMask wallet to get started</p>
            <Button onClick={handleConnectWallet} className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WalletPage;