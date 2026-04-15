import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Ticket, Check, ShieldCheck, CreditCard, Lock, Fingerprint, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const TICKET_TIERS = [
    { id: 'general', name: 'General Admission', price: 150, features: ['Fan Zone Access', 'Roaming View'], color: 'border-white/20' },
    { id: 'grandstand', name: 'Main Grandstand', price: 450, features: ['Reserved Seating', 'Pit Lane View'], color: 'border-f1-red/50' },
    { id: 'paddock', name: 'Paddock Club', price: 1200, features: ['VIP Hospitality', 'Open Bar'], color: 'border-yellow-500/50' }
];

const TicketingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cardRef = useRef(null);

    // States
    const [selectedTier, setSelectedTier] = useState('grandstand');
    const [quantity, setQuantity] = useState(1);
    const [paymentStep, setPaymentStep] = useState('idle'); // idle | gateway | processing | success

    // Visuals
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 200, damping: 30 });
    const smoothY = useSpring(pointerY, { stiffness: 200, damping: 30 });
    const interactiveGlow = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, rgba(255,24,1,0.1), transparent 80%)`;

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        pointerX.set(e.clientX - rect.left);
        pointerY.set(e.clientY - rect.top);
    };

    const raceName = location.state?.raceName || '2026 Grand Prix';
    const selectedTierData = TICKET_TIERS.find(t => t.id === selectedTier);
    const totalCost = (selectedTierData.price * quantity) + 25;

    const startPayment = () => setPaymentStep('gateway');
    
    const processTransaction = () => {
        setPaymentStep('processing');
        setTimeout(() => setPaymentStep('success'), 3000);
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-[#0a0a0c] text-white px-4 overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto">
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-f1-red transition-colors mb-12"
                >
                    <ArrowLeft size={14} /> Terminal Exit
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* --- LEFT: SELECTION --- */}
                    <div className="lg:col-span-7 space-y-10">
                        <section>
                            <h1 className="text-6xl font-black italic tracking-tighter leading-none mb-4 uppercase">
                                Ticket <span className="text-f1-red">Registry</span>
                            </h1>
                            <p className="text-gray-400 text-sm tracking-wide">Authorized ticketing agent for the {raceName}.</p>
                        </section>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-f1-red block">Access Level</label>
                            <div className="space-y-3">
                                {TICKET_TIERS.map((tier) => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                                            selectedTier === tier.id ? 'border-f1-red bg-f1-red/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTier === tier.id ? 'border-f1-red' : 'border-white/10'}`}>
                                                {selectedTier === tier.id && <div className="w-2.5 h-2.5 bg-f1-red rounded-full" />}
                                            </div>
                                            <div>
                                                <p className="font-black uppercase italic tracking-tighter text-lg">{tier.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">${tier.price} / UNIT</p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex gap-2">
                                            {tier.features.map(f => (
                                                <span key={f} className="text-[8px] border border-white/10 px-2 py-1 rounded font-black text-gray-400 uppercase tracking-tighter">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-f1-red tracking-[0.3em] mb-1">Quantity</span>
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-widest italic">Digital Passes (Max 6)</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center hover:bg-f1-red hover:border-f1-red transition-all">-</button>
                                <span className="text-3xl font-black italic w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(6, quantity + 1))} className="w-12 h-12 border border-white/10 rounded-xl flex items-center justify-center hover:bg-f1-red hover:border-f1-red transition-all">+</button>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT: TICKET PREVIEW --- */}
                    <div className="lg:col-span-5">
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            className="sticky top-32 p-10 rounded-[2.5rem] bg-gradient-to-b from-[#111113] to-black border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            <motion.div style={{ background: interactiveGlow }} className="absolute inset-0 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-16 border-b border-dashed border-white/10 pb-6">
                                    <div className="bg-f1-red p-2 rounded-lg"><Ticket size={24} className="text-white" /></div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-f1-red tracking-[0.4em] uppercase">Auth Verified</p>
                                        <p className="text-[10px] text-gray-500 font-mono">#2026-F1-SYNC</p>
                                    </div>
                                </div>

                                <div className="space-y-8 mb-16">
                                    <div>
                                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">Race Identification</span>
                                        <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{raceName}</h2>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Tier</span>
                                            <p className="text-sm font-black italic uppercase text-f1-red">{selectedTierData.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Passes</span>
                                            <p className="text-sm font-black italic uppercase">{quantity} STN</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-2xl space-y-3">
                                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span>Subtotal</span>
                                        <span className="text-white">${selectedTierData.price * quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                        <span>Service Fee</span>
                                        <span className="text-white">$25.00</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-white/5">
                                        <span className="text-f1-red font-black italic text-2xl uppercase tracking-tighter">Total</span>
                                        <span className="text-2xl font-black italic tracking-tighter">${totalCost.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={startPayment}
                                    className="w-full mt-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-f1-red hover:text-white transition-all shadow-xl active:scale-[0.98]"
                                >
                                    Initialize Payment
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- PAYMENT GATEWAY OVERLAY --- */}
            <AnimatePresence>
                {paymentStep !== 'idle' && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        {/* 1. GATEWAY VIEW */}
                        {paymentStep === 'gateway' && (
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                                className="max-w-md w-full bg-[#111113] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative"
                            >
                                <div className="flex justify-center mb-8">
                                    <div className="bg-white/5 p-4 rounded-full border border-white/10"><Lock size={32} className="text-f1-red" /></div>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase text-center mb-2 tracking-tighter">Secure Gateway</h3>
                                <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Verification Required</p>
                                
                                <div className="space-y-6">
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-gray-600 mb-2"><span>Merchant</span> <span>F1_TICKETS_OFFICIAL</span></div>
                                        <div className="flex justify-between text-lg font-black italic"><span>TOTAL DUE</span> <span className="text-f1-red">${totalCost}</span></div>
                                    </div>
                                    
                                    {/* Fake Card Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                                            <span className="text-gray-500 font-mono">**** **** **** 4092</span>
                                            <CreditCard size={18} className="text-gray-600" />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={processTransaction}
                                        className="w-full py-5 bg-f1-red rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-125 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Fingerprint size={20} /> Authorize Transaction
                                    </button>
                                    <button onClick={() => setPaymentStep('idle')} className="w-full text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Abort Payment</button>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. PROCESSING VIEW */}
                        {paymentStep === 'processing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                <div className="relative mb-8">
                                    <Loader2 size={80} className="text-f1-red animate-spin mx-auto" />
                                    <div className="absolute inset-0 flex items-center justify-center"><Lock size={20} /></div>
                                </div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Syncing with Bank</h3>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Encoding Security Keys</p>
                            </motion.div>
                        )}

                        {/* 3. SUCCESS VIEW */}
                        {paymentStep === 'success' && (
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="max-w-md w-full text-center"
                            >
                                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(22,163,74,0.5)]">
                                    <Check size={48} strokeWidth={4} className="text-white" />
                                </div>
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Payment <span className="text-green-500">Confirmed</span></h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-12">
                                    Transaction ID: F1_SEC_99302X<br/>
                                    Your digital pass has been added to your vault.
                                </p>
                                <button 
                                    onClick={() => navigate('/racing')}
                                    className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-f1-red hover:text-white transition-all shadow-xl"
                                >
                                    Return to Terminal
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TicketingPage;