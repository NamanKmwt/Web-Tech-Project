import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE, fetcher } from '../utils/fetcher';

const InteractiveTrack = ({ trackName }) => {
    const { data: track, isLoading: apiLoading } = useSWR(`${API_BASE}/f1/track-info/${trackName}`, fetcher);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSurging, setIsSurging] = useState(false);

    useEffect(() => {
        if (track?.trackIconUrl) {
            setImageLoaded(false); 
            const img = new Image();
            img.src = track.trackIconUrl;
            img.onload = () => setImageLoaded(true);
        }
    }, [track?.trackIconUrl]);

    // Coordinates from your seedTracks for the "Trace" effect
    const pathNodes = track?.mapData?.nodes ? Object.values(track.mapData.nodes) : [];

    const handlePowerSurge = () => {
        setIsSurging(true);
        setTimeout(() => setIsSurging(false), 600);
    };

    if (apiLoading || !imageLoaded) {
        return (
            <div className="w-full h-[450px] bg-[#0a0a0c] rounded-3xl border border-white/5 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-f1-red/20 border-t-f1-red rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full bg-[#0a0a0c] rounded-3xl border border-white/10 p-12 overflow-hidden flex flex-col items-center justify-center"
        >
            {/* --- CYBER AMBIENCE --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-f1-red/10 via-transparent to-transparent pointer-events-none" />

            <div 
                className="relative w-full aspect-[16/9] max-w-[800px] flex items-center justify-center cursor-pointer group"
                onClick={handlePowerSurge}
            >
                {/* 1. THE CIRCUIT IMAGE (The "Carbon" Icon) */}
                <motion.img 
                    animate={isSurging ? { 
                        filter: "invert(1) brightness(3) contrast(1.5) drop-shadow(0 0 30px #ff1801)", 
                        scale: 1.05 
                    } : { 
                        filter: "invert(1) brightness(1.2) contrast(1.2) drop-shadow(0 0 0px #ff1801)", 
                        scale: 1 
                    }}
                    src={track.trackIconUrl} 
                    className="w-full h-full object-contain relative z-10 transition-all duration-300"
                    style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
                />

                {/* 2. THE TELEMETRY BLIP (Automated Orbit) */}
                {pathNodes.length > 1 && (
                    <motion.div
                        key={`${trackName}-blip`}
                        initial={{ left: `${pathNodes[0].cx}%`, top: `${pathNodes[0].cy}%`, opacity: 0 }}
                        animate={{ 
                            left: [...pathNodes.map(n => `${n.cx}%`), `${pathNodes[0].cx}%`],
                            top: [...pathNodes.map(n => `${n.cy}%`), `${pathNodes[0].cy}%`],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            ease: "linear",
                            times: pathNodes.map((_, i) => i / pathNodes.length)
                        }}
                        className="absolute w-3 h-3 bg-white rounded-full z-20 shadow-[0_0_20px_#fff,0_0_40px_#ff1801]"
                    >
                        <div className="absolute inset-0 bg-f1-red rounded-full animate-ping opacity-60" />
                    </motion.div>
                )}

                {/* 3. POWER SURGE SHOCKWAVE */}
                <AnimatePresence>
                    {isSurging && (
                        <motion.div 
                            initial={{ opacity: 0.8, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 2 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 border-[20px] border-f1-red/20 rounded-full z-0 pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* 4. TACTICAL TITLE OVERLAY */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                    <h2 className="text-[12vw] font-black italic uppercase text-white/[0.02] select-none tracking-tighter leading-none">
                        {track.circuitName.split(' ')[0]}
                    </h2>
                    <div className="mt-4 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-f1-red">Outlap Simulation</p>
                        <p className="text-[8px] text-gray-600 uppercase tracking-widest">Click to Re-Sync</p>
                    </div>
                </div>
            </div>

            {/* --- HUD DECORATION --- */}
            <div className="absolute bottom-6 w-full px-12 flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex gap-10">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Sector Status</span>
                        <span className="text-[11px] font-black italic text-white uppercase tracking-tighter">OPTIMIZED_FLOW</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Circuit Metadata</span>
                        <span className="text-[11px] font-black italic text-f1-red uppercase tracking-tighter">TRK_REF_{trackName.toUpperCase()}</span>
                    </div>
                </div>
                
                <div className="text-[10px] font-mono text-gray-700">
                    {trackName.length}.{Math.floor(Math.random() * 9999)} // SEC_SYS_V2.6
                </div>
            </div>
        </motion.div>
    );
};

export default InteractiveTrack;