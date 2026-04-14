import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../AudioContext'; // Adjust path if your context folder is elsewhere

const VideoShowcase = () => {
    // Grab the global mute state and setter from our custom context
    const { isGlobalMuted, setIsGlobalMuted } = useAudio();

    // Ref to directly control the HTML5 video element's audio engine
    const videoRef = useRef(null);

    // Sync the video's actual muted property with our global React state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isGlobalMuted;
        }
    }, [isGlobalMuted]);

    const toggleMute = () => {
        setIsGlobalMuted(!isGlobalMuted);
    };

    return (
        <section className="relative w-full h-[50vh] md:h-[70vh] bg-carbon-black overflow-hidden border-y border-white/10 group">
            {/* Dark overlays to make text pop and blend the edges (pointer-events-none ensures they don't block clicks) */}
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-carbon-black to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon-black to-transparent z-20 pointer-events-none" />

            <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            >
                <source src="/videos/f1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Mute/Unmute Button */}
            <button
                onClick={toggleMute}
                className="absolute bottom-8 right-8 z-40 bg-black/50 hover:bg-f1-red text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:scale-110"
                aria-label={isGlobalMuted ? "Unmute video" : "Mute video"}
            >
                {isGlobalMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            {/* Typography Overlay */}
            <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl"
                >
                    PURE <span className="text-f1-red">ADRENALINE</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-4 text-titanium-silver text-sm md:text-lg font-bold tracking-widest uppercase drop-shadow-lg"
                >
                    Experience the pinnacle of motorsport
                </motion.p>
            </div>
        </section>
    );
};

export default VideoShowcase;