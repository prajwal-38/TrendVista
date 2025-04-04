
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMarkets } from '@/services/marketData';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, BarChart } from 'lucide-react';
import { formatAddress, getWalletInfo, connectWallet, disconnectWallet } from '@/services/walletService';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  
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
  
  // Sort markets by volume (highest first)
  const sortedMarkets = [...mockMarkets].sort((a, b) => b.volume - a.volume);
  
  // Top market by volume
  const topVolumeMarket = sortedMarkets[0];
  
  return (
    <Layout 
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
        
        {/* Top Volume Market Highlight */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Most Volumed Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 
              className="text-xl font-semibold mb-2 hover:text-primary cursor-pointer"
              onClick={() => navigate(`/market/${topVolumeMarket.id}`)}
            >
              {topVolumeMarket.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4 text-primary" />
                <span>Volume: ${topVolumeMarket.volume.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span>Liquidity: ${topVolumeMarket.liquidity.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Markets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Markets by Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Liquidity</TableHead>
                  <TableHead className="text-right">YES Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMarkets.slice(0, 10).map((market, index) => (
                  <TableRow 
                    key={market.id}
                    className="cursor-pointer hover:bg-secondary/20"
                    onClick={() => navigate(`/market/${market.id}`)}
                  >
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{market.title}</TableCell>
                    <TableCell className="text-right">${market.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${market.liquidity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(market.yesPrice * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;
