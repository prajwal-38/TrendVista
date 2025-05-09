import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getMarketById, 
  generatePriceHistory, 
  generateOrderBook,
  PricePoint,
  OrderBook as OrderBookType,
  Market
} from '@/services/marketData';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import Layout from '@/components/Layout';
import PriceChart from '@/components/PriceChart';
import OrderBook from '@/components/OrderBook';
import TradeForm from '@/components/TradeForm';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  Clock, 
  DollarSign, 
  Activity, 
  Share2,
  ChevronLeft,
  Info,
  AlertTriangle,
  User,
  Plus,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import StockTradeForm from '@/components/StockTradeForm';
import { getUserPortfolio } from '@/services/walletService';
import MarketCard from '@/components/MarketCard';

// Get user-created markets from localStorage
const getUserCreatedMarkets = (): Market[] => {
  const storedMarkets = localStorage.getItem('userCreatedMarkets');
  return storedMarkets ? JSON.parse(storedMarkets) : [];
};

const MarketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const market = getMarketById(id || '');
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  const [userPosition, setUserPosition] = useState({ shares: 0 });
  const [userCreatedMarkets, setUserCreatedMarkets] = useState<Market[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  
  // Load user created markets
  useEffect(() => {
    const markets = getUserCreatedMarkets();
    console.log('User created markets:', markets);
    setUserCreatedMarkets(markets);
    setFilteredMarkets(markets);
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredMarkets(userCreatedMarkets);
    } else {
      const filtered = userCreatedMarkets.filter(market => 
        market.title.toLowerCase().includes(query) ||
        market.description.toLowerCase().includes(query) ||
        market.category.toLowerCase().includes(query) ||
        (market.tags && market.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      setFilteredMarkets(filtered);
    }
  };
  
  // Generate price history once without continuous updates
  useEffect(() => {
    if (market) {
      console.log('Market data:', market);
      
      // Generate initial price history with stable values
      const initialHistory = generatePriceHistory(60, 0.01, market.yesPrice);
      setPriceHistory(initialHistory);
      setOrderBook(generateOrderBook(market.yesPrice));
      
      // No interval setup - data remains static

    }
  }, [market]);
  
  // Load user position
  useEffect(() => {
    if (market) {
      const portfolio = getUserPortfolio();
      const position = portfolio.find(p => p.stockId === market.id);
      setUserPosition({ shares: position ? position.shares : 0 });
    }
  }, [market]);
  
  // Wallet connection functions
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
  
  // Refresh data after a trade
  const handleTradeComplete = async () => {
    const connected = await connectWallet();
    if (connected) {
      setWalletInfo(connected);
    }
    const portfolio = getUserPortfolio();
    const position = portfolio.find(p => p.stockId === market?.id);
    setUserPosition({ shares: position ? position.shares : 0 });
  };
  
  // Format volume with suffixes
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    } else {
      return `$${volume}`;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Share market details
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: market?.title,
        text: `Check out this prediction market: ${market?.title}`,
        url: window.location.href,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };
  
  if (!market) {
    return (
      <Layout 
        walletInfo={walletInfo}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      >
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-warning mb-4" />
          <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
          <p className="text-muted-foreground mb-6">The market you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout 
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="mb-6">
        <Link to="/" className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Markets
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{market.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{market.category}</Badge>
              {market.tags?.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">{market.description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <CalendarIcon className="h-3 w-3" />
              Resolution Date
            </span>
            <span className="font-medium">{formatDate(market.resolutionDate)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3" />
              Created On
            </span>
            <span className="font-medium">{formatDate(market.createdAt)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <DollarSign className="h-3 w-3" />
              Trading Volume
            </span>
            <span className="font-medium">{formatVolume(market.volume)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Activity className="h-3 w-3" />
              Liquidity
            </span>
            <span className="font-medium">{formatVolume(market.liquidity)}</span>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">YES Price</span>
              <div className="text-xl font-bold text-success">{(market.yesPrice * 100).toFixed(1)}¢</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <span className="text-lg font-bold text-success">{(market.yesPrice * 100).toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-danger/10 border-danger/20">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">NO Price</span>
              <div className="text-xl font-bold text-danger">{(market.noPrice * 100).toFixed(1)}¢</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger/20 flex items-center justify-center">
              <span className="text-lg font-bold text-danger">{(market.noPrice * 100).toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8 bg-primary/10 border-primary/20">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-muted-foreground">Current Trading Price</span>
            <div className="text-xl font-bold text-primary">
              {((market.currentPrice || market.yesPrice) * 100).toFixed(1)}¢ / {(market.currentPrice || market.yesPrice).toFixed(4)} ETH
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{((market.currentPrice || market.yesPrice) * 100).toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <PriceChart data={priceHistory} title="YES Price History" />
          <OrderBook orderBook={orderBook} />
        </div>
        <div>
          <TradeForm 
            market={market} 
            walletConnected={!!walletInfo?.connected}
            onConnectWallet={handleConnectWallet}
          />
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Resolution Details</CardTitle>
          </div>
          <CardDescription>How this market will be resolved</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This market will resolve to YES if the condition specified in the market question is met by the resolution date.
            Otherwise, it will resolve to NO. Resolution source: Official public records and trusted news sources.
          </p>
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-medium mb-2">Resolution Sources</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Official announcements by relevant authorities</li>
              <li>Publicly verifiable data sources</li>
              <li>Trusted news sources and financial records</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Your Created Markets</h2>
          </div>
          <Button variant="outline" onClick={() => navigate('/create-market')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Market
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your markets by title, description, category or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        {filteredMarkets && filteredMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map(userMarket => (
              <div key={userMarket.id} className="flex flex-col h-full">
                <Card className="flex-1 mb-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{userMarket.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{userMarket.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Current Price:</span>
                      <span className="font-medium">0.00 ETH</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{userMarket.category}</Badge>
                      {userMarket.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (walletInfo?.connected) {
                        navigate(`/market/${userMarket.id}`);
                      } else {
                        handleConnectWallet();
                      }
                    }}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (walletInfo?.connected) {
                        navigate(`/market/${userMarket.id}`);
                      } else {
                        handleConnectWallet();
                      }
                    }}
                  >
                    Sell
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <Card className="bg-muted/50">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Markets Found</h3>
              <p className="text-muted-foreground mb-4">
                No markets match your search for "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Markets Created Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first prediction market and start trading.
              </p>
              <Button onClick={() => navigate('/create-market')}>
                Create Market
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Trading Summary</CardTitle>
                <CardDescription>Current market statistics and trading information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Price:</span>
                    <span className="font-bold text-lg">
                      {(market.currentPrice || market.yesPrice).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">24h Change:</span>
                    <span className={`font-bold ${Math.random() > 0.5 ? 'text-success' : 'text-danger'}`}>
                      {(Math.random() * 10 - 5).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">24h Volume:</span>
                    <span className="font-medium">{formatVolume(market.volume * Math.random())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {walletInfo?.connected ? (
              <>
                <StockTradeForm 
                  stockId={market?.id || ''} 
                  stockName={market?.title || ''} 
                  currentPrice={market?.currentPrice || market?.yesPrice || 0.01}
                  onTradeComplete={handleTradeComplete}
                />
                
                {userPosition.shares > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Position</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Shares Owned:</span>
                          <span className="font-bold">{userPosition.shares}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Current Value:</span>
                          <span className="font-bold">
                            {(userPosition.shares * (market?.currentPrice || market?.yesPrice || 0.01)).toFixed(4)} ETH
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Connect Wallet to Trade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect your MetaMask wallet to buy and sell shares.
                  </p>
                  <Button onClick={handleConnectWallet} className="w-full">
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketDetail;
