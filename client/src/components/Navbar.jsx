import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-carbon-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="flex items-center space-x-2 relative group">
                        {/* Minimal F1 Logo equivalent for brand styling */}
                        <span className="font-orbitron font-black text-3xl italic tracking-tighter text-f1-red">F1</span>
                        <span className="font-inter font-medium text-lg tracking-widest uppercase mt-1 hidden sm:block">Velocity</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8">
                        {['Racing', 'Leaderboard', 'News', 'Tech', 'Drivers'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="text-sm uppercase tracking-widest font-medium hover:text-f1-red transition-colors duration-300 relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-f1-red transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    <button
                        className="md:hidden text-white hover:text-f1-red"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-carbon-black border-t border-white/10"
                >
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        {['Racing', 'Drivers', 'News', 'Tech'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-lg uppercase tracking-widest font-medium hover:text-f1-red transition-colors duration-300"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
