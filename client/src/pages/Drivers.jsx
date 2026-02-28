import React from 'react';
import { motion } from 'framer-motion';
import Leaderboard from '../components/Leaderboard';

const Drivers = () => {
    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white overflow-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-2 block">The Grid</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">DRIVER <span className="text-titanium-silver">STANDINGS</span></h1>
                    <p className="mt-4 text-titanium-silver max-w-2xl text-lg">
                        Follow the battle for the World Championship. Real-time standings, statistics, and driver profiles for the 2026 season.
                    </p>
                </motion.div>
            </div>

            <div className="border-t border-white/10 pt-12">
                <Leaderboard />
            </div>
        </div>
    );
};

export default Drivers;
