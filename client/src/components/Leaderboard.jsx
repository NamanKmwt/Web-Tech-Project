import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy, Users } from 'lucide-react'; // Added Trophy and Users icons

// Reusable Team Colors
const teamColors = {
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

const getHighResImage = (url) => {
    if (!url) return '';
    return url.split('.transform/')[0];
};

// --- DRIVER LIST COMPONENT ---
const DriverList = ({ hoveredDriver, setHoveredDriver }) => {
    const [gridData, setGridData] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const displayedDrivers = showAll ? gridData.drivers : gridData.drivers.slice(0, 10);

    return (
        <>
            <div className="w-full lg:w-2/3 flex flex-col space-y-2">
                {displayedDrivers.map((driver, index) => {
                    const rank = index + 1;
                    const color = driver.team_colour ? `#${driver.team_colour}` : (teamColors[driver.team_name] || '#ffffff');

                    return (
                        <motion.div
                            key={driver.driver_number}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
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

            {/* Right Side Hover State */}
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

// --- TEAM LIST COMPONENT (NEW) ---
const TeamList = ({ hoveredTeam, setHoveredTeam }) => {
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current championship standings from OpenF1
        fetch('http://localhost:5001/api/f1/current-teams')
            .then(res => res.json())
            .then(data => {
                // Remove duplicates and sort by position
                const uniqueTeams = data.reduce((acc, current) => {
                    const x = acc.find(item => item.team_name === current.team_name);
                    if (!x) return acc.concat([current]);
                    return acc;
                }, []);

                const sortedTeams = uniqueTeams.sort((a, b) => a.position_current - b.position_current);
                setTeamData(sortedTeams);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <LeaderboardSkeleton />;
    if (!teamData.length) return <div className="text-red-500">Failed to load constructor standings.</div>;

    return (
        <>
            <div className="w-full lg:w-2/3 flex flex-col space-y-2">
                {teamData.map((team, index) => {
                    const color = teamColors[team.team_name] || '#ffffff';

                    return (
                        <motion.div
                            key={team.team_name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onMouseEnter={() => setHoveredTeam(team)}
                            onMouseLeave={() => setHoveredTeam(null)}
                            className={`flex items-center justify-between p-4 border-l-4 transition-all duration-300 cursor-pointer ${hoveredTeam?.team_name === team.team_name ? 'bg-white/10' : 'bg-carbon-black hover:bg-white/5'
                                }`}
                            style={{ borderLeftColor: color }}
                        >
                            <div className="flex items-center space-x-6">
                                <span className="text-3xl font-black italic text-titanium-silver w-8">{team.position_current}</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide uppercase">{team.team_name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <div className="text-right">
                                    <span className="text-2xl font-orbitron font-bold italic text-white block leading-none">
                                        {team.points_current} <span className="text-sm text-titanium-silver normal-case font-sans">PTS</span>
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Right Side Hover State for Teams */}
            <div className="w-full lg:w-1/3 aspect-[3/4] bg-carbon-black overflow-hidden relative border border-white/10 hidden lg:block sticky top-24 self-start">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={hoveredTeam?.team_name || 'default'}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center p-8"
                    >
                        {hoveredTeam ? (
                            <div className="text-center">
                                {/* Large background glow based on team color */}
                                <div
                                    className="absolute inset-0 opacity-20 blur-[100px] z-0"
                                    style={{ backgroundColor: teamColors[hoveredTeam.team_name] || '#ffffff' }}
                                />
                                <div className="relative z-10 flex flex-col items-center">
                                    <Trophy size={64} style={{ color: teamColors[hoveredTeam.team_name] || '#ffffff' }} className="mb-6 drop-shadow-2xl" />
                                    <h3 className="text-4xl font-black italic text-white uppercase leading-none mb-2 text-center drop-shadow-xl">{hoveredTeam.team_name}</h3>
                                    <div className="mt-8 bg-black/50 backdrop-blur-md p-6 rounded-xl border border-white/10">
                                        <p className="text-sm font-bold tracking-widest text-titanium-silver uppercase mb-1">Total Points</p>
                                        <p className="text-6xl font-orbitron font-black italic text-white drop-shadow-2xl">{hoveredTeam.points_current}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full w-full opacity-30">
                                <span className="text-f1-gray font-orbitron font-black text-6xl italic text-center">Hover<br />Constructor</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};

// --- SKELETON COMPONENT ---
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

// --- MAIN PARENT COMPONENT ---
const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'teams'
    const [hoveredDriver, setHoveredDriver] = useState(null);
    const [hoveredTeam, setHoveredTeam] = useState(null);

    return (
        <section className="py-24 bg-f1-dark relative">
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none z-0">
                <h2 className="text-[20vw] font-black italic text-white leading-none overflow-hidden">STANDINGS</h2>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">THE <span className="text-f1-red">PODIUM</span></h2>
                    <p className="text-titanium-silver mt-2 mb-8">World Championship Battle</p>

                    {/* Toggle Switch */}
                    <div className="inline-flex bg-carbon-black p-1 border border-white/10 rounded-md">
                        <button
                            onClick={() => setActiveTab('drivers')}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-sm ${activeTab === 'drivers' ? 'bg-f1-red text-white' : 'text-titanium-silver hover:text-white hover:bg-white/5'}`}
                        >
                            <Users size={16} />
                            <span>Drivers</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('teams')}
                            className={`flex items-center space-x-2 px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 rounded-sm ${activeTab === 'teams' ? 'bg-f1-red text-white' : 'text-titanium-silver hover:text-white hover:bg-white/5'}`}
                        >
                            <Trophy size={16} />
                            <span>Constructors</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <Suspense fallback={<LeaderboardSkeleton />}>
                        {activeTab === 'drivers' ? (
                            <DriverList hoveredDriver={hoveredDriver} setHoveredDriver={setHoveredDriver} />
                        ) : (
                            <TeamList hoveredTeam={hoveredTeam} setHoveredTeam={setHoveredTeam} />
                        )}
                    </Suspense>
                </div>
            </div>
        </section>
    );
};

export default Leaderboard;