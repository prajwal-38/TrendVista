
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Search, 
  ChevronRight, 
  LineChart,
  Clock,
  DollarSign,
  Percent,
  BarChart,
  Trophy,
  Wallet
} from 'lucide-react';
import MarketCard from '@/components/MarketCard';
import { mockMarkets } from '@/services/marketData';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import Layout from '@/components/Layout';

const Index = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  const [searchQuery, setSearchQuery] = useState('');
  

  const handleConnectWallet = async () => {
    const connected = await connectWallet();
    if (connected) {
      setWalletInfo(connected);
    }
  };
  

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletInfo(null);
  };
  

  const trendingMarkets = mockMarkets.filter(market => market.isTrending);
  const popularMarkets = mockMarkets.filter(market => market.isPopular);
  
 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const mostVolumedMarket = [...mockMarkets].sort((a, b) => b.volume - a.volume)[0];
  
  return (
    <Layout 
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      {/* Hero Section */}
      <section className="py-12 px-4 rounded-xl bg-gradient-to-br from-secondary/70 to-secondary mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Predict. Trade. Win.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Trade on the outcome of real-world events with blockchain-powered prediction markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate('/market/market-1')}
            >
              Start Trading
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/how-it-works')}
            >
              How It Works
            </Button>
          </div>
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search markets..." 
              className="pl-10 py-6 bg-background/70 backdrop-blur-sm border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </section>
      
      {/* Most Volumed Market */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-warning" />
            <h2 className="text-2xl font-bold">Most Volumed Market</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/leaderboard')}>
            View Leaderboard <Trophy className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <MarketCard key={mostVolumedMarket.id} market={mostVolumedMarket} />
        </div>
      </section>
      
      {/* Market Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Markets</p>
              <p className="text-2xl font-bold">500+</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Trading Volume</p>
              <p className="text-2xl font-bold">$1.2M+</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Avg. Accuracy</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Markets Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="text-2xl font-bold">Trending Markets</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/search')}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>
      
      {/* Popular Markets Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Popular Markets</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/search')}>
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularMarkets.map(market => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-primary/20 to-info/20 p-8 md:p-12 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start trading?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Connect your wallet and start trading on the most exciting prediction markets platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!walletInfo?.connected ? (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/market/market-1')}
              >
                Start Trading
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/create-market')}
            >
              Create Market
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
