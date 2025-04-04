
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockMarkets } from '@/services/marketData';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MarketCard from '@/components/MarketCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { getWalletInfo, connectWallet, disconnectWallet } from '@/services/walletService';

const SearchMarkets = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState('volume');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  // Update search params when query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);
  
  // Filter and sort markets
  const filteredMarkets = mockMarkets.filter(market => {
    // Filter by search query
    const matchesSearch = searchQuery
      ? market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (market.tags && market.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      : true;
    
    // Filter by category
    const matchesCategory = category === 'all' || market.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort results
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.volume - a.volume;
      case 'liquidity':
        return b.liquidity - a.liquidity;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'closing-soon':
        return new Date(a.resolutionDate).getTime() - new Date(b.resolutionDate).getTime();
      case 'yes-price':
        return b.yesPrice - a.yesPrice;
      case 'no-price':
        return b.noPrice - a.noPrice;
      default:
        return 0;
    }
  });
  
  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Search Markets</h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search markets, tags, or keywords..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:w-auto w-full"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Category</p>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="politics">Politics</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="climate">Climate</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Sort By</p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="volume">Highest Volume</SelectItem>
                      <SelectItem value="liquidity">Highest Liquidity</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="closing-soon">Closing Soon</SelectItem>
                      <SelectItem value="yes-price">Yes Price</SelectItem>
                      <SelectItem value="no-price">No Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            {filteredMarkets.length} {filteredMarkets.length === 1 ? 'market' : 'markets'} found
          </p>
          <Button variant="ghost" size="sm" onClick={() => setSortBy(sortBy === 'volume' ? 'liquidity' : 'volume')}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortBy === 'volume' ? 'Sort by Volume' : sortBy === 'liquidity' ? 'Sort by Liquidity' : `Sort by ${sortBy.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
          </Button>
        </div>
        
        {sortedMarkets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No markets found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => navigate('/create-market')}>
              Create a New Market
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchMarkets;
