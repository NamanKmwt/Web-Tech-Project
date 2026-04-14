import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Fallback colors if OpenF1 is missing them
const driverColors = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8000',
    'Mercedes': '#6CD3BF',
    'Aston Martin': '#006F62',
    'Alpine': '#0090FF',
    'Williams': '#005AFF',
    'RB': '#6692FF',
    'Kick Sauber': '#52E252',
    'Haas F1 Team': '#FFFFFF'
};

// Reused helper to fetch high-res images
const getHighResImage = (url) => {
    if (!url) return '';
    return url.split('.transform/')[0];
};

const DriverData = () => {
    const [gridData, setGridData] = useState(null);
    const [loading, setLoading] = useState(true);

    // NEW: State for our active filter
    const [selectedTeam, setSelectedTeam] = useState('All');

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/api/f1/current-grid')
            .then(res => res.json())
            .then(data => {
                // Sort drivers by team name so teammates are grouped together
                const sortedDrivers = (data.drivers || []).sort((a, b) => {
                    const teamCompare = a.team_name.localeCompare(b.team_name);
                    if (teamCompare === 0) return a.driver_number - b.driver_number;
                    return teamCompare;
                });
                setGridData({ ...data, drivers: sortedDrivers });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // NEW: Extract unique teams from the data and sort them alphabetically
    const uniqueTeams = Array.from(new Set((gridData?.drivers || []).map(d => d.team_name))).sort();
    const filterOptions = ['All', ...uniqueTeams];

    // NEW: Filter the drivers based on the selected team
    const filteredDrivers = (gridData?.drivers || []).filter(driver =>
        selectedTeam === 'All' || driver.team_name === selectedTeam
    );

    return (
        <div className="pt-28 pb-24 min-h-screen bg-carbon-black text-white">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-3 block">The Roster</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">PILOTS OF <span className="text-titanium-silver">THE GRID</span></h1>
                    <p className="mt-6 text-titanium-silver max-w-2xl mx-auto text-lg">
                        The elite twenty drivers competing at the absolute pinnacle of motorsport.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* NEW: Team Filter Bar */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center gap-3 mb-12"
                    >
                        {filterOptions.map((team) => {
                            const isActive = selectedTeam === team;
                            const teamColor = team === 'All' ? '#E10600' : (driverColors[team] || '#E10600');

                            return (
                                <button
                                    key={team}
                                    onClick={() => setSelectedTeam(team)}
                                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 border`}
                                    style={{
                                        backgroundColor: isActive ? teamColor : 'transparent',
                                        borderColor: isActive ? teamColor : 'rgba(255,255,255,0.1)',
                                        color: isActive ? '#fff' : '#a1a1aa' // titanium-silver hex roughly
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) e.target.style.borderColor = teamColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    {team}
                                </button>
                            );
                        })}
                    </motion.div>
                )}

                {/* Grid Section */}
                {loading ? (
                    // Loading Skeleton Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    // Actual Driver Grid
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredDrivers.map((driver, index) => {
                                const color = driver.team_colour ? `#${driver.team_colour}` : (driverColors[driver.team_name] || '#ffffff');

                                return (
                                    <motion.div
                                        layout
                                        key={driver.driver_number}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        onClick={() => navigate(`/driver/${driver.driver_number}`)}
                                        className="group relative bg-[#0f0f11] border border-white/10 rounded-xl overflow-hidden aspect-[3/4] flex flex-col justify-end transition-all duration-500 hover:border-white/30 hover:-translate-y-2 cursor-pointer"
                                        style={{ boxShadow: `0 10px 40px ${color}05` }}
                                    >
                                        {/* Radial Top Glow */}
                                        <div
                                            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0"
                                            style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 60%)` }}
                                        />

                                        {/* Giant Watermark Driver Number */}
                                        <div className="absolute top-4 right-4 z-0">
                                            <span className="text-8xl font-orbitron font-black italic text-white/5 group-hover:text-white/10 transition-colors duration-500">
                                                {driver.driver_number}
                                            </span>
                                        </div>

                                        {/* High-Res Driver Image */}
                                        <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-16">
                                            <img
                                                src={getHighResImage(driver.headshot_url)}
                                                alt={driver.full_name}
                                                className="w-[90%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 origin-bottom"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>

                                        {/* Bottom Info Plaque */}
                                        <div className="relative z-20 bg-carbon-black/80 backdrop-blur-md border-t border-white/10 p-5 transition-colors duration-300">
                                            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-titanium-silver uppercase tracking-widest font-bold mb-1">
                                                        {driver.team_name}
                                                    </p>
                                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">
                                                        {driver.full_name}
                                                    </h3>
                                                </div>
                                                <span className="text-2xl font-orbitron font-bold italic text-white leading-none">
                                                    {driver.driver_number}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DriverData;