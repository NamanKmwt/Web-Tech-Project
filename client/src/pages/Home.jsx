import React from 'react';
import Hero from '../components/Hero';
import NewsGrid from '../components/NewsGrid';
import Leaderboard from '../components/Leaderboard';
import CarShowcase from '../components/CarShowcase';

const Home = () => {
    return (
        <div className="bg-carbon-black text-white selection:bg-f1-red selection:text-white">
            <Hero />
            <NewsGrid />
            <Leaderboard />
            <CarShowcase />

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 text-center">
                <p className="font-orbitron italic text-titanium-silver/50 tracking-widest text-sm uppercase">
                    &copy; {new Date().getFullYear()} Formula 1 Velocity. Unofficial Concept.
                </p>
            </footer>
        </div>
    );
};

export default Home;
