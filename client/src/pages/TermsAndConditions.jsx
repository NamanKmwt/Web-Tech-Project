import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Cpu, AlertTriangle, Copyright } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#0a0a0c] text-white px-4">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-f1-red transition-colors mb-12"
                >
                    <ArrowLeft size={14} /> System Return
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Scale size={200} />
                    </div>

                    <header className="mb-12 border-b border-white/5 pb-8">
                        <span className="text-f1-red font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Standard Operating Terms</span>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Terms <span className="text-white/20">& Conditions</span></h1>
                        <p className="text-gray-500 text-xs mt-4 font-mono uppercase tracking-widest">Ref: F1-TCC-2026</p>
                    </header>

                    <div className="space-y-10 text-gray-400 text-sm leading-relaxed tracking-wide">
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <Cpu size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">01. Technical Access</h2>
                            </div>
                            <p>Users are granted access to the Technical Command Center for analysis and educational purposes. Any attempt to reverse-engineer the "Interactive Track" logic or scrape live telemetry feeds is strictly prohibited.</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <AlertTriangle size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">02. Telemetry Disclaimer</h2>
                            </div>
                            <p>Telemetry data provided via the OpenF1 API is subject to a "Sync Delay." We provide this data "as-is" and are not responsible for decisions made based on the Live Battle Monitor or championship standings.</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <Copyright size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">03. Intellectual Property</h2>
                            </div>
                            <p>All F1-related marks, team logos (Red Bull, Ferrari, McLaren), and circuit imagery are the property of Formula One Management and their respective teams. The dashboard UI and custom animations are proprietary to this platform.</p>
                        </section>
                    </div>

                    <div className="mt-16 flex justify-center">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-12 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-xl hover:bg-f1-red hover:text-white transition-all shadow-xl"
                        >
                            Acknowledge & Return
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsAndConditions;