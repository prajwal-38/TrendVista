
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Market } from '@/services/marketData';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { buyStock, sellStock } from '@/services/walletService';

interface TradeFormProps {
  market: Market;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ 
  market, 
  walletConnected,
  onConnectWallet 
}) => {
  const [tradeType, setTradeType] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<string>('100');
  const [slippage, setSlippage] = useState<number>(2);
  

  const calculateShares = () => {
    const amountNum = parseFloat(amount) || 0;
    const price = tradeType === 'yes' ? market.yesPrice : market.noPrice;
    return amountNum / price;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^$|^[0-9]+\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTrade = async () => {
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    toast.info(`Preparing your ${tradeType === 'yes' ? 'YES' : 'NO'} order...`);
    
    try {
      const success = await buyStock(
        market.id,
        calculateShares(),
        tradeType === 'yes' ? market.yesPrice : market.noPrice,
        tradeType === 'yes'
      );
      
      if (success) {
        setAmount('100');
      }
    } catch (error) {
      console.error("Trade error:", error);
      toast.error("An error occurred while processing your trade");
    }
  };
  
  const shares = calculateShares();
  const price = tradeType === 'yes' ? market.yesPrice : market.noPrice;
  const priceInCents = (price * 100).toFixed(1);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Trade</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="yes" value={tradeType} onValueChange={(value) => setTradeType(value as 'yes' | 'no')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="yes" className="data-[state=active]:bg-success data-[state=active]:text-black">Buy YES</TabsTrigger>
            <TabsTrigger value="no" className="data-[state=active]:bg-danger data-[state=active]:text-white">Buy NO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="yes" className="mt-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Amount (USD)</label>
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-secondary/20 border-secondary"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Slippage Tolerance</span>
                  <span className="text-xs font-medium">{slippage}%</span>
                </div>
                <Slider
                  value={[slippage]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(values) => setSlippage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1%</span>
                  <span>5%</span>
                </div>
              </div>
              
              <div className="p-3 bg-secondary/20 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Current Price</span>
                  <span className="text-sm font-medium">{priceInCents}¢</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Est. Shares</span>
                  <span className="text-sm font-medium">{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Max With Slippage</span>
                  <span className="text-sm font-medium">{(parseFloat(amount) * (1 + slippage / 100)).toFixed(2)}</span>
                </div>
              </div>

              {!walletConnected && (
                <div className="flex items-center gap-2 p-2 rounded bg-warning/10 border border-warning/20 text-xs">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Connect your wallet to trade on this market</span>
                </div>
              )}
              
              <Button 
                className="bg-success text-black hover:bg-success/90"
                onClick={handleTrade}
              >
                {walletConnected ? `Buy YES @ ${priceInCents}¢` : 'Connect Wallet to Trade'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="no" className="mt-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Amount (USD)</label>
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-secondary/20 border-secondary"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Slippage Tolerance</span>
                  <span className="text-xs font-medium">{slippage}%</span>
                </div>
                <Slider
                  value={[slippage]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(values) => setSlippage(values[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1%</span>
                  <span>5%</span>
                </div>
              </div>
              
              <div className="p-3 bg-secondary/20 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Current Price</span>
                  <span className="text-sm font-medium">{priceInCents}¢</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Est. Shares</span>
                  <span className="text-sm font-medium">{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Max With Slippage</span>
                  <span className="text-sm font-medium">{(parseFloat(amount) * (1 + slippage / 100)).toFixed(2)}</span>
                </div>
              </div>

              {!walletConnected && (
                <div className="flex items-center gap-2 p-2 rounded bg-warning/10 border border-warning/20 text-xs">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Connect your wallet to trade on this market</span>
                </div>
              )}
              
              <Button 
                className="bg-danger text-white hover:bg-danger/90"
                onClick={handleTrade}
              >
                {walletConnected ? `Buy NO @ ${priceInCents}¢` : 'Connect Wallet to Trade'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeForm;
