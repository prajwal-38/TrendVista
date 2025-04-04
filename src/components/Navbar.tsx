
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Wallet, 
  LogOut, 
  BarChart2, 
  User,
  Copy,
  ExternalLink
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { formatAddress, WalletInfo } from '@/services/walletService';
import { toast } from 'sonner';
import { isMetaMaskInstalled } from '../services/walletService';
import MetaMaskPrompt from './MetaMaskPrompt';

interface NavbarProps {
  walletInfo: WalletInfo | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  walletInfo, 
  onConnectWallet, 
  onDisconnectWallet 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMetaMaskPrompt, setShowMetaMaskPrompt] = useState(false);

  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success("Address copied to clipboard");
    }
  };

  const viewOnExplorer = () => {
    if (walletInfo?.address) {
      window.open(`https://etherscan.io/address/${walletInfo.address}`, '_blank');
    }
  };

  const handleWalletConnect = async () => {
    if (!isMetaMaskInstalled()) {
      setShowMetaMaskPrompt(true);
      return;
    }
    
    onConnectWallet();
  };

  return (
    <>
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                TrendVista
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Markets
              </Link>
              <Link to="/portfolio" className="text-foreground hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link to="/leaderboard" className="text-foreground hover:text-primary transition-colors">
                Leaderboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors inline-flex items-center">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link to="/how-it-works" className="flex w-full">How It Works</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/create-market" className="flex w-full">Create Market</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/faq" className="flex w-full">FAQ</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Wallet Button / User Menu */}
            <div className="flex items-center">
              {walletInfo?.connected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {formatAddress(walletInfo.address)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <span className="font-normal text-muted-foreground text-xs">Connected Wallet</span>
                        <span className="font-mono text-sm">{formatAddress(walletInfo.address)}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <span className="font-normal text-muted-foreground text-xs">Balance</span>
                        <span className="font-medium">{walletInfo.balance.toFixed(4)} ETH</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={copyAddress}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy Address</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={viewOnExplorer}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>View on Explorer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/portfolio" className="cursor-pointer">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Portfolio</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wallet" className="cursor-pointer">
                        <Wallet className="mr-2 h-4 w-4" />
                        <span>Wallet Details</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={onDisconnectWallet}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Disconnect</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={handleWalletConnect}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="font-medium">Connect Wallet</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="ml-4 p-2 md:hidden rounded-md hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                to="/"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Markets
              </Link>
              <Link
                to="/portfolio"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                to="/leaderboard"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <Link
                to="/how-it-works"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/create-market"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Market
              </Link>
              <Link
                to="/faq"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
          </div>
        )}
      </header>
      
      {/* MetaMask Prompt */}
      {showMetaMaskPrompt && (
        <MetaMaskPrompt onClose={() => setShowMetaMaskPrompt(false)} />
      )}
    </>
  );
};

export default Navbar;
