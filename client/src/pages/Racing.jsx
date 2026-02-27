import React from 'react';
import { motion } from 'framer-motion';

const races = [
    { id: 1, round: 1, name: 'Bahrain Grand Prix', date: 'Mar 02', status: 'Upcoming', circuit: 'Bahrain International Circuit', bg: '/images/races/bahrain.png' },
    { id: 2, round: 2, name: 'Saudi Arabian Grand Prix', date: 'Mar 09', status: 'Upcoming', circuit: 'Jeddah Corniche Circuit', bg: '/images/races/jeddah.png' },
    { id: 3, round: 3, name: 'Australian Grand Prix', date: 'Mar 24', status: 'Upcoming', circuit: 'Albert Park Circuit', bg: '/images/races/australia.png' },
    { id: 4, round: 4, name: 'Japanese Grand Prix', date: 'Apr 07', status: 'Upcoming', circuit: 'Suzuka International Racing Course', bg: '/images/races/japan.png' },
    { id: 5, round: 5, name: 'Miami Grand Prix', date: 'May 05', status: 'Upcoming', circuit: 'Miami International Autodrome', bg: '/images/races/miami.png' },
];

const Racing = () => {
    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-2 block">2026 Season</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">RACING <span className="text-titanium-silver">CALENDAR</span></h1>
                </motion.div>

                <div className="space-y-4">
                    {races.map((race, i) => (
                        <motion.div
                            key={race.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative overflow-hidden p-6 flex flex-col md:flex-row items-start md:items-center justify-between group rounded-xl border border-white/10 hover:border-f1-red transition-all duration-500 min-h-[160px]"
                        >
                            {/* Background Image & Gradient */}
                            <div
                                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${race.bg})` }}
                            />
                            <div className="absolute inset-0 z-0 bg-gradient-to-r from-carbon-black via-carbon-black/80 to-transparent" />
                            <div className="absolute inset-0 z-0 bg-gradient-to-t from-carbon-black/90 to-transparent md:hidden" />

                            {/* Content */}
                            <div className="relative z-10 flex items-center space-x-6 mb-4 md:mb-0 w-full md:w-auto">
                                <div className="flex flex-col items-center justify-center w-20 h-20 bg-carbon-black/80 backdrop-blur-md rounded-lg group-hover:bg-f1-red transition-colors duration-300 shadow-xl border border-white/5">
                                    <span className="text-xs font-bold uppercase tracking-widest text-titanium-silver group-hover:text-white">Round</span>
                                    <span className="text-3xl font-black italic">{race.round}</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold italic mb-1 drop-shadow-lg">{race.name}</h3>
                                    <p className="text-titanium-silver text-sm flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-f1-red inline-block" />
                                        {race.circuit}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                                <div className="text-right bg-carbon-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                                    <span className="block text-xl font-bold text-white">{race.date}</span>
                                    <span className="text-xs text-f1-red uppercase tracking-widest font-semibold">{race.status}</span>
                                </div>
                                <button className="px-8 py-3 bg-white text-carbon-black border border-transparent uppercase tracking-widest text-xs font-black hover:bg-f1-red hover:text-white transition-all duration-300 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,24,1,0.4)]">
                                    Tickets
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Racing;
