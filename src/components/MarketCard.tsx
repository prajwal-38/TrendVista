
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/services/marketData';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Activity,
  Bitcoin,
  Landmark,
  Briefcase,
  Globe,
  Dumbbell,
  Zap
} from 'lucide-react';

interface MarketCardProps {
  market: Market;
  isCreatedMarket?: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto':
      return <Bitcoin className="h-12 w-12 mb-3 text-muted-foreground/50" />;
    case 'politics':
      return <Landmark className="h-12 w-12 mb-3 text-muted-foreground/50" />;
    case 'business':
      return <Briefcase className="h-12 w-12 mb-3 text-muted-foreground/50" />;
    case 'sports':
      return <Dumbbell className="h-12 w-12 mb-3 text-muted-foreground/50" />;
    case 'technology':
      return <Zap className="h-12 w-12 mb-3 text-muted-foreground/50" />;
    default:
      return <Globe className="h-12 w-12 mb-3 text-muted-foreground/50" />;
  }
};

const MarketCard: React.FC<MarketCardProps> = ({ market, isCreatedMarket = false }) => {
 
  const getTimeRemaining = () => {
    const now = new Date();
    const resolution = new Date(market.resolutionDate);
    const diffTime = Math.abs(resolution.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  // Format volume with k/m suffix
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    } else {
      return `$${volume}`;
    }
  };

  if (isCreatedMarket) {
    return (
      <Card 
        className="overflow-hidden h-full hover:shadow-md transition-shadow hover:border-primary/30 cursor-pointer bg-background border-border"
        onClick={() => window.location.href = `/market/${market.id}?view=graph`}
      >
        <CardContent className="p-0">
          <div className="relative">
              <div className="w-full h-40 bg-background flex flex-col items-center justify-center">
                {getCategoryIcon(market.category)}
                <span className="text-4xl font-bold text-muted-foreground/40">{market.category}</span>
              </div>
            
         
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {market.isPopular && (
                <Badge className="bg-info text-white">Popular</Badge>
              )}
              {market.isTrending && (
                <Badge className="bg-success text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {market.isNew && (
                <Badge className="bg-warning text-black">New</Badge>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-md mb-2 line-clamp-2">{market.title}</h3>
            
            <div className="flex justify-between items-center mb-3">
              <Badge variant="outline" className="text-xs font-normal">
                {market.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeRemaining()} left
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">YES Price</span>
                  <span className={`text-sm font-medium ${market.yesPrice > 0.5 ? 'text-success' : ''}`}>
                    {(market.yesPrice * 100).toFixed(0)}¢
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">NO Price</span>
                  <span className={`text-sm font-medium ${market.noPrice > 0.5 ? 'text-danger' : ''}`}>
                    {(market.noPrice * 100).toFixed(0)}¢
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{formatVolume(market.volume)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{formatVolume(market.liquidity)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/market/${market.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow hover:border-primary/30 cursor-pointer bg-background border-border">
        <CardContent className="p-0">
          <div className="relative">
              <div className="w-full h-40 bg-background flex flex-col items-center justify-center">
                {getCategoryIcon(market.category)}
                <span className="text-4xl font-bold text-muted-foreground/40">{market.category}</span>
              </div>
            
         
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {market.isPopular && (
                <Badge className="bg-info text-white">Popular</Badge>
              )}
              {market.isTrending && (
                <Badge className="bg-success text-white">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {market.isNew && (
                <Badge className="bg-warning text-black">New</Badge>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-md mb-2 line-clamp-2">{market.title}</h3>
            
            <div className="flex justify-between items-center mb-3">
              <Badge variant="outline" className="text-xs font-normal">
                {market.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {getTimeRemaining()} left
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">YES Price</span>
                  <span className={`text-sm font-medium ${market.yesPrice > 0.5 ? 'text-success' : ''}`}>
                    {(market.yesPrice * 100).toFixed(0)}¢
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">NO Price</span>
                  <span className={`text-sm font-medium ${market.noPrice > 0.5 ? 'text-danger' : ''}`}>
                    {(market.noPrice * 100).toFixed(0)}¢
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border mt-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{formatVolume(market.volume)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{formatVolume(market.liquidity)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MarketCard;
