import React, { useState, useEffect } from 'react';
import { getCreatedMarkets } from '@/services/createdMarketsService';
import { connectWallet, disconnectWallet, getWalletInfo } from '@/services/walletService';
import Layout from '@/components/Layout';
import MarketCard from '@/components/MarketCard';
import { Market } from '@/services/marketData';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CreatedMarkets = () => {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = React.useState(getWalletInfo());
  const [createdMarkets, setCreatedMarkets] = useState<Market[]>([]);

  useEffect(() => {
    // Load created markets when component mounts
    const markets = getCreatedMarkets();
    setCreatedMarkets(markets);
  }, []);

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

  return (
    <Layout
      walletInfo={walletInfo}
      onConnectWallet={handleConnectWallet}
      onDisconnectWallet={handleDisconnectWallet}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Created Markets</h1>
        
        {createdMarkets.length === 0 ? (
          <div className="my-12">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No markets found</AlertTitle>
              <AlertDescription>
                You haven't created any markets yet. Create your first prediction market now!
              </AlertDescription>
            </Alert>
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/create-market')}
                className="bg-primary hover:bg-primary/90"
              >
                Create Your First Market
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdMarkets.map(market => (
              <MarketCard key={market.id} market={market} isCreatedMarket={true} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreatedMarkets;