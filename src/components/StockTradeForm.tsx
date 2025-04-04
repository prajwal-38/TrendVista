import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buyStock, sellStock, getWalletInfo, getUserPortfolio } from '@/services/walletService';
import { toast } from 'sonner';

interface StockTradeFormProps {
  stockId: string;
  stockName: string;
  currentPrice: number;
  onTradeComplete?: () => void;
}

const StockTradeForm: React.FC<StockTradeFormProps> = ({ 
  stockId, 
  stockName, 
  currentPrice,
  onTradeComplete
}) => {
  const [tab, setTab] = useState('buy');
  const [shares, setShares] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [ownedShares, setOwnedShares] = useState(0);
  
  // Calculate total cost/value
  const sharesNum = parseFloat(shares) || 0;
  const totalAmount = sharesNum * currentPrice;
  
  // Load wallet balance and owned shares
  useEffect(() => {
    const wallet = getWalletInfo();
    if (wallet) {
      setWalletBalance(wallet.balance);
    }
    
    // Get owned shares for this stock
    const portfolio = getUserPortfolio();
    const position = portfolio.find(p => p.stockId === stockId);
    setOwnedShares(position ? position.shares : 0);
  }, [stockId]);
  
  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setShares(value);
  };
  
  const handleBuy = async () => {
    if (sharesNum <= 0) {
      toast.error("Please enter a valid number of shares");
      return;
    }
    
    if (totalAmount > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await buyStock(stockId, sharesNum, currentPrice);
      if (success && onTradeComplete) {
        onTradeComplete();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSell = async () => {
    if (sharesNum <= 0) {
      toast.error("Please enter a valid number of shares");
      return;
    }
    
    if (sharesNum > ownedShares) {
      toast.error(`You only own ${ownedShares} shares`);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await sellStock(stockId, sharesNum, currentPrice);
      if (success && onTradeComplete) {
        onTradeComplete();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {stockName}</CardTitle>
        <CardDescription>Current price: {currentPrice.toFixed(4)} ETH</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-shares">Shares</Label>
              <Input
                id="buy-shares"
                type="text"
                value={shares}
                onChange={handleSharesChange}
                placeholder="Enter number of shares"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Cost</Label>
              <div className="text-2xl font-bold">{totalAmount.toFixed(4)} ETH</div>
              <p className="text-sm text-muted-foreground">
                Wallet Balance: {walletBalance.toFixed(4)} ETH
              </p>
            </div>
          </TabsContent>
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-shares">Shares</Label>
              <Input
                id="sell-shares"
                type="text"
                value={shares}
                onChange={handleSharesChange}
                placeholder="Enter number of shares"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Value</Label>
              <div className="text-2xl font-bold">{totalAmount.toFixed(4)} ETH</div>
              <p className="text-sm text-muted-foreground">
                Owned Shares: {ownedShares}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {tab === 'buy' ? (
          <Button 
            className="w-full" 
            onClick={handleBuy} 
            disabled={isLoading || sharesNum <= 0 || totalAmount > walletBalance}
          >
            {isLoading ? "Processing..." : "Buy Shares"}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleSell} 
            disabled={isLoading || sharesNum <= 0 || sharesNum > ownedShares}
          >
            {isLoading ? "Processing..." : "Sell Shares"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StockTradeForm;