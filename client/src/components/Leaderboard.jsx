import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react'; // Added Chevron icon
import useSWR from 'swr';
import { fetcher, API_BASE } from '../utils/fetcher';

const driverColors = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#DC0000',
    'McLaren': '#FF8000',
    'Mercedes': '#6CD3BF',
    'Aston Martin': '#006F62'
};

const getHighResImage = (url) => {
    if (!url) return '';
    // This chops off the ".transform/2col/image.png" part entirely, requesting the raw original file
    return url.split('.transform/')[0];
};

const DriverList = ({ hoveredDriver, setHoveredDriver }) => {
    const [gridData, setGridData] = useState(null);
    const [loading, setLoading] = useState(true);
    // 1. Add state to track if we should show all drivers
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5001/api/f1/current-grid')
            .then(res => res.json())
            .then(data => {
                setGridData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <LeaderboardSkeleton />;
    if (!gridData || !gridData.drivers) return <div className="text-red-500">Failed to load standings.</div>;

    // 2. Filter the array based on state
    const displayedDrivers = showAll ? gridData.drivers : gridData.drivers.slice(0, 10);

    return (
        <>
            <div className="w-full lg:w-2/3 flex flex-col space-y-2">
                {displayedDrivers.map((driver, index) => {
                    const rank = index + 1;
                    // Use the color from API if available, fallback to your constant
                    const color = driver.team_colour ? `#${driver.team_colour}` : (driverColors[driver.team_name] || '#ffffff');

                    return (
                        <motion.div
                            key={driver.driver_number}
                            onMouseEnter={() => setHoveredDriver(driver)}
                            onMouseLeave={() => setHoveredDriver(null)}
                            className={`flex items-center justify-between p-4 border-l-4 transition-all duration-300 cursor-pointer ${hoveredDriver?.driver_number === driver.driver_number ? 'bg-white/10' : 'bg-carbon-black hover:bg-white/5'
                                }`}
                            style={{ borderLeftColor: color }}
                        >
                            <div className="flex items-center space-x-6">
                                <span className="text-3xl font-black italic text-titanium-silver w-8">{rank}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide">{driver.full_name}</h3>
                                    <p className="text-sm text-titanium-silver uppercase font-semibold">{driver.team_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="text-f1-gray font-orbitron font-bold italic text-3xl opacity-30">
                                    {driver.driver_number}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}

                {/* 3. Add the Show More / Show Less Button */}
                {gridData.drivers.length > 10 && (
                    <motion.button
                        layout
                        onClick={() => setShowAll(!showAll)}
                        className="mt-4 flex items-center justify-center space-x-2 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-titanium-silver hover:text-white transition-all duration-300 font-bold tracking-widest uppercase text-sm rounded-sm"
                    >
                        <span>{showAll ? 'Show Less' : 'View Full Grid'}</span>
                        <ChevronDown size={20} className={`transform transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                    </motion.button>
                )}
            </div>

            <div className="w-full lg:w-1/3 aspect-[3/4] bg-carbon-black overflow-hidden relative border border-white/10 hidden lg:block sticky top-24 self-start">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredDriver?.driver_number || 'default'}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-end justify-center pb-0"
                    >
                        {hoveredDriver ? (
                            <div className="absolute inset-0 bg-contain bg-no-repeat bg-bottom transition-all duration-300 pointer-events-none"
                                style={{
                                    backgroundImage: `url('${getHighResImage(hoveredDriver.headshot_url)}')`,
                                    backgroundSize: '450px'
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full w-full opacity-30">
                                <span className="text-f1-gray font-orbitron font-black text-6xl italic text-center">Hover<br />Driver</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-carbon-black to-transparent z-10 pointer-events-none" />
            </div>
        </>
    );
};

const LeaderboardSkeleton = () => (
    <>
        <div className="w-full lg:w-2/3 flex flex-col space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="h-24 bg-white/5 border border-white/10 animate-pulse" />
            ))}
        </div>
        <div className="w-full lg:w-1/3 aspect-[3/4] bg-white/5 animate-pulse hidden lg:block sticky top-24 self-start" />
    </>
);

const Leaderboard = () => {
    const [hoveredDriver, setHoveredDriver] = useState(null);

    return (
        <section className="py-24 bg-f1-dark relative">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none z-0">
                <h2 className="text-[20vw] font-black italic text-white leading-none">STANDINGS</h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">THE <span className="text-f1-red">PODIUM</span></h2>
                    <p className="text-titanium-silver mt-2">World Championship Battle</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <Suspense fallback={<LeaderboardSkeleton />}>
                        <DriverList hoveredDriver={hoveredDriver} setHoveredDriver={setHoveredDriver} />
                    </Suspense>
                </div>
            </div>
        </section>
    );
};

export default Leaderboard;