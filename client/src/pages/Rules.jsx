import React from 'react';
import { motion } from 'framer-motion';

const Rules = () => {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="mb-12">
                    <h1 className="font-orbitron font-black text-4xl md:text-5xl uppercase tracking-wider text-white mb-4">
                        Rules & <span className="text-f1-red">Regulations</span>
                    </h1>
                    <div className="w-24 h-1 bg-f1-red mb-6"></div>
                    <p className="text-gray-400 text-lg">
                        Understanding the intricate rules and regulations that define Formula 1 racing.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-orbitron text-white mb-4 uppercase tracking-wider flex items-center">
                            <span className="w-8 h-8 rounded-full bg-f1-red/20 text-f1-red flex items-center justify-center mr-3 text-sm">01</span>
                            Sporting Regulations
                        </h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
                                <li><strong>Race Distance:</strong> A Grand Prix race must be no less than 305km (with the exception of Monaco).</li>
                                <li><strong>Race Time:</strong> The race cannot exceed two hours of racing time, with a maximum window of three hours to account for red flags.</li>
                                <li><strong>Points System:</strong> Points are awarded to the top 10 finishers (25, 18, 15, 12, 10, 8, 6, 4, 2, 1), with 1 extra point for the fastest lap if they finish in the top 10.</li>
                                <li><strong>Qualifying:</strong> Conducted in three segments: Q1 (18 mins, bottom 5 eliminated), Q2 (15 mins, bottom 5 eliminated), and Q3 (12 mins, top 10 shootout).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-orbitron text-white mb-4 uppercase tracking-wider flex items-center">
                            <span className="w-8 h-8 rounded-full bg-f1-red/20 text-f1-red flex items-center justify-center mr-3 text-sm">02</span>
                            Technical Regulations
                        </h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
                                <li><strong>Engine:</strong> 1.6-litre V6 turbocharged hybrid engines, with limitations on fuel flow and electrical energy deployment.</li>
                                <li><strong>Minimum Weight:</strong> The car, without fuel, must weigh a minimum of 798kg encompassing the driver.</li>
                                <li><strong>Aerodynamics:</strong> Detailed restrictions on wing dimensions, underfloor tunnels (ground effect), and bodywork to limit dirty air and encourage overtaking.</li>
                                <li><strong>Tyres:</strong> Pirelli provides three dry compounds per weekend (Soft, Medium, Hard), plus Intermediate and Wet tyres. Drivers must use at least two different dry compounds in a dry race.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-orbitron text-white mb-4 uppercase tracking-wider flex items-center">
                            <span className="w-8 h-8 rounded-full bg-f1-red/20 text-f1-red flex items-center justify-center mr-3 text-sm">03</span>
                            Flags & Penalties
                        </h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
                            <ul className="list-disc list-inside text-gray-300 space-y-3 leading-relaxed">
                                <li><strong>Yellow Flag:</strong> Danger ahead; reduce speed, no overtaking.</li>
                                <li><strong>Red Flag:</strong> Session suspended; return to pit lane.</li>
                                <li><strong>Blue Flag:</strong> Indicates a faster car is approaching to lap you; you must let them pass.</li>
                                <li><strong>Penalties:</strong> Common penalties include 5-second or 10-second time penalties, drive-through penalties, and stop-and-go penalties for infractions like speeding in the pit lane or causing collisions.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Rules;
