
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Index'; // Changed from '@/pages/Home' to '@/pages/Index'
import MarketDetail from '@/pages/MarketDetail';
import Portfolio from '@/pages/Portfolio';
import CreateMarket from '@/pages/CreateMarket';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market/:id" element={<MarketDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/create-market" element={<CreateMarket />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
