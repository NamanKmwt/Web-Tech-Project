import React, { Suspense, useState } from 'react'; // 1. Added useState
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import useSWR from 'swr';
import { fetcher, API_BASE } from '../utils/fetcher';
import { Link } from 'react-router-dom';

// Map database categories and sizes
const getSizeByIndex = (index) => {
    if (index === 0) return 'large';
    if (index === 1 || index === 3) return 'medium';
    return 'small';
};

// 2. Accept showAll as a prop
const ArticleList = ({ showAll }) => {
    const { data: articles, error } = useSWR(`${API_BASE}/articles`, fetcher, { suspense: true });

    if (error) return <div className="text-red-500">Failed to load news.</div>;

    // 3. Filter the articles based on the showAll state
    const displayedArticles = showAll ? articles : articles.slice(0, 5);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {displayedArticles.map((article, i) => {
                const size = getSizeByIndex(i % 5);

                return (
                    <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`group relative overflow-hidden bg-carbon-black border border-white/10 ${size === 'large' ? 'md:col-span-2 md:row-span-2' :
                            size === 'medium' ? 'md:col-span-1 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                            }`}
                    >
                        <Link to={`/news/${article._id}`} className="block w-full h-full cursor-pointer">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                src={article.imageUrl || '/images/news1.png'}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-black/90 to-transparent">
                                <span className="inline-block px-3 py-1 bg-f1-red text-white text-xs font-bold uppercase tracking-widest mb-3">
                                    {article.category}
                                </span>
                                <h3 className={`font-bold italic text-white ${size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                                    {article.title}
                                </h3>
                            </div>

                            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <div className="bg-white text-carbon-black p-2 rounded-full">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
};

const NewsGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {[0, 1, 2, 3].map((i) => (
            <div
                key={i}
                className={`bg-white/5 border border-white/10 animate-pulse ${i === 0 ? 'md:col-span-2 md:row-span-2' :
                    i === 1 || i === 3 ? 'md:col-span-1 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                    }`}
            />
        ))}
    </div>
);

const NewsGrid = () => {
    // 4. Create the state to track if we should show all items
    const [showAll, setShowAll] = useState(false);

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-2">LATEST <span className="text-f1-red">NEWS</span></h2>
                    <p className="text-titanium-silver text-lg">The stories shaping the championship.</p>
                </div>
                {/* 5. Add onClick handler and dynamic text/icon to the button */}
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="hidden md:flex items-center space-x-2 text-white hover:text-f1-red transition-colors duration-300 font-bold tracking-widest uppercase text-sm"
                >
                    <span>{showAll ? 'Show Less' : 'View All'}</span>
                    <ArrowUpRight size={20} className={`transform transition-transform ${showAll ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <Suspense fallback={<NewsGridSkeleton />}>
                {/* 6. Pass the state down to the list */}
                <ArticleList showAll={showAll} />
            </Suspense>
        </section>
    );
};

export default NewsGrid;