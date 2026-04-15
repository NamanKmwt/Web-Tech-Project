import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flag, Users, Activity, Gauge, Zap, Settings2, BookOpen, ExternalLink } from 'lucide-react';
import { API_BASE } from '../utils/fetcher';

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

const getHighResImage = (url) => {
    if (!url) return '';
    return url.split('.transform/')[0];
};

// Animation variants for staggered loading
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const DriverStats = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [allDrivers, setAllDrivers] = useState([]);
    const [telemetry, setTelemetry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState("");
    const [bioSource, setBioSource] = useState("");

    useEffect(() => {
        setLoading(true);

        const fetchDriverData = fetch(`${API_BASE}/f1/current-grid`)
            .then(res => res.json())
            .then(data => {
                setAllDrivers(data.drivers);
                const foundDriver = data.drivers.find(d => d.driver_number.toString() === id);
                
                if (foundDriver) {
                    fetch(`${API_BASE}/f1/bio/${foundDriver.full_name}`)
                        .then(res => res.json())
                        .then(bioData => {
                            setBio(bioData.bio);
                            setBioSource(bioData.sourceUrl);
                        });
                }
                
                return foundDriver;
            });

        const fetchTelemetry = fetch(`${API_BASE}/f1/telemetry/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    return data.reduce((max, curr) => curr.speed > max.speed ? curr : max, data[0]);
                }
                return null;
            })
            .catch(() => null);

        Promise.all([fetchDriverData, fetchTelemetry])
            .then(([foundDriver, maxTelemetry]) => {
                setDriver(foundDriver);
                setTelemetry(maxTelemetry);
                setLoading(false);
            })
            .catch(() => setLoading(false));

    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 border-t-4 border-f1-red rounded-full animate-spin"></div>
                    <span className="text-white font-bold tracking-widest uppercase animate-pulse text-sm">Loading</span>
                </div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center space-y-6">
                <div className="text-f1-red text-3xl font-black italic tracking-widest uppercase">Driver Not Found</div>
                <Link to="/drivers" className="text-gray-400 hover:text-white flex items-center space-x-2 transition-colors">
                    <ArrowLeft size={16} /> <span>Return to Grid</span>
                </Link>
            </div>
        );
    }

    const color = driver.team_colour ? `#${driver.team_colour}` : (driverColors[driver.team_name] || '#ffffff');

    const currentIndex = allDrivers.findIndex(d => d.driver_number.toString() === id);
    let prevDriver = null;
    let nextDriver = null;

    if (allDrivers.length > 0 && currentIndex !== -1) {
        prevDriver = currentIndex === 0 ? allDrivers[allDrivers.length - 1] : allDrivers[currentIndex - 1];
        nextDriver = currentIndex === allDrivers.length - 1 ? allDrivers[0] : allDrivers[currentIndex + 1];
    }

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white pt-28 pb-20 relative overflow-hidden font-sans">
            
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
            <div
                className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full blur-[200px] opacity-15 pointer-events-none mix-blend-screen"
                style={{ backgroundColor: color, transform: 'translate(40%, -40%)' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Back Button */}
                <Link to="/drivers" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-12 group">
                    <div className="p-2 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="font-bold tracking-widest uppercase text-xs">Roster Overview</span>
                </Link>

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* Left: Driver Image Hero */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: -30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="aspect-[3/4] relative flex items-end justify-center">
                            {/* Giant Watermark Number */}
                            <span
                                className="absolute top-10 left-0 text-[18rem] font-black italic leading-none pointer-events-none select-none bg-clip-text text-transparent"
                                style={{ 
                                    backgroundImage: `linear-gradient(to bottom, ${color}40, transparent)`,
                                    WebkitTextStroke: `1px ${color}20` 
                                }}
                            >
                                {driver.driver_number}
                            </span>
                            
                            {/* Driver Portrait */}
                            <img
                                src={getHighResImage(driver.headshot_url)}
                                alt={driver.full_name}
                                className="w-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
                                style={{ filter: `drop-shadow(0 0 30px ${color}30)` }}
                            />
                            
                            {/* Base Gradient Fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0c] to-transparent z-20" />
                        </div>
                    </motion.div>

                    {/* Right: Telemetry & Stats Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="w-full lg:w-1/2 space-y-8"
                    >
                        {/* Header Section */}
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-1 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}` }} />
                                <span className="text-gray-300 font-bold uppercase tracking-widest text-sm">{driver.team_name}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] mb-2 drop-shadow-lg">
                                {driver.first_name} <br />
                                <span style={{ color: color }}>{driver.last_name}</span>
                            </h1>
                        </motion.div>

                        {/* Driver Dossier (Glassmorphism Bio) */}
                        {bio && (
                            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 group hover:border-white/20 transition-colors duration-500 shadow-2xl">
                                <div 
                                    className="absolute -top-16 -right-16 w-48 h-48 blur-[70px] opacity-20 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none"
                                    style={{ backgroundColor: color }}
                                />
                                
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <BookOpen size={18} style={{ color: color }} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Driver Dossier</h3>
                                    </div>
                                </div>
                                
                                <p className="text-gray-400 text-sm leading-relaxed relative z-10 text-justify">
                                    {bio}
                                </p>

                                {bioSource && (
                                    <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
                                        <a 
                                            href={bioSource} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
                                            style={{ color: color }}
                                        >
                                            <span>Access Full Secure Report</span>
                                            <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Quick Stats Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                            <div className="bg-black/50 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                                <div className="flex items-center space-x-2 text-gray-500 mb-3">
                                    <Activity size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Racing No.</span>
                                </div>
                                <p className="text-4xl font-black italic text-white">{driver.driver_number}</p>
                            </div>

                            <div className="bg-black/50 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                                <div className="flex items-center space-x-2 text-gray-500 mb-3">
                                    <Users size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Timing Acro</span>
                                </div>
                                <p className="text-4xl font-black italic text-white tracking-widest">{driver.name_acronym}</p>
                            </div>
                        </motion.div>

                        {/* Broadcast Name Bar */}
                        <motion.div variants={itemVariants} className="bg-gradient-to-r from-black/80 to-transparent p-5 rounded-xl border-l-4 border-white/5" style={{ borderLeftColor: color }}>
                            <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <Flag size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Official Broadcast Tag</span>
                            </div>
                            <p className="text-xl font-bold text-white tracking-wide">{driver.broadcast_name}</p>
                        </motion.div>

                        {/* Live Telemetry Dashboard */}
                        {telemetry && (
                            <motion.div variants={itemVariants} className="pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center">
                                        <span className="w-2 h-2 rounded-full animate-pulse mr-2" style={{ backgroundColor: color }}></span>
                                        Peak Session Telemetry
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#121216] p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center space-x-2 text-gray-500 mb-2 relative z-10">
                                            <Gauge size={14} style={{ color: color }} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Top Speed</span>
                                        </div>
                                        <p className="text-2xl font-black italic text-white relative z-10">
                                            {telemetry.speed} <span className="text-xs font-sans text-gray-500 font-normal italic">km/h</span>
                                        </p>
                                    </div>

                                    <div className="bg-[#121216] p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center space-x-2 text-gray-500 mb-2 relative z-10">
                                            <Zap size={14} style={{ color: color }} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Max Revs</span>
                                        </div>
                                        <p className="text-2xl font-black italic text-white relative z-10">
                                            {(telemetry.rpm / 1000).toFixed(1)}<span className="text-xs font-sans text-gray-500 font-normal italic">k</span>
                                        </p>
                                    </div>

                                    <div className="bg-[#121216] p-4 rounded-xl border border-white/5 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-center space-x-2 text-gray-500 mb-2 relative z-10">
                                            <Settings2 size={14} style={{ color: color }} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Gear</span>
                                        </div>
                                        <p className="text-2xl font-black italic text-white relative z-10">
                                            {telemetry.n_gear}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Footer Navigation */}
                {allDrivers.length > 0 && prevDriver && nextDriver && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-24 pt-8 border-t border-white/10 flex justify-between items-center"
                    >
                        <Link
                            to={`/driver/${prevDriver.driver_number}`}
                            className="group flex flex-col items-start hover:bg-white/5 px-6 py-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10"
                        >
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center">
                                <ArrowLeft size={12} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                Previous Sector
                            </span>
                            <span className="text-xl md:text-2xl font-black italic text-white group-hover:text-f1-red transition-colors">
                                {prevDriver.last_name}
                            </span>
                        </Link>

                        <Link
                            to={`/driver/${nextDriver.driver_number}`}
                            className="group flex flex-col items-end hover:bg-white/5 px-6 py-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10 text-right"
                        >
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center">
                                Next Sector
                                <ArrowRight size={12} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-xl md:text-2xl font-black italic text-white group-hover:text-f1-red transition-colors">
                                {nextDriver.last_name}
                            </span>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DriverStats;