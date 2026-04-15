import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// The import is now generic as the page is functional
import { MapPin, Ticket, ChevronRight } from 'lucide-react'; 

const getScenicBackground = (countryName) => {
    if (!countryName) return '/images/races/default-track.png';
    const safeName = countryName.toLowerCase().replace(/\s+/g, '-');
    return `/images/races/${safeName}.png`;
};

const Racing = () => {
    const navigate = useNavigate();
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        // Force 2026 to align with your project data
        const currentYear = 2026;

        fetch(`https://api.openf1.org/v1/meetings?year=${currentYear}`)
            .then(res => res.json())
            .then(data => {
                const officialRaces = data
                    .filter(meeting => !meeting.meeting_name.toLowerCase().includes('testing'))
                    .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
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

    const filteredRaces = races.filter(race => {
        if (filterStatus === 'All') return true;
        return getRaceStatus(race.date_end) === filterStatus;
    });

    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white px-4">
            <div className="max-w-6xl mx-auto">
                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <span className="text-f1-red font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Season Schedule</span>
                        <h1 className="text-6xl font-black italic tracking-tighter leading-none uppercase">
                            Racing <span className="text-white/20">Calendar</span>
                        </h1>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        {['All', 'Upcoming', 'Completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filterStatus === status ? 'bg-f1-red text-white shadow-lg' : 'text-gray-500 hover:text-white'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* --- RACE LIST --- */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredRaces.map((race) => {
                                const status = getRaceStatus(race.date_end);
                                const isCompleted = status === 'Completed';

                                return (
                                    <motion.div
                                        layout
                                        key={race.meeting_key}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 min-h-[180px] flex items-center ${
                                            isCompleted ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-f1-red/50'
                                        }`}
                                    >
                                        {/* Background Image */}
                                        <img
                                            src={getScenicBackground(race.country_name)}
                                            alt={race.country_name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541348263662-e06836264be8?auto=format&fit=crop&w=1000&q=80'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                                        {/* Content */}
                                        <div className="relative z-10 w-full px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-8">
                                                {/* Round Number */}
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase text-f1-red tracking-widest mb-1">RND</p>
                                                    <p className="text-4xl font-black italic leading-none">{race.round_number}</p>
                                                </div>

                                                {/* Race Info */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{race.meeting_name}</h3>
                                                        {race.country_flag && <img src={race.country_flag} className="h-4 rounded-sm shadow-sm" alt="flag" />}
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                                        <MapPin size={12} className="text-f1-red" /> {race.location}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Date & Action */}
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-xl font-black italic leading-none mb-1">{formatRaceDate(race.date_start)}</p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-gray-500' : 'text-f1-red'}`}>
                                                        {status}
                                                    </p>
                                                </div>

                                                {!isCompleted && (
                                                    <button
                                                        onClick={() => navigate('/tickets', {
                                                            state: {
                                                                raceName: race.meeting_name,
                                                                raceDate: race.date_start,
                                                                raceLocation: `${race.location}, ${race.country_name}`,
                                                            }
                                                        })}
                                                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-black uppercase text-[10px] tracking-[0.2em] hover:bg-f1-red hover:text-white transition-all shadow-xl active:scale-95"
                                                    >
                                                        <Ticket size={14} /> Buy Tickets
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Racing;