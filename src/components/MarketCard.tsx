
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/services/marketData';
import { TrendingUp, Clock, DollarSign, Activity } from 'lucide-react';

interface MarketCardProps {
  market: Market;
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  // Calculate time remaining
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

  return (
    <Link to={`/market/${market.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow hover:border-primary/30 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            {market.imageUrl ? (
              <img 
                src={market.imageUrl} 
                alt={market.title} 
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                <span className="text-3xl font-bold text-muted-foreground/30">{market.category}</span>
              </div>
            )}
            
            {/* Tags */}
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
