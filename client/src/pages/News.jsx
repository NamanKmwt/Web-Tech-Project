import React from 'react';
import { motion } from 'framer-motion';
import NewsGrid from '../components/NewsGrid';

const News = () => {
    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">EDITORIAL <span className="text-f1-red">&</span> INSIGHTS</h1>
                    <p className="mt-4 text-titanium-silver max-w-2xl mx-auto text-lg mb-12">
                        The latest paddock news, race analysis, and exclusive interviews.
                    </p>
                </motion.div>
            </div>

            <div className="border-t border-white/10">
                <NewsGrid />
            </div>
        </div>
    );
};

export default News;
