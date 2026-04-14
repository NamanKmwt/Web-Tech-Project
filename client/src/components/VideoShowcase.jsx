import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const VideoShowcase = () => {
    // State to track if the video is muted
    const [isMuted, setIsMuted] = useState(true);
    // Ref to directly control the HTML5 video element
    const videoRef = useRef(null);

    const toggleMute = () => {
        const nextMutedState = !isMuted;
        setIsMuted(nextMutedState);
        // Force the video element to update its muted property
        if (videoRef.current) {
            videoRef.current.muted = nextMutedState;
        }
    };

    return (
        <section className="relative w-full h-[50vh] md:h-[70vh] bg-carbon-black overflow-hidden border-y border-white/10 group">
            {/* Dark overlays to make any text pop and blend the edges */}
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-carbon-black to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-carbon-black to-transparent z-20 pointer-events-none" />

            <video
                ref={videoRef}
                autoPlay
                loop
                muted // Must start muted to guarantee autoplay on page load
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
                aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="relative z-30 h-full flex flex-col items-center justify-center   text-center px-4 pointer-events-none">
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