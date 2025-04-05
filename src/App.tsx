
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Index'; // Changed from '@/pages/Home' to '@/pages/Index'
import MarketDetail from '@/pages/MarketDetail';
import Portfolio from '@/pages/Portfolio';
import CreateMarket from '@/pages/CreateMarket';
import TestDataPage from '@/pages/TestDataPage'; // Import the new component
import HowItWorks from '@/pages/HowItWorks'; // Import the How It Works page
import { Toaster } from '@/components/ui/sonner';
import Leaderboard from '@/pages/Leaderboard';
import CreatedMarkets from '@/pages/CreatedMarkets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/create-market" element={<CreateMarket />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/test-data" element={<TestDataPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} /> {/* Add the new route */}
        <Route path="/created-markets" element={<CreatedMarkets />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
