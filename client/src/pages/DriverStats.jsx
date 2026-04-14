import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Flag, Users, Activity, Gauge, Zap, Settings2 } from 'lucide-react'; // Added ArrowRight

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

const DriverStats = () => {
    const { id } = useParams(); // driver_number
    const [driver, setDriver] = useState(null);
    const [allDrivers, setAllDrivers] = useState([]); // NEW: Store the full grid for navigation
    const [telemetry, setTelemetry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reset loading state when the ID changes so the transition feels smooth
        setLoading(true);

        // 1. Fetch the driver info and save the full grid
        const fetchDriverData = fetch('http://localhost:5001/api/f1/current-grid')
            .then(res => res.json())
            .then(data => {
                setAllDrivers(data.drivers); // Save the whole list for prev/next
                return data.drivers.find(d => d.driver_number.toString() === id);
            });

        // 2. Fetch the car telemetry from YOUR backend
        const fetchTelemetry = fetch(`http://localhost:5001/api/f1/telemetry/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    // Find the data point with the absolute highest speed
                    return data.reduce((max, curr) => curr.speed > max.speed ? curr : max, data[0]);
                }
                return null;
            })
            .catch(() => null);

        // Run both fetches in parallel
        Promise.all([fetchDriverData, fetchTelemetry])
            .then(([foundDriver, maxTelemetry]) => {
                setDriver(foundDriver);
                setTelemetry(maxTelemetry);
                setLoading(false);
            })
            .catch(() => setLoading(false));

    }, [id]); // This ensures the data re-fetches when we click Next/Prev and the URL 'id' changes

    if (loading) {
        return (
            <div className="min-h-screen bg-carbon-black flex items-center justify-center">
                <div className="text-titanium-silver font-bold tracking-widest uppercase animate-pulse">Loading Telemetry...</div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="min-h-screen bg-carbon-black flex flex-col items-center justify-center space-y-6">
                <div className="text-f1-red text-2xl font-bold tracking-widest uppercase">Driver Not Found</div>
                <Link to="/drivers" className="text-titanium-silver hover:text-white transition-colors">Return to Grid</Link>
            </div>
        );
    }

    const color = driver.team_colour ? `#${driver.team_colour}` : (driverColors[driver.team_name] || '#ffffff');

    // --- NEW: Calculate Previous and Next Drivers ---
    const currentIndex = allDrivers.findIndex(d => d.driver_number.toString() === id);
    let prevDriver = null;
    let nextDriver = null;

    if (allDrivers.length > 0 && currentIndex !== -1) {
        // If at the beginning, wrap around to the end. Otherwise, go back one.
        prevDriver = currentIndex === 0 ? allDrivers[allDrivers.length - 1] : allDrivers[currentIndex - 1];
        // If at the end, wrap around to the beginning. Otherwise, go forward one.
        nextDriver = currentIndex === allDrivers.length - 1 ? allDrivers[0] : allDrivers[currentIndex + 1];
    }
    // ------------------------------------------------

    return (
        <div className="min-h-screen bg-carbon-black text-white pt-28 pb-20 relative overflow-hidden">
            {/* Background Accent */}
            <div
                className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none"
                style={{ backgroundColor: color, transform: 'translate(30%, -30%)' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Link to="/drivers" className="inline-flex items-center space-x-2 text-titanium-silver hover:text-white transition-colors mb-12 group">
                    <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold tracking-widest uppercase text-sm">Back to Roster</span>
                </Link>

                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left side: Driver Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="aspect-[3/4] relative flex items-end justify-center">
                            <span
                                className="absolute top-0 left-0 text-[15rem] font-orbitron font-black italic opacity-10 leading-none pointer-events-none"
                                style={{ color: color }}
                            >
                                {driver.driver_number}
                            </span>
                            <img
                                src={getHighResImage(driver.headshot_url)}
                                alt={driver.full_name}
                                className="w-[85%] object-contain drop-shadow-2xl relative z-10"
                            />
                        </div>
                    </motion.div>

                    {/* Right side: Stats & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-1/2 space-y-10"
                    >
                        <div>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-1" style={{ backgroundColor: color }} />
                                <span className="text-titanium-silver font-bold uppercase tracking-widest">{driver.team_name}</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-2">
                                {driver.first_name} <br />
                                <span style={{ color: color }}>{driver.last_name}</span>
                            </h1>
                        </div>

                        {/* Standard Info Grid */}
                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                            <div className="bg-white/5 p-6 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                <div className="flex items-center space-x-3 text-titanium-silver mb-2">
                                    <Activity size={20} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Driver No.</span>
                                </div>
                                <p className="text-4xl font-orbitron font-bold italic text-white">{driver.driver_number}</p>
                            </div>

                            <div className="bg-white/5 p-6 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                <div className="flex items-center space-x-3 text-titanium-silver mb-2">
                                    <Users size={20} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Acro</span>
                                </div>
                                <p className="text-4xl font-black italic text-white">{driver.name_acronym}</p>
                            </div>

                            <div className="col-span-2 bg-white/5 p-6 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                <div className="flex items-center space-x-3 text-titanium-silver mb-2">
                                    <Flag size={20} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Broadcast Name</span>
                                </div>
                                <p className="text-2xl font-bold text-white tracking-wide">{driver.broadcast_name}</p>
                            </div>

                            {/* Telemetry Data Dashboard */}
                            {telemetry && (
                                <div className="col-span-2 mt-2 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-titanium-silver mb-4">Peak Telemetry Data</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-black/40 p-4 rounded-lg border-l-2" style={{ borderLeftColor: color }}>
                                            <div className="flex items-center space-x-2 text-titanium-silver mb-1">
                                                <Gauge size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Top Speed</span>
                                            </div>
                                            <p className="text-2xl font-orbitron font-black italic text-white">
                                                {telemetry.speed} <span className="text-xs font-sans text-titanium-silver normal-case">km/h</span>
                                            </p>
                                        </div>

                                        <div className="bg-black/40 p-4 rounded-lg border-l-2" style={{ borderLeftColor: color }}>
                                            <div className="flex items-center space-x-2 text-titanium-silver mb-1">
                                                <Zap size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Max RPM</span>
                                            </div>
                                            <p className="text-2xl font-orbitron font-black italic text-white">
                                                {(telemetry.rpm / 1000).toFixed(1)}k
                                            </p>
                                        </div>

                                        <div className="bg-black/40 p-4 rounded-lg border-l-2" style={{ borderLeftColor: color }}>
                                            <div className="flex items-center space-x-2 text-titanium-silver mb-1">
                                                <Settings2 size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Gear</span>
                                            </div>
                                            <p className="text-2xl font-orbitron font-black italic text-white">
                                                {telemetry.n_gear}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* NEW: Driver Navigation Footer */}
                {allDrivers.length > 0 && prevDriver && nextDriver && (
                    <div className="mt-20 pt-8 border-t border-white/10 flex justify-between items-center">
                        <Link
                            to={`/driver/${prevDriver.driver_number}`} // Assuming your route is /drivers/:id
                            className="group flex flex-col items-start hover:bg-white/5 p-4 rounded-lg transition-colors"
                        >
                            <span className="text-titanium-silver text-xs font-bold uppercase tracking-widest mb-1 flex items-center">
                                <ArrowLeft size={14} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                                Previous
                            </span>
                            <span className="text-2xl md:text-3xl font-black italic text-white group-hover:text-f1-red transition-colors">
                                {prevDriver.last_name}
                            </span>
                        </Link>

                        <Link
                            to={`/driver/${nextDriver.driver_number}`}
                            className="group flex flex-col items-end hover:bg-white/5 p-4 rounded-lg transition-colors text-right"
                        >
                            <span className="text-titanium-silver text-xs font-bold uppercase tracking-widest mb-1 flex items-center">
                                Next
                                <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </span>
                            <span className="text-2xl md:text-3xl font-black italic text-white group-hover:text-f1-red transition-colors">
                                {nextDriver.last_name}
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverStats;