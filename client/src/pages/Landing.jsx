import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../AudioContext';

const Landing = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { setIsGlobalMuted } = useAudio();

    useEffect(() => {
        // Simulate loading assets for 2.5 seconds
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleEnterSite = () => {
        // 1. Play the Vroom sound
        const vroomSound = new Audio('/audio/vroom.mp3'); // Put your file in public/audio/
        vroomSound.volume = 0.5; // Adjust as needed
        vroomSound.play().catch(e => console.log("Audio play failed:", e));

        // 2. Unmute the global app state
        setIsGlobalMuted(false);

        // 3. Navigate to the main site
        navigate('/home');
    };

    return (
        <div className="h-screen w-screen bg-carbon-black flex flex-col items-center justify-center overflow-hidden relative">
            {/* Cool background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-carbon-black to-carbon-black pointer-events-none" />

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center space-y-6 z-10"
                    >
                        <div className="w-16 h-16 border-4 border-white/10 border-t-f1-red rounded-full animate-spin" />
                        <h1 className="text-titanium-silver font-orbitron font-bold tracking-[0.3em] uppercase text-sm animate-pulse">
                            Warming Tyres...
                        </h1>
                    </motion.div>
                ) : (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="z-10 flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-8">
                            SYSTEMS <span className="text-f1-red">READY</span>
                        </h1>
                        <button
                            onClick={handleEnterSite}
                            className="group relative px-8 py-4 bg-f1-red text-white font-bold tracking-widest uppercase overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                            <span className="relative z-10 group-hover:text-f1-red transition-colors duration-300">
                                Let's Go
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Landing;