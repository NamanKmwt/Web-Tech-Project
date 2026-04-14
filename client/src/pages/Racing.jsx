import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Helper to generate a clean filename from the API's country name
const getScenicBackground = (countryName) => {
    if (!countryName) return '/images/races/default-track.png';

    // Converts "Saudi Arabia" -> "saudi-arabia"
    const safeName = countryName.toLowerCase().replace(/\s+/g, '-');
    // Using .png to match your original static data format!
    return `/images/races/${safeName}.png`;
};

const Racing = () => {
    const navigate = useNavigate();
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const currentYear = new Date().getFullYear();

        fetch(`https://api.openf1.org/v1/meetings?year=${currentYear}`)
            .then(res => res.json())
            .then(data => {
                const officialRaces = data
                    .filter(meeting => !meeting.meeting_name.toLowerCase().includes('testing'))
                    .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
                    // Pre-calculate the round number so it doesn't change when we filter the list!
                    .map((race, index) => ({ ...race, round_number: index + 1 }));

                setRaces(officialRaces);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching calendar:", error);
                setLoading(false);
            });
    }, []);

    const formatRaceDate = (dateString) => {
        const options = { month: 'short', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getRaceStatus = (dateEnd) => {
        const today = new Date();
        const raceDate = new Date(dateEnd);
        return today > raceDate ? 'Completed' : 'Upcoming';
    };

    // Filter the races based on the selected status button
    const filteredRaces = races.filter(race => {
        if (filterStatus === 'All') return true;
        return getRaceStatus(race.date_end) === filterStatus;
    });

    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 text-center md:text-left"
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-2 block">{new Date().getFullYear()} Season</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">RACING <span className="text-titanium-silver">CALENDAR</span></h1>
                </motion.div>

                {/* Filter Buttons */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center md:justify-start gap-3 mb-10"
                    >
                        {['All', 'Upcoming', 'Completed'].map((status) => {
                            const isActive = filterStatus === status;

                            return (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${isActive
                                            ? 'bg-f1-red border-f1-red text-white'
                                            : 'bg-transparent border-white/10 text-titanium-silver hover:border-white/30 hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </motion.div>
                )}

                {loading ? (
                    // Loading Skeletons
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="min-h-[200px] bg-white/5 border border-white/10 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    // Race List Wrapper
                    <motion.div layout className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredRaces.map((race) => {
                                const status = getRaceStatus(race.date_end);
                                const isCompleted = status === 'Completed';

                                return (
                                    <motion.div
                                        layout
                                        key={race.meeting_key}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.4 }}
                                        className={`relative overflow-hidden p-6 flex flex-col md:flex-row items-start md:items-center justify-between group rounded-xl border transition-all duration-500 min-h-[200px] ${isCompleted ? 'border-white/5 opacity-70 hover:opacity-100' : 'border-white/10 hover:border-f1-red'
                                            }`}
                                    >
                                        {/* SCENIC BACKGROUND - VIBRANT STYLE RESTORED */}
                                        <img
                                            src={getScenicBackground(race.country_name)}
                                            alt={race.circuit_short_name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 z-0 group-hover:scale-105"
                                            onError={(e) => {
                                                // Fallback if local image doesn't exist yet
                                                e.target.src = 'https://images.unsplash.com/photo-1541348263662-e06836264be8?q=80&w=1000&auto=format&fit=crop';
                                            }}
                                        />

                                        {/* GRADIENT OVERLAY - Lightened so right side is highly visible */}
                                        <div className="absolute inset-0 z-0 bg-gradient-to-r from-carbon-black via-carbon-black/60 to-transparent" />

                                        {/* Track Map Watermark overlaying the scenic photo */}
                                        {race.circuit_image && (
                                            <div
                                                className="absolute inset-y-0 right-0 w-1/3 z-0 bg-contain bg-right bg-no-repeat opacity-30 pointer-events-none mix-blend-screen transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${race.circuit_image})`, backgroundPosition: 'calc(100% + 20px) center' }}
                                            />
                                        )}

                                        {/* Left Side: Number & Name */}
                                        <div className="relative z-10 flex items-center space-x-6 mb-4 md:mb-0 w-full md:w-auto">
                                            <div className={`flex flex-col items-center justify-center min-w-[80px] h-20 backdrop-blur-md rounded-lg transition-colors duration-300 shadow-xl border border-white/10 ${isCompleted ? 'bg-black/40' : 'bg-black/60 group-hover:bg-f1-red'
                                                }`}>
                                                <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-white/50' : 'text-titanium-silver group-hover:text-white'}`}>Round</span>
                                                <span className="text-3xl font-black italic text-white">{race.round_number}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    {race.country_flag && (
                                                        <img src={race.country_flag} alt={race.country_name} className="w-6 h-auto rounded-sm drop-shadow-md" />
                                                    )}
                                                    <h3 className="text-2xl font-bold italic text-white drop-shadow-lg">{race.meeting_name}</h3>
                                                </div>
                                                <p className="text-white/80 text-sm flex items-center gap-2 drop-shadow-md font-medium">
                                                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${isCompleted ? 'bg-white/40' : 'bg-f1-red'}`} />
                                                    {race.location}, {race.country_name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Date & Button */}
                                        <div className="relative z-10 flex items-center gap-3 sm:gap-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                                            <div className="text-left md:text-right bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                                                <span className={`block text-xl font-bold ${isCompleted ? 'text-white/70' : 'text-white'}`}>
                                                    {formatRaceDate(race.date_start)}
                                                </span>
                                                <span className={`text-xs uppercase tracking-widest font-semibold ${isCompleted ? 'text-white/40' : 'text-f1-red'}`}>
                                                    {status}
                                                </span>
                                            </div>

                                            {!isCompleted && (
                                                <button
                                                    onClick={() => navigate('/tickets-coming-soon', {
                                                        state: {
                                                            raceName: race.meeting_name,
                                                            raceDate: race.date_start,
                                                            raceLocation: `${race.location}, ${race.country_name}`,
                                                        }
                                                    })}
                                                    className="px-5 sm:px-8 py-3 bg-white text-carbon-black border border-transparent uppercase tracking-widest text-[10px] sm:text-xs font-black hover:bg-f1-red hover:text-white transition-all duration-300 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,24,1,0.6)]"
                                                >
                                                    Tickets
                                                </button>
                                            )}
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

export default Racing;