import React from 'react';
import { motion } from 'framer-motion';
import CarShowcase from '../components/CarShowcase';

const Tech = () => {
    return (
        <div className="pt-28 min-h-screen bg-carbon-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-2 block">Innovation</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">TECHNICAL <span className="text-titanium-silver">SHOWCASE</span></h1>
                </motion.div>
            </div>

            <CarShowcase />
        </div>
    );
};

export default Tech;
