import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import { ArrowRight, BarChart2, BookOpen, Coins, Lightbulb, Scale, TrendingUp, Users } from 'lucide-react';

const HowItWorks = () => {
  const [walletInfo, setWalletInfo] = useState(getWalletInfo());
  
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

  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">How It Works</h1>
        <p className="text-muted-foreground mb-8">
          Learn how Proba Trend Vista prediction markets function and how to participate
        </p>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basics">The Basics</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  What are Prediction Markets?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Prediction markets are platforms where users can trade on the outcomes of future events. 
                  They function like financial markets but instead of trading stocks or commodities, 
                  participants buy and sell shares in potential outcomes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Example Market</h3>
                    <p className="text-sm text-muted-foreground">
                      "Will Bitcoin exceed $100,000 by December 31, 2024?"
                    </p>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• YES shares pay $1 if BTC exceeds $100K</li>
                      <li>• NO shares pay $1 if BTC doesn't exceed $100K</li>
                    </ul>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Market Price = Probability</h3>
                    <p className="text-sm text-muted-foreground">
                      The price of shares reflects the market's estimate of the probability of an outcome.
                    </p>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• 75¢ YES price = 75% probability</li>
                      <li>• 25¢ NO price = 25% probability</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  How Prediction Markets Work
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium">Markets are created for specific events</h3>
                      <p className="text-sm text-muted-foreground">Each market has a clear resolution criteria and expiration date.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium">Traders buy and sell outcome shares</h3>
                      <p className="text-sm text-muted-foreground">Shares are priced between 1¢ and 99¢, reflecting probability estimates.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium">Market prices adjust based on trading activity</h3>
                      <p className="text-sm text-muted-foreground">As new information emerges, traders update their positions, causing prices to change.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium">When the market resolves, winning shares pay out</h3>
                      <p className="text-sm text-muted-foreground">Correct outcome shares are worth $1 each, incorrect outcome shares are worth $0.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium">Connect your wallet</h3>
                      <p className="text-sm text-muted-foreground">Use a compatible wallet to connect to the platform.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium">Browse available markets</h3>
                      <p className="text-sm text-muted-foreground">Explore markets by category, popularity, or expiration date.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium">Place your first trade</h3>
                      <p className="text-sm text-muted-foreground">Buy shares in outcomes you believe are mispriced relative to their true probability.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium">Manage your portfolio</h3>
                      <p className="text-sm text-muted-foreground">Track your positions and performance in your portfolio dashboard.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  How to Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Trading on Proba Trend Vista is similar to trading on a stock exchange, but with binary outcomes.
                  You can buy YES shares if you think an event will happen, or NO shares if you think it won't.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Buying Shares</h3>
                    <ol className="mt-2 text-sm space-y-2 list-decimal pl-4">
                      <li>Select a market you're interested in</li>
                      <li>Choose YES or NO position</li>
                      <li>Enter the quantity of shares to buy</li>
                      <li>Review the total cost and confirm your trade</li>
                    </ol>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Selling Shares</h3>
                    <ol className="mt-2 text-sm space-y-2 list-decimal pl-4">
                      <li>Navigate to your portfolio</li>
                      <li>Find the position you want to exit</li>
                      <li>Enter the quantity of shares to sell</li>
                      <li>Review the proceeds and confirm your sale</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg mt-4">
                  <h3 className="font-medium mb-2">Trading Example</h3>
                  <p className="text-sm">
                    For a market "Will ETH reach $5,000 by Q2 2024?" with YES shares at 40¢:
                  </p>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>• If you buy 100 YES shares at 40¢, you pay $40</li>
                    <li>• If ETH reaches $5,000, your shares are worth $100 (profit: $60)</li>
                    <li>• If ETH doesn't reach $5,000, your shares are worth $0 (loss: $40)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Order Book Explained
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The order book shows all buy (bid) and sell (ask) orders for a market. Understanding the order book
                  helps you make more informed trading decisions.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Bid Orders (Buy Orders)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      These are orders from traders willing to buy shares at specific prices.
                      Higher bids appear at the top.
                    </p>
                    <div className="bg-muted p-3 rounded text-xs">
                      <div className="grid grid-cols-3 font-medium mb-1">
                        <div>Price</div>
                        <div className="text-right">Size</div>
                        <div className="text-right">Total</div>
                      </div>
                      <div className="grid grid-cols-3 text-green-500">
                        <div>45.00¢</div>
                        <div className="text-right">500</div>
                        <div className="text-right">500</div>
                      </div>
                      <div className="grid grid-cols-3 text-green-500">
                        <div>44.50¢</div>
                        <div className="text-right">1,200</div>
                        <div className="text-right">1,700</div>
                      </div>
                      <div className="grid grid-cols-3 text-green-500">
                        <div>44.00¢</div>
                        <div className="text-right">800</div>
                        <div className="text-right">2,500</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Ask Orders (Sell Orders)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      These are orders from traders willing to sell shares at specific prices.
                      Lower asks appear at the top.
                    </p>
                    <div className="bg-muted p-3 rounded text-xs">
                      <div className="grid grid-cols-3 font-medium mb-1">
                        <div>Price</div>
                        <div className="text-right">Size</div>
                        <div className="text-right">Total</div>
                      </div>
                      <div className="grid grid-cols-3 text-red-500">
                        <div>46.00¢</div>
                        <div className="text-right">700</div>
                        <div className="text-right">700</div>
                      </div>
                      <div className="grid grid-cols-3 text-red-500">
                        <div>46.50¢</div>
                        <div className="text-right">900</div>
                        <div className="text-right">1,600</div>
                      </div>
                      <div className="grid grid-cols-3 text-red-500">
                        <div>47.00¢</div>
                        <div className="text-right">1,500</div>
                        <div className="text-right">3,100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Market Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Binary Markets</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      These markets have only two possible outcomes: YES or NO. They're the most common type on Proba Trend Vista.
                    </p>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="font-medium">Examples:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>"Will BTC exceed $100K by December 31, 2024?"</li>
                        <li>"Will the Democrats win the 2024 US Presidential election?"</li>
                        <li>"Will SpaceX successfully land humans on Mars before 2030?"</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Market Categories</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Crypto</h4>
                        <p className="text-xs text-muted-foreground">
                          Markets related to cryptocurrency prices, events, and developments.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Politics</h4>
                        <p className="text-xs text-muted-foreground">
                          Elections, policy decisions, and political events.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Technology</h4>
                        <p className="text-xs text-muted-foreground">
                          Product launches, company milestones, and tech innovations.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Sports</h4>
                        <p className="text-xs text-muted-foreground">
                          Game outcomes, player performances, and sporting events.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Economics</h4>
                        <p className="text-xs text-muted-foreground">
                          Interest rates, inflation, GDP growth, and economic indicators.
                        </p>
                      </div>
                      <div className="border border-border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-1">Entertainment</h4>
                        <p className="text-xs text-muted-foreground">
                          Movie box office, awards, and entertainment industry events.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  Market Resolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  When a market reaches its expiration date, it resolves based on the actual outcome of the event.
                  This process determines which shares pay out.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-medium">Oracle Activation</h3>
                      <p className="text-sm text-muted-foreground">When a market expires, the oracle system is activated to determine the outcome.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-medium">Data Verification</h3>
                      <p className="text-sm text-muted-foreground">The oracle fetches data from trusted sources to verify the outcome.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-medium">Outcome Determination</h3>
                      <p className="text-sm text-muted-foreground">Based on the verified data, the market is resolved as YES or NO.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mt-0.5 flex-shrink-0">4</div>
                    <div>
                      <h3 className="font-medium">Payout Distribution</h3>
                      <p className="text-sm text-muted-foreground">Winning shares are automatically redeemed for $1 each, and funds are transferred to holders' wallets.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Advanced Trading Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Arbitrage</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Taking advantage of price discrepancies between related markets to lock in risk-free profits.
                    </p>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1">
                        If YES shares in a market are trading at 60¢ and NO shares are trading at 35¢, you can buy both for 95¢ total.
                        Since one of them must pay out $1, you're guaranteed a 5¢ profit per pair of shares.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Hedging</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Using prediction markets to offset risks in other investments or real-world scenarios.
                    </p>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1">
                        If you hold Bitcoin and are concerned about a price drop, you could buy NO shares in a "Will BTC exceed $X?" market.
                        If Bitcoin's price falls, your NO shares will increase in value, offsetting some of your Bitcoin losses.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Market Making</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Providing liquidity by placing both buy and sell orders with a small spread, earning from the difference.
                    </p>
                    <div className="bg-muted p-3 rounded-lg text-sm">
                      <p className="font-medium">Example:</p>
                      <p className="mt-1">
                        Placing buy orders at 45¢ and sell orders at 47¢. When both orders execute, you earn a 2¢ profit per share,
                        regardless of the market outcome.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Smart Contract Architecture</h3>
                    <p className="text-sm text-muted-foreground">
                      Proba Trend Vista uses smart contracts to create markets, handle trades, and manage resolutions.
                      All transactions are recorded on the blockchain, ensuring transparency and immutability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Oracle System</h3>
                    <p className="text-sm text-muted-foreground">
                      Our oracle system uses multiple trusted data sources to determine market outcomes.
                      This decentralized approach ensures accurate and tamper-resistant resolutions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Fee Structure</h3>
                    <p className="text-sm text-muted-foreground">
                      The platform charges a small fee on trades to support development and maintenance.
                      Market creators may also earn a portion of trading fees from their markets.
                    </p>
                    <ul className="mt-2 text-sm space-y-1 pl-4 list-disc">
                      <li>Trading fee: 2% of trade value</li>
                      <li>Market creation fee: 0.1 ETH</li>
                      <li>Creator earnings: 0.5% of market trading volume</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8">
              <a href="/create-market" className="inline-flex items-center gap-2 text-primary hover:underline">
                Ready to create your own market? <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HowItWorks;