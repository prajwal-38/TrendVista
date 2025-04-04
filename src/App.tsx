
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketDetail from "./pages/MarketDetail";
import Portfolio from "./pages/Portfolio";
import Leaderboard from "./pages/Leaderboard";
import CreateMarket from "./pages/CreateMarket";
import SearchMarkets from "./pages/SearchMarkets";
import WalletPage  from "./pages/WalletPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market/:id" element={<MarketDetail />} />
          <Route path="/search" element={<SearchMarkets />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/create-market" element={<CreateMarket />} />
          <Route path="/wallet" element={<WalletPage />} />
          {/* Add the wallet page route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
