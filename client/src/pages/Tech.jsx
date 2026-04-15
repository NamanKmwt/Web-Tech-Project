import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import InteractiveTrack from '../components/InteractiveTrack';
import { API_BASE, fetcher } from '../utils/fetcher';
import { Thermometer, Droplets, Wind, Activity, Gauge, Zap, MapPin, ChevronDown } from 'lucide-react';

const CAR_PROFILES = {
    "Red Bull RB20": {
        image: "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png",
        dragCoefficient: "0.24",
        downforceLevel: "High (High-Rake)",
        drsEfficiency: "98%",
        mguMode: "Aggressive",
        description: "Focuses on floor-generated downforce and extreme DRS efficiency."
    },
    "Ferrari SF-24": {
        image: "https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png",
        dragCoefficient: "0.26",
        downforceLevel: "Ultra-High",
        drsEfficiency: "91%",
        mguMode: "Balanced",
        description: "Designed for peak mechanical grip and a stable aerodynamic platform."
    },
    "McLaren MCL38": {
        image: "https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png",
        dragCoefficient: "0.25",
        downforceLevel: "High (Efficient)",
        drsEfficiency: "94%",
        mguMode: "Max Deploy",
        description: "Optimized for high-speed cornering stability and low drag in qualifying."
    }
};

const Tech = () => {
    const [selectedLocation, setSelectedLocation] = useState('Singapore');
    const [selectedCar, setSelectedCar] = useState('Red Bull RB20');
    
    // 1. Fetch Calendar to find meeting_key
    const { data: calendarData } = useSWR(`https://api.openf1.org/v1/meetings?year=2026`, fetcher);
    const activeMeeting = calendarData?.find(m => m.country_name === selectedLocation);
    const meetingKey = activeMeeting?.meeting_key || 'latest';

    // 2. Fetch LIVE weather for the specific meeting
    const { data: liveWeather } = useSWR(
        `https://api.openf1.org/v1/weather?meeting_key=${meetingKey}`, 
        fetcher
    );
    const currentWeather = liveWeather?.length > 0 ? liveWeather[liveWeather.length - 1] : null;

    // 3. Fetch Internal Tech Specs
    const { data: techData, isLoading: techLoading } = useSWR(`${API_BASE}/tech/races`, fetcher);
    const activeRace = techData?.find(r => 
        (r.locationName === selectedLocation) || (r.location === selectedLocation)
    );

    const currentCar = CAR_PROFILES[selectedCar] || CAR_PROFILES["Red Bull RB20"];

    if (techLoading) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-f1-red animate-pulse tracking-[0.5em] font-black uppercase">
            Syncing Command Center...
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 min-h-screen bg-[#0a0a0c] text-white px-4 pb-20">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* --- 1. TOP SELECTOR: PRIMARY CIRCUIT --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                    <div className="flex-1">
                        <span className="text-f1-red font-bold uppercase tracking-[0.3em] text-[10px] mb-1 block">Live Uplink</span>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                            Pit Wall <span className="text-white/20">Command</span>
                        </h1>
                    </div>

                    <div className="relative group min-w-[280px]">
                        <p className="text-[10px] uppercase text-gray-500 font-black mb-2 flex items-center tracking-widest">
                            <MapPin size={12} className="mr-2 text-f1-red"/> Primary Circuit
                        </p>
                        <div className="relative">
                            <select 
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full appearance-none bg-white/5 border border-white/10 hover:border-f1-red/50 px-5 py-3 rounded-xl text-xs font-bold tracking-widest outline-none transition-all cursor-pointer"
                            >
                                {calendarData?.map((m, idx) => (
                                    <option key={idx} value={m.country_name} className="bg-[#1a1a1c] text-white">
                                        {m.country_name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-f1-red" size={16} />
                        </div>
                    </div>
                </div>

                {/* --- 2. ENVIRONMENTAL HUD (LIVE DATA) --- */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Air Temp', val: currentWeather ? `${currentWeather.air_temperature}°C` : `${activeRace?.weatherNow?.temp || '--'}°C`, icon: <Thermometer size={14}/> },
                        { label: 'Track Temp', val: currentWeather ? `${currentWeather.track_temperature}°C` : 'Optimal', icon: <Activity size={14}/> },
                        { label: 'Humidity', val: currentWeather ? `${currentWeather.humidity}%` : `${activeRace?.weatherNow?.humidity || '--'}%`, icon: <Droplets size={14}/> },
                        { label: 'Wind Speed', val: currentWeather ? `${currentWeather.wind_speed} km/h` : `${activeRace?.weatherNow?.windSpeed || '--'} km/h`, icon: <Wind size={14}/> },
                        { label: 'Rainfall', val: currentWeather?.rainfall === 1 ? 'RAINING' : 'DRY', icon: <Activity size={14}/>, color: currentWeather?.rainfall === 1 ? 'text-blue-400' : 'text-f1-red' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center transition-all hover:bg-white/10">
                            <div className="flex items-center justify-center space-x-2 text-gray-500 mb-1">
                                {stat.icon}
                                <span className="text-[10px] font-bold uppercase">{stat.label}</span>
                            </div>
                            <p className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.val}</p>
                        </div>
                    ))}
                </div>

                {/* --- 3. INTERACTIVE CIRCUIT SECTION --- */}
                <div className="w-full">
                    <InteractiveTrack trackName={selectedLocation} />
                </div>

                {/* --- 4. BOTTOM SELECTOR: DATA PROFILE --- */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-md ml-auto">
                    <div className="relative group">
                        <p className="text-[10px] uppercase text-gray-500 font-black mb-2 flex items-center tracking-widest">
                            <Activity size={12} className="mr-2 text-f1-red"/> Data Profile (Chassis)
                        </p>
                        <div className="relative">
                            <select 
                                value={selectedCar}
                                onChange={(e) => setSelectedCar(e.target.value)}
                                className="w-full appearance-none bg-[#0a0a0c] border border-white/10 hover:border-f1-red/50 px-5 py-3 rounded-xl text-xs font-bold tracking-widest outline-none transition-all cursor-pointer"
                            >
                                {Object.keys(CAR_PROFILES).map((carName) => (
                                    <option key={carName} value={carName} className="bg-[#1a1a1c]">
                                        {carName.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>
                
                {/* --- 5. DYNAMIC CHASSIS SPECIFICATIONS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-black italic uppercase mb-6 tracking-tighter leading-none">
                            Aerodynamic <span className="text-f1-red">Profile</span>
                        </h3>
                        <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative group overflow-hidden p-8">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={selectedCar}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.4 }}
                                    src={currentCar.image} 
                                    alt={selectedCar}
                                    className="w-full h-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,24,1,0.15)]"
                                    onError={(e) => {
                                        e.target.src = "https://media.formula1.com/content/dam/fom-website/teams/2024/formula-1-car-silhouette.png";
                                    }}
                                />
                            </AnimatePresence>
                        </div>
                        <p className="mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-[0.25em] leading-relaxed italic border-l-2 border-f1-red pl-4">
                            {currentCar.description}
                        </p>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group">
                            <div className="flex items-center space-x-3 mb-6 text-f1-red">
                                <Gauge size={22} />
                                <h4 className="font-black uppercase tracking-widest text-[11px]">Aero-Dynamics</h4>
                            </div>
                            <ul className="space-y-5 text-[11px] font-bold">
                                <li className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500 uppercase">Drag Coefficient</span> <span className="text-white font-mono">{currentCar.dragCoefficient}</span></li>
                                <li className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500 uppercase">Downforce Load</span> <span className="text-white uppercase">{currentCar.downforceLevel}</span></li>
                                <li className="flex justify-between"><span className="text-gray-500 uppercase">DRS Efficiency</span> <span className="text-white">{currentCar.drsEfficiency}</span></li>
                            </ul>
                        </div>
                        
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group">
                            <div className="flex items-center space-x-3 mb-6 text-f1-red">
                                <Zap size={22} />
                                <h4 className="font-black uppercase tracking-widest text-[11px]">Power Unit</h4>
                            </div>
                            <ul className="space-y-5 text-[11px] font-bold">
                                <li className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500 uppercase">MGU-K Mapping</span> <span className="text-white uppercase">{currentCar.mguMode}</span></li>
                                <li className="flex justify-between border-b border-white/5 pb-3"><span className="text-gray-500 uppercase">Energy Harvest</span> <span className="text-white">96.4%</span></li>
                                <li className="flex justify-between"><span className="text-gray-500 uppercase">SoC Status</span> <span className="text-green-500 font-mono tracking-tighter">OPTIMAL</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default Tech;