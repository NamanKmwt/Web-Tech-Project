import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Racing from './pages/Racing';
import Drivers from './pages/Drivers';
import News from './pages/News';
import Tech from './pages/Tech';
import Rules from './pages/Rules';
import { AnimatePresence } from 'framer-motion';
import ArticlePage from './pages/ArticleContent';
import DriverData from './pages/DriverData';
import DriverStats from './pages/DriverStats';
import { AudioProvider } from './AudioContext'; // adjust path as needed
import Landing from './pages/Landing';
function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-carbon-black text-white">
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/racing" element={<Racing />} />
                <Route path="/leaderboard" element={<Drivers />} />
                <Route path="/news" element={<News />} />
                <Route path="/tech" element={<Tech />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/news/:id" element={<ArticlePage />} />
                <Route path="/drivers" element={<DriverData />} />
                <Route path="/driver/:id" element={<DriverStats />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
