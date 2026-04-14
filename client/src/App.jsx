import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Racing from './pages/Racing';
import Drivers from './pages/Drivers';
import News from './pages/News';
import Tech from './pages/Tech';
import { AnimatePresence } from 'framer-motion';
import ArticlePage from './pages/ArticleContent';
import DriverData from './pages/DriverData';
import DriverStats from './pages/DriverStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-carbon-black text-white">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/racing" element={<Racing />} />
              <Route path="/leaderboard" element={<Drivers />} />
              <Route path="/news" element={<News />} />
              <Route path="/tech" element={<Tech />} />
              <Route path="/news/:id" element={<ArticlePage />} />
              <Route path="/drivers" element={<DriverData />} />
              <Route path="/driver/:id" element={<DriverStats />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
