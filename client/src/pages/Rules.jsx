import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Car, Users, Shield, Flag } from 'lucide-react';
import { rulesData } from '../data/rulesData';

const iconMap = {
    Trophy: Trophy,
    Car: Car,
    Users: Users,
    Shield: Shield,
    Flag: Flag,
};

const Rules = () => {
    const [activeTab, setActiveTab] = useState(rulesData[0].category);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter rules based on search query, either globally or within active tab
    // If there's a search query, show all rules that match across all categories
    // If no search query, show rules for the active tab
    const displayedData = useMemo(() => {
        if (!searchQuery.trim()) {
            return [rulesData.find(d => d.category === activeTab)];
        }

        const lowerQuery = searchQuery.toLowerCase();
        return rulesData.map(category => {
            const filteredRules = category.rules.filter(
                r => r.title.toLowerCase().includes(lowerQuery) || 
                     r.content.toLowerCase().includes(lowerQuery) ||
                     r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
            
            return {
                ...category,
                rules: filteredRules
            };
        }).filter(category => category.rules.length > 0);
    }, [activeTab, searchQuery]);

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="font-orbitron font-black text-4xl md:text-6xl uppercase tracking-wider text-white mb-4">
                        FIA Rules & <span className="text-f1-red">Regulations</span>
                    </h1>
                    <div className="w-24 h-1.5 bg-f1-red mb-6 mx-auto md:mx-0 rounded-full"></div>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl">
                        Explore the intricate code of conduct, technical limits, and sporting formats that govern the pinnacle of motorsport.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-10 w-full md:w-96 flex">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search rules, keywords, penalties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:border-transparent transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
                    />
                </div>

                {/* Tab Navigation (only show if not intensely searching) */}
                {!searchQuery && (
                    <div className="flex flex-wrap gap-2 mb-10 pb-2">
                        {rulesData.map((category) => {
                            const Icon = iconMap[category.icon];
                            const isActive = activeTab === category.category;
                            
                            return (
                                <button
                                    key={category.category}
                                    onClick={() => setActiveTab(category.category)}
                                    className={`flex items-center px-4 py-2 rounded-full font-orbitron text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 border ${
                                        isActive 
                                        ? 'bg-f1-red text-white border-f1-red' 
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {Icon && <Icon className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${isActive ? 'text-white' : 'text-f1-red/70'}`} />}
                                    {category.category}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Content Area */}
                <div className="space-y-12 min-h-[50vh]">
                    <AnimatePresence mode="popLayout">
                        {displayedData.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="text-center py-20 text-gray-500"
                            >
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-xl font-orbitron">No rules found matching "{searchQuery}"</p>
                            </motion.div>
                        ) : (
                            displayedData.map((section) => (
                                <motion.div
                                    key={section.category}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-orbitron text-white mt-2 mb-8 uppercase tracking-wider flex items-center border-b border-white/10 pb-4">
                                        {React.createElement(iconMap[section.icon], { className: "text-f1-red mr-3 md:mr-4 w-6 h-6 md:w-8 md:h-8" })}
                                        {section.category}
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.rules.map((rule, idx) => (
                                            <motion.div 
                                                key={rule.id}
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-f1-red/50 transition-colors duration-300 shadow-lg"
                                            >
                                                {/* Decorative number/accent */}
                                                <div className="absolute -right-4 -top-6 text-7xl font-orbitron font-black text-white/[0.03] group-hover:text-f1-red/[0.05] transition-colors duration-300 pointer-events-none">
                                                    {(idx + 1).toString().padStart(2, '0')}
                                                </div>
                                                
                                                <h3 className="text-xl font-orbitron text-white mb-3 tracking-wide flex items-center">
                                                    <span className="w-2 h-2 rounded-full bg-f1-red mr-3 shadow-[0_0_5px_rgba(255,24,1,0.8)]"></span>
                                                    {rule.title}
                                                </h3>
                                                
                                                <p className="text-gray-300 leading-relaxed mb-5 text-sm md:text-base">
                                                    {rule.content}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {rule.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-md">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Rules;
