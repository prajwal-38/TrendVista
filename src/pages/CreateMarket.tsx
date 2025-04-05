import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { addCreatedMarket } from '@/services/createdMarketsService';
import { v4 as uuidv4 } from 'uuid';

const CreateMarket = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [resolutionDate, setResolutionDate] = useState<Date | undefined>(undefined);
  const [initialLiquidity, setInitialLiquidity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletInfo?.connected) {
      toast.error('Please connect your wallet to create a market');
      return;
    }
    
    if (!title || !description || !category || !resolutionDate || !initialLiquidity) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate resolution date is in the future
    if (resolutionDate && resolutionDate < new Date()) {
      toast.error('Resolution date must be in the future');
      return;
    }
    
    // Validate initial liquidity is a positive number
    const liquidity = parseFloat(initialLiquidity);
    if (isNaN(liquidity) || liquidity <= 0) {
      toast.error('Initial liquidity must be a positive number');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new market object
      const newMarket = {
        id: uuidv4(),
        title,
        description,
        category,
        resolutionDate: resolutionDate?.toISOString() || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        creator: walletInfo.address,
        initialLiquidity: liquidity,
        volume: liquidity,
        liquidity: liquidity,
        yesPrice: 0.5,
        noPrice: 0.5,
        isTrending: false,
        isPopular: false,
        isNew: true
      };
      
      // Add to created markets
      addCreatedMarket(newMarket);
      
      toast.success('Market created successfully!');
      navigate(`/market/${newMarket.id}`);
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('Failed to create market. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Create a New Market</h1>
        
        {!walletInfo?.connected ? (
          <div className="bg-card p-8 rounded-lg border border-border text-center">
            <p className="mb-4 text-muted-foreground">Connect your wallet to create a prediction market</p>
            <Button onClick={handleConnectWallet}>Connect Wallet</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border border-border">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Market Question</label>
              <Input
                id="title"
                placeholder="E.g., Will Bitcoin exceed $100,000 by the end of 2023?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                placeholder="Provide details about this market, including resolution criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="resolutionDate" className="text-sm font-medium">Resolution Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !resolutionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {resolutionDate ? format(resolutionDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={resolutionDate}
                    onSelect={setResolutionDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="initialLiquidity" className="text-sm font-medium">Initial Liquidity (ETH)</label>
              <Input
                id="initialLiquidity"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.1"
                value={initialLiquidity}
                onChange={(e) => setInitialLiquidity(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                This amount will be used to bootstrap the market's liquidity pool.
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Market...' : 'Create Market'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default CreateMarket;