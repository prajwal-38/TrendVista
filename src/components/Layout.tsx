
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp } from 'lucide-react';
import { WalletInfo } from '@/services/walletService';

interface LayoutProps {
  children: React.ReactNode;
  walletInfo: WalletInfo | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  walletInfo, 
  onConnectWallet, 
  onDisconnectWallet 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar 
        walletInfo={walletInfo}
        onConnectWallet={onConnectWallet}
        onDisconnectWallet={onDisconnectWallet}
      />
      <main className="flex-1 container mx-auto px-4 py-6">
        {!walletInfo?.connected && (
          <Card className="mb-6 border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-warning" />
                <p className="text-sm font-medium">Connect your wallet to start trading on prediction markets</p>
              </div>
              <button
                onClick={onConnectWallet}
                className="px-3 py-1 bg-warning text-black font-medium rounded-md text-sm hover:bg-warning/90 transition-colors"
              >
                Connect Wallet
              </button>
            </CardContent>
          </Card>
        )}
        {children}
      </main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                TrendVista
              </h3>
              <p className="text-muted-foreground text-sm">
                Web3 Prediction Markets Platform
              </p>
            </div>
            <div className="flex gap-6">
              <a href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a>
              <a href="/test-data" className="text-muted-foreground hover:text-foreground transition-colors">Test Data</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
              <a href="https://github.com/MRKrinetic/TrendVista" className="text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
