
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getWalletInfo, connectWallet, disconnectWallet } from '@/services/walletService';

// Form schema
const marketFormSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string({ required_error: "Please select a category" }),
  resolutionDate: z.date({ required_error: "Resolution date is required" })
    .refine((date) => date > new Date(), {
      message: "Resolution date must be in the future",
    }),
  initialLiquidity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Initial liquidity must be a positive number",
  }),
});

const CreateMarket = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Connect wallet function
  const handleConnectWallet = async () => {
    const connected = await connectWallet();
    if (connected) {
      setWalletInfo(connected);
    }
  };
  
  // Disconnect wallet function
  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletInfo(null);
  };
  
  // Form
  const form = useForm<z.infer<typeof marketFormSchema>>({
    resolver: zodResolver(marketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      initialLiquidity: "100",
    },
  });
  
  const onSubmit = (values: z.infer<typeof marketFormSchema>) => {
    if (!walletInfo?.connected) {
      toast.error("Please connect your wallet to create a market");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Market created:", values);
      toast.success("Market created successfully!");
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };
  
  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create a Market</h1>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Will Bitcoin exceed $100,000 by end of 2025?" {...field} />
                    </FormControl>
                    <FormDescription>
                      Frame your question as a yes/no prediction that can be definitively resolved.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed information about how this market will be resolved..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include sources, resolution criteria, and any other relevant details.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the most relevant category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="resolutionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Resolution Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When will this market be resolved?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="initialLiquidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Liquidity (in USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      The amount you'll provide as initial liquidity. Min: $1.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Creating Market...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Create Market
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateMarket;
