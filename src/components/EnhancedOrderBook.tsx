
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { OrderBook as OrderBookType } from '@/services/marketData';
import { cancelOrder } from '@/services/contracts/PredictionMarket';
import { toast } from 'sonner';

interface EnhancedOrderBookProps {
  orderBook: OrderBookType;
  walletAddress?: string;
  onOrderSelect?: (price: number, isYes: boolean) => void;
}

const EnhancedOrderBook: React.FC<EnhancedOrderBookProps> = ({ 
  orderBook, 
  walletAddress,
  onOrderSelect
}) => {
  const [view, setView] = useState<'combined' | 'depth' | 'trades'>('combined');
  
  const { maxQuantity, midPrice, spread } = useMemo(() => {
    if (!orderBook.bids.length || !orderBook.asks.length) {
      return { maxQuantity: 1, midPrice: 0.5, spread: 0 };
    }
    
    const maxQuantity = Math.max(
      ...orderBook.bids.map(bid => bid.total || 0),
      ...orderBook.asks.map(ask => ask.total || 0)
    );
    
    const midPrice = (orderBook.bids[0].price + orderBook.asks[0].price) / 2;
    
    const spread = orderBook.asks[0].price - orderBook.bids[0].price;
    
    return { maxQuantity, midPrice, spread };
  }, [orderBook]);
  
  const handleCancelOrder = async (orderId: string) => {
    toast.info('Cancelling order...');
    try {
      const success = await cancelOrder(orderId);
      if (success) {
        toast.success('Order cancelled successfully');
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('An error occurred while cancelling the order');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order Book</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="combined" className="text-xs px-2">Combined</TabsTrigger>
              <TabsTrigger value="depth" className="text-xs px-2">Depth</TabsTrigger>
              <TabsTrigger value="trades" className="text-xs px-2">Trades</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <TabsContent value="combined" className="mt-0">
          <div className="bg-secondary/20 rounded-md p-2 mb-3 flex justify-between items-center text-xs">
            <span>Mid Price: <span className="font-semibold">{(midPrice * 100).toFixed(2)}¢</span></span>
            <span>Spread: <span className="font-semibold">{(spread * 100).toFixed(2)}¢ ({(spread / midPrice * 100).toFixed(2)}%)</span></span>
          </div>
          
          <div className="grid grid-cols-4 gap-1 text-xs font-semibold text-muted-foreground mb-2">
            <div>Price (¢)</div>
            <div className="text-right">Size</div>
            <div className="text-right">Total</div>
            <div className="text-right">Action</div>
          </div>
          
          <div className="space-y-1 mb-2">
            {orderBook.asks.slice().reverse().map((ask, i) => (
              <div 
                key={`ask-${i}`} 
                className="grid grid-cols-4 gap-1 text-xs items-center hover:bg-secondary/20 rounded cursor-pointer relative"
                onClick={() => onOrderSelect?.(ask.price, true)}
              >
                <div className="text-red-500 font-medium">{(ask.price * 100).toFixed(2)}</div>
                <div className="text-right">{ask.size.toLocaleString()}</div>
                <div className="text-right">{ask.total.toLocaleString()}</div>
                <div className="text-right">
                  {ask.orderId && walletAddress && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(ask.orderId as string);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                <div 
                  className="absolute left-0 h-full bg-red-500/10" 
                  style={{ width: `${(ask.total / maxQuantity) * 100}%`, zIndex: -1 }}
                />
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            {orderBook.bids.map((bid, i) => (
              <div 
                key={`bid-${i}`} 
                className="grid grid-cols-4 gap-1 text-xs items-center hover:bg-secondary/20 rounded cursor-pointer relative"
                onClick={() => onOrderSelect?.(bid.price, false)}
              >
                <div className="text-green-500 font-medium">{(bid.price * 100).toFixed(2)}</div>
                <div className="text-right">{bid.size.toLocaleString()}</div>
                <div className="text-right">{bid.total.toLocaleString()}</div>
                <div className="text-right">
                  {bid.orderId && walletAddress && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(bid.orderId!);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                <div 
                  className="absolute left-0 h-full bg-green-500/10" 
                  style={{ width: `${(bid.total / maxQuantity) * 100}%`, zIndex: -1 }}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="depth" className="mt-0">
          <div className="h-[300px] relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Depth chart visualization would go here
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trades" className="mt-0">
          <div className="grid grid-cols-4 gap-1 text-xs font-semibold text-muted-foreground mb-2">
            <div>Price (¢)</div>
            <div>Size</div>
            <div>Time</div>
            <div>Type</div>
          </div>
          
          <div className="text-center py-4 text-muted-foreground text-sm">
            Recent trades will appear here
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default React.memo(EnhancedOrderBook);

