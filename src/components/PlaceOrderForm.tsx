import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { placeOrder } from '@/services/contracts/PredictionMarket';
import { toast } from 'sonner';

interface PlaceOrderFormProps {
  marketId: string;
  currentPrice: number;
  walletConnected: boolean;
  onConnectWallet: () => void;
  selectedPrice?: number;
  selectedIsYes?: boolean;
}

const PlaceOrderForm: React.FC<PlaceOrderFormProps> = ({
  marketId,
  currentPrice,
  walletConnected,
  onConnectWallet,
  selectedPrice,
  selectedIsYes
}) => {
  const [orderType, setOrderType] = useState<'yes' | 'no'>(selectedIsYes ? 'yes' : 'no');
  const [price, setPrice] = useState<number>(selectedPrice || currentPrice);
  const [amount, setAmount] = useState<number>(100);
  const [ethValue, setEthValue] = useState<number>(0.01);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update order type when selectedIsYes changes
  useEffect(() => {
    if (selectedIsYes !== undefined) {
      setOrderType(selectedIsYes ? 'yes' : 'no');
    }
  }, [selectedIsYes]);
  
  // Update price when selectedPrice changes
  useEffect(() => {
    if (selectedPrice) {
      setPrice(selectedPrice);
    }
  }, [selectedPrice]);
  
  const handlePriceChange = (value: number[]) => {
    setPrice(value[0]);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    }
  };
  
  const handleEthValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setEthValue(value);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    
    setIsSubmitting(true);
    toast.info(`Placing ${orderType.toUpperCase()} order...`);
    
    try {
      const success = await placeOrder(
        parseInt(marketId),
        orderType === 'yes',
        price,
        amount,
        ethValue
      );
      
      if (success) {
        toast.success('Order placed successfully!');
        // Reset form
        setAmount(100);
        setEthValue(0.01);
      } else {
        toast.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('An error occurred while placing the order');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'yes' | 'no')}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="yes" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Buy YES
              </TabsTrigger>
              <TabsTrigger value="no" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Buy NO
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="yes" className="mt-0">
              <p className="text-sm mb-4">
                If you think this outcome <strong>will happen</strong>, buy YES shares. You'll earn 1 ETH per share if the outcome is YES.
              </p>
            </TabsContent>
            
            <TabsContent value="no" className="mt-0">
              <p className="text-sm mb-4">
                If you think this outcome <strong>won't happen</strong>, buy NO shares. You'll earn 1 ETH per share if the outcome is NO.
              </p>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="price">Price ({(price * 100).toFixed(0)}¢)</Label>
              <span className="text-xs text-muted-foreground">
                {orderType === 'yes' ? 'Probability' : 'Inverse Probability'}: {(price * 100).toFixed(0)}%
              </span>
            </div>
            <Slider
              id="price"
              min={0.01}
              max={0.99}
              step={0.01}
              value={[price]}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Shares)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eth-value">ETH Value</Label>
            <Input
              id="eth-value"
              type="number"
              min="0.001"
              step="0.001"
              value={ethValue}
              onChange={handleEthValueChange}
            />
            <p className="text-xs text-muted-foreground">
              Maximum shares you can buy: {Math.floor(ethValue / price)}
            </p>
          </div>
          
          <div className="bg-secondary/20 rounded-md p-3 text-sm">
            <div className="flex justify-between mb-1">
              <span>Order Type:</span>
              <span className="font-medium">{orderType === 'yes' ? 'Buy YES' : 'Buy NO'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Price:</span>
              <span className="font-medium">{(price * 100).toFixed(2)}¢</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Quantity:</span>
              <span className="font-medium">{amount} shares</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Total Cost:</span>
              <span className="font-medium">{(price * amount).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Potential Profit:</span>
              <span className="font-medium">{((1 - price) * amount).toFixed(4)} ETH</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !walletConnected}
            variant={orderType === 'yes' ? 'default' : 'destructive'}
          >
            {isSubmitting ? 'Processing...' : `Place ${orderType.toUpperCase()} Order`}
          </Button>
          
          {!walletConnected && (
            <p className="text-sm text-center text-muted-foreground">
              You need to connect your wallet to place an order
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderForm;