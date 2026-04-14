import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const navigate = useNavigate;

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Video or Cinematic Placeholder */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-hero-gradient z-10"></div>
                <img
                    src="/images/hero.png"
                    alt="F1 Car Hero"
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

            {/* SVG Racing Line Animation */}
            <svg viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full z-10 pointer-events-none" preserveAspectRatio="none">
                <motion.path
                    d="M -100,500 C 200,500 400,200 800,400 S 1400,100 2000,300"
                    fill="transparent"
                    stroke="#FF1801"
                    strokeWidth="4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                />
            </svg>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic mb-4 tracking-tighter text-white">
                        PURE <span className="text-f1-red text-gradient block md:inline">VELOCITY</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-titanium-silver font-medium max-w-2xl mx-auto mb-8">
                        Experience the pinnacle of motorsport engineering and storytelling.
                    </p>
                    <Link to='/leaderboard'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-f1-red text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-white hover:text-carbon-black transition-colors duration-300"
                        >
                            Explore the Grid
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-1 h-12 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="w-full bg-f1-red"
                        initial={{ height: 0, opacity: 1 }}
                        animate={{ height: "100%", opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
