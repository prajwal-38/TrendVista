import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createNewMarket } from '@/services/contracts/PredictionMarket';
import { useNavigate } from 'react-router-dom';

interface CreateMarketFormProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const CreateMarketForm: React.FC<CreateMarketFormProps> = ({ 
  walletConnected,
  onConnectWallet 
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resolutionDate, setResolutionDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      onConnectWallet();
      return;
    }
    
    if (!title || !description || !resolutionDate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (resolutionDate < new Date()) {
      toast.error('Resolution date must be in the future');
      return;
    }
    
    setIsSubmitting(true);
    toast.info('Creating your market...');
    
    try {
      const success = await createNewMarket(title, description, resolutionDate);
      
      if (success) {
        toast.success('Market created successfully!');
        navigate('/'); 
      } else {
        toast.error('Failed to create market');
      }
    } catch (error) {
      console.error('Error creating market:', error);
      toast.error('An error occurred while creating the market');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Market</CardTitle>
        <CardDescription>
          Create a new prediction market for others to trade on. Be specific about the resolution criteria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Market Question</Label>
            <Input
              id="title"
              placeholder="e.g., Will Bitcoin exceed $100,000 by the end of 2025?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description & Resolution Criteria</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the market and clear criteria for how it will be resolved..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resolution-date">Resolution Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="resolution-date"
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
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !walletConnected}
          >
            {isSubmitting ? 'Creating...' : 'Create Market'}
          </Button>
          
          {!walletConnected && (
            <p className="text-sm text-center text-muted-foreground">
              You need to connect your wallet to create a market
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateMarketForm;