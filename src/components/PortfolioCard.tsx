
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { UserPosition } from '@/services/marketData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioCardProps {
  position: UserPosition;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ position }) => {
  const isProfitable = position.profit > 0;
  
  return (
    <Link to={`/market/${position.marketId}`}>
      <Card className="hover:shadow-md transition-shadow hover:border-primary/30 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-1">{position.marketTitle}</h3>
            <div className={`px-2 py-1 rounded-md text-xs font-semibold ${
              position.outcome === 'YES' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
            }`}>
              {position.outcome}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="text-sm">{position.quantity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Price</p>
              <p className="text-sm">{(position.avgPrice * 100).toFixed(1)}¢</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Current Value</p>
              <p className="text-sm font-medium">${position.currentValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit/Loss</p>
              <div className={`flex items-center ${
                isProfitable ? 'text-success' : 'text-danger'
              }`}>
                {isProfitable ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <p className="text-sm font-medium">
                  {isProfitable ? '+' : ''}{position.profit.toLocaleString()} ({position.profitPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PortfolioCard;
