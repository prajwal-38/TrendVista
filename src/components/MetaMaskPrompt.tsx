import React from 'react';
import { Button } from './ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface MetaMaskPromptProps {
  onClose: () => void;
}

const MetaMaskPrompt: React.FC<MetaMaskPromptProps> = ({ onClose }) => {
  const handleInstallClick = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const handleTestNetworkGuide = () => {
    window.open('https://docs.metamask.io/wallet/how-to/connect-to-testnet/', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">MetaMask Required</h2>
        <p className="mb-4">
          To connect your wallet and use TrendVista, you need to install the MetaMask browser extension.
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          For testing, we recommend connecting to a test network like Goerli, Sepolia, or Mumbai.
        </p>
        <div className="flex flex-col gap-4">
          <Button onClick={handleTestNetworkGuide} variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            How to Connect to Test Networks
          </Button>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleInstallClick} className="gap-2">
              <Download className="h-4 w-4" />
              Install MetaMask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskPrompt;