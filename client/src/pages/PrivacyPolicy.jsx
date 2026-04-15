import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Eye, Database, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
                        <ShieldCheck size={200} />
                    </div>

                    <header className="mb-12 border-b border-white/5 pb-8">
                        <span className="text-f1-red font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">Protocol v2.6</span>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Privacy <span className="text-white/20">Policy</span></h1>
                        <p className="text-gray-500 text-xs mt-4 font-mono uppercase tracking-widest">Last Updated: 15 APR 2026</p>
                    </header>

                    <div className="space-y-10 text-gray-400 text-sm leading-relaxed tracking-wide">
                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <Eye size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">01. Data Acquisition</h2>
                            </div>
                            <p>Our Technical Command Center monitors device-level metadata to ensure the low-latency delivery of telemetry streams. This includes browser engine details and IP-based geolocation used to sync local race start times.</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <Database size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">02. Telemetry Processing</h2>
                            </div>
                            <p>Real-time car data (Velocity, RPM, DRS status) is fetched via the OpenF1 API. This data is processed in your local browser state to power the Live Battle Monitor and is not archived on our primary servers.</p>
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-4 text-white">
                                <Globe size={18} className="text-f1-red" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight">03. Third-Party Uplinks</h2>
                            </div>
                            <p>We integrate with Formula 1 Management (FOM) assets and the OpenF1 database. These providers may utilize anonymous cookies to maintain session continuity during live race events.</p>
                        </section>
                    </div>

                    <div className="mt-16 p-6 bg-white/[0.03] rounded-2xl border border-white/5 text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
                        By utilizing the Command Center, you consent to the technical data processing required to maintain the high-fidelity engineering dashboard.
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;