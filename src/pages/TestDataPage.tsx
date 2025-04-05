import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getWalletInfo, connectWallet, disconnectWallet } from '@/services/walletService';

// Define the structure for a test event
interface TestEvent {
  id: number;
  type: 'market' | 'contract' | 'orderbook' | 'oracle' | 'data' | 'resolution';
  title: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed';
}

const TestDataPage = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  const [events, setEvents] = useState<TestEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
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
  
  // Initialize test data
  useEffect(() => {
    // Hardcoded test events
    const testEvents: TestEvent[] = [
      {
        id: 1,
        type: 'market',
        title: 'Market Created',
        description: 'User created market "Will BTC be > $70K?"',
        timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        status: 'completed'
      },
      {
        id: 2,
        type: 'contract',
        title: 'Smart Contract Deployed',
        description: 'Smart contract deployed at 0xABC...123',
        timestamp: new Date(Date.now() - 3600000 * 4), // 4 hours ago
        status: 'completed'
      },
      {
        id: 3,
        type: 'orderbook',
        title: 'Order Book Updated',
        description: 'Initial order book set up with matching orders',
        timestamp: new Date(Date.now() - 3600000 * 3), // 3 hours ago
        status: 'completed'
      },
      {
        id: 4,
        type: 'oracle',
        title: 'Oracle Triggered',
        description: 'Oracle activated at market expiry',
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        status: 'completed'
      },
      {
        id: 5,
        type: 'data',
        title: 'Data Fetched',
        description: 'Oracle fetched data from a trusted API based on the market category',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'completed'
      },
      {
        id: 6,
        type: 'resolution',
        title: 'Market Resolved',
        description: 'Smart contract resolved market with outcome YES and payouts distributed',
        timestamp: new Date(), // Now
        status: 'completed'
      }
    ];
    
    setEvents(testEvents);
  }, []);
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Run test simulation
  const runTestSimulation = () => {
    setIsSimulating(true);
    

    setEvents(prev => prev.map(event => ({
      ...event,
      status: 'pending'
    })));
    
    let currentIndex = 0;
    
    const processNextEvent = () => {
      if (currentIndex < events.length) {
        setEvents(prev => prev.map((event, idx) => 
          idx === currentIndex ? { ...event, status: 'processing' } : event
        ));
        
        setTimeout(() => {
          setEvents(prev => prev.map((event, idx) => 
            idx === currentIndex ? { ...event, status: 'completed' } : event
          ));
          
          currentIndex++;
          if (currentIndex < events.length) {
            processNextEvent();
          } else {
            setIsSimulating(false);
            toast.success('Simulation completed successfully!');
          }
        }, 1000); 
      }
    };
    

    processNextEvent();
  };
  
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'market': return 'default';
      case 'contract': return 'secondary';
      case 'orderbook': return 'outline';
      case 'oracle': return 'destructive';
      case 'data': return 'warning';
      case 'resolution': return 'success';
      default: return 'default';
    }
  };
 
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="ml-2">Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="ml-2 animate-pulse">Processing</Badge>;
      case 'completed':
        return <Badge variant="success" className="ml-2">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const showDataFlow = (index: number) => {
    return isSimulating && events[index].status === 'completed' && 
           index < events.length - 1 && events[index + 1].status === 'processing';
  };
  
  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Smart Contract & Oracle Test Data</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Simulated Process Flow</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.reload()}
                    disabled={isSimulating}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div 
                      key={event.id} 
                      className={`p-4 border rounded-lg relative ${
                        event.status === 'processing' ? 'bg-secondary/10' : ''
                      }`}
                    >
                      {/* Timeline connector */}
                      {index < events.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border h-full"></div>
                      )}
                      
                      {/* Data flow animation */}
                      {showDataFlow(index) && (
                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-primary h-full">
                          <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" 
                               style={{top: '50%', left: '-2px'}}></div>
                          <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" 
                               style={{top: '25%', left: '-2px', animationDelay: '0.2s'}}></div>
                          <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" 
                               style={{top: '75%', left: '-2px', animationDelay: '0.4s'}}></div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="mt-1 relative z-10">
                          <div className={`w-4 h-4 rounded-full ${
                            event.status === 'completed' ? 'bg-primary' : 
                            event.status === 'processing' ? 'bg-secondary animate-pulse' : 'bg-muted'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <h3 className="font-medium">{event.title}</h3>
                              {getStatusIndicator(event.status)}
                            </div>
                            <Badge variant={getBadgeVariant(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{event.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(event.timestamp)}
                          </p>
                          
                          {/* Data flow details */}
                          {event.status === 'processing' && (
                            <div className="mt-2 p-2 bg-secondary/5 rounded border border-secondary/20 text-xs animate-pulse">
                              <span className="font-medium">Processing data:</span> {getDataFlowDescription(event.type)}
                            </div>
                          )}
                          
                          {event.status === 'completed' && index < events.length - 1 && (
                            <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20 text-xs">
                              <span className="font-medium">Data passed:</span> {getDataPassedDescription(event.type)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={runTestSimulation}
                  disabled={isSimulating}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Run Test Simulation
                </Button>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Simulation Info</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This simulation demonstrates the flow of events in a prediction market from creation to resolution.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Market Creation</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Smart Contract Deployment</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Order Book Management</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Oracle Integration</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                      <span>Market Resolution</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const getDataFlowDescription = (type: string): string => {
  switch (type) {
    case 'market':
      return 'Creating market parameters and initializing contract data...';
    case 'contract':
      return 'Deploying smart contract bytecode to blockchain...';
    case 'orderbook':
      return 'Setting up initial bid/ask orders and liquidity pools...';
    case 'oracle':
      return 'Triggering oracle service to fetch external data...';
    case 'data':
      return 'Retrieving and validating price data from trusted sources...';
    case 'resolution':
      return 'Calculating final outcome and distributing payouts...';
    default:
      return 'Processing data...';
  }
};

const getDataPassedDescription = (type: string): string => {
  switch (type) {
    case 'market':
      return 'Market ID: BTC-70K-2023, Parameters: {title, description, expiry}';
    case 'contract':
      return 'Contract Address: 0xABC...123, Block: #14355678';
    case 'orderbook':
      return 'Orders: 12 bids, 8 asks, Liquidity pool: 5.4 ETH';
    case 'oracle':
      return 'Oracle ID: chainlink-btc-usd-01, Request ID: 0xDEF...456';
    case 'data':
      return 'BTC Price: $72,145.32, Timestamp: 2023-06-15T12:00:00Z';
    case 'resolution':
      return 'Outcome: YES, Payouts: 32 participants, Total: 8.7 ETH';
    default:
      return 'Data processed successfully';
  }
};

export default TestDataPage;