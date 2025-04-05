
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderBook as OrderBookType } from '@/services/marketData';

interface OrderBookProps {
  orderBook: OrderBookType;
}

const OrderBook: React.FC<OrderBookProps> = ({ orderBook }) => {
  const maxQuantity = Math.max(
    ...orderBook.bids.map(bid => bid.total),
    ...orderBook.asks.map(ask => ask.total)
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-1 text-xs font-semibold text-muted-foreground mb-2">
          <div>Price (¢)</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>
        
       
        <div className="mb-4 max-h-[200px] overflow-y-auto scrollbar-thin">
          {orderBook.asks.slice().reverse().map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 gap-1 text-xs relative h-6 items-center">
              <div
                className="absolute right-0 h-full bg-danger/10"
                style={{
                  width: `${(ask.total / maxQuantity) * 100}%`,
                  maxWidth: '100%'
                }}
              />
              <div className="z-10 text-danger">{(ask.price * 100).toFixed(1)}</div>
              <div className="z-10 text-right">{ask.size.toLocaleString()}</div>
              <div className="z-10 text-right">{ask.total.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="my-2 py-2 px-3 bg-secondary/20 rounded text-xs flex justify-between items-center">
          <span>Spread</span>
          <span className="font-medium">
            {(
              (Math.min(...orderBook.asks.map(a => a.price)) - 
               Math.max(...orderBook.bids.map(b => b.price))) * 100
            ).toFixed(1)}¢ ({
              ((Math.min(...orderBook.asks.map(a => a.price)) - 
                Math.max(...orderBook.bids.map(b => b.price))) /
                Math.max(...orderBook.bids.map(b => b.price)) * 100
            ).toFixed(2)}%
          </span>
        </div>

        <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
          {orderBook.bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 gap-1 text-xs relative h-6 items-center">
              <div
                className="absolute right-0 h-full bg-success/10"
                style={{
                  width: `${(bid.total / maxQuantity) * 100}%`,
                  maxWidth: '100%'
                }}
              />
              <div className="z-10 text-success">{(bid.price * 100).toFixed(1)}</div>
              <div className="z-10 text-right">{bid.size.toLocaleString()}</div>
              <div className="z-10 text-right">{bid.total.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
