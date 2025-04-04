
import React, { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import { mockPositions, mockMarkets } from '@/services/marketData';
import Layout from '@/components/Layout';
import PortfolioCard from '@/components/PortfolioCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  BarChart,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { getUserPortfolio } from '@/services/walletService';
// Remove this import as we're now importing mockMarkets from marketData
// import { mockMarkets } from '@/data/mockMarkets';

const Portfolio = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  
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
  
  // Calculate portfolio stats
  const totalProfit = mockPositions.reduce((sum, pos) => sum + pos.profit, 0);
  const isProfitable = totalProfit >= 0;
  const profitPercentage = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;
  
  // Load portfolio data
  useEffect(() => {
    if (walletInfo?.connected) {
      const userPortfolio = getUserPortfolio();
      
      // Enrich with market data
      const enrichedPortfolio = userPortfolio.map(position => {
        const market = mockMarkets.find(m => m.id === position.stockId);
        return {
          ...position,
          marketName: market?.title || 'Unknown Market',
          price: market?.currentPrice || market?.yesPrice || 0,
          value: position.shares * (market?.currentPrice || market?.yesPrice || 0)
        };
      });
      
      setPortfolio(enrichedPortfolio);
      
      // Calculate total value
      const total = enrichedPortfolio.reduce((sum, position) => sum + position.value, 0);
      setTotalValue(total);
    }
  }, [walletInfo]);
  
  return (
    <Layout 
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
        <p className="text-muted-foreground">Track your positions and performance across all markets</p>
      </div>
      
      {!walletInfo?.connected ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
          <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Connect your wallet to view your portfolio, track your positions,
            and manage your prediction market investments.
          </p>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </div>
      ) : (
        <>
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Value</p>
                    <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={isProfitable ? "bg-success/5" : "bg-danger/5"}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full ${
                    isProfitable ? "bg-success/10" : "bg-danger/10"
                  } flex items-center justify-center`}>
                    {isProfitable ? (
                      <TrendingUp className="h-6 w-6 text-success" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-danger" />
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Profit/Loss</p>
                    <p className={`text-2xl font-bold ${
                      isProfitable ? "text-success" : "text-danger"
                    }`}>
                      {isProfitable ? "+" : ""}{totalProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">ROI</p>
                    <p className={`text-2xl font-bold ${
                      isProfitable ? "text-success" : "text-danger"
                    }`}>
                      {isProfitable ? "+" : ""}{profitPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Portfolio Positions */}
          <Tabs defaultValue="active" className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Positions</h2>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="active" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockPositions.map(position => (
                  <PortfolioCard key={position.marketId} position={position} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-0">
              <div className="min-h-[200px] flex flex-col items-center justify-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No closed positions yet</p>
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockPositions.map(position => (
                  <PortfolioCard key={position.marketId} position={position} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Trading History */}
          <Card>
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] flex flex-col items-center justify-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">No trading history yet</p>
                <Link to="/">
                  <Button variant="outline">Explore Markets</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default Portfolio;
