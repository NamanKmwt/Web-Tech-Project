import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return 'TBA';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const TicketsComingSoon = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cardRef = useRef(null);
    const [isHoveringCard, setIsHoveringCard] = useState(false);

    const pointerX = useMotionValue(320);
    const pointerY = useMotionValue(180);
    const smoothX = useSpring(pointerX, { stiffness: 220, damping: 30, mass: 0.35 });
    const smoothY = useSpring(pointerY, { stiffness: 220, damping: 30, mass: 0.35 });
    const interactiveGlow = useMotionTemplate`radial-gradient(340px circle at ${smoothX}px ${smoothY}px, rgba(255,24,1,0.34), rgba(255,24,1,0.12) 35%, rgba(255,24,1,0.03) 55%, transparent 75%)`;

    const handleCardMouseMove = (event) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        pointerX.set(event.clientX - rect.left);
        pointerY.set(event.clientY - rect.top);
    };

    const raceName = location.state?.raceName || 'Upcoming Grand Prix';
    const raceDate = formatDate(location.state?.raceDate);
    const raceLocation = location.state?.raceLocation || 'Circuit details will be announced soon';

    return (
        <div className="pt-28 pb-20 min-h-screen bg-carbon-black text-white px-4">
            <div className="max-w-5xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-titanium-silver hover:text-f1-red transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Back
                </motion.button>

                <motion.section
                    ref={cardRef}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setIsHoveringCard(true)}
                    onMouseLeave={() => setIsHoveringCard(false)}
                    onMouseMove={handleCardMouseMove}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-f1-dark/80"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,24,1,0.2),transparent_40%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.08),transparent_45%)]" />
                    <motion.div
                        aria-hidden="true"
                        style={{ background: interactiveGlow }}
                        animate={{ opacity: isHoveringCard ? 1 : 0 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="absolute inset-0 pointer-events-none"
                    />
                    <div className="relative z-10 p-8 sm:p-12">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-f1-red/20 border border-f1-red/40 mb-6">
                            <Ticket size={24} className="text-f1-red" />
                        </div>

                        <span className="text-f1-red font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 block">
                            Ticketing Portal
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white mb-4">
                            TICKETS <span className="text-titanium-silver">COMING SOON</span>
                        </h1>
                        <p className="text-titanium-silver text-base sm:text-lg max-w-2xl mb-8">
                            Seat reservations for this race are not open yet. Stay tuned for release dates and hospitality packages.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-white/10 bg-black/35 p-4 rounded-lg">
                                <p className="text-[10px] uppercase tracking-widest text-titanium-silver mb-2">Race</p>
                                <p className="text-white font-bold">{raceName}</p>
                            </div>
                            <div className="border border-white/10 bg-black/35 p-4 rounded-lg">
                                <p className="text-[10px] uppercase tracking-widest text-titanium-silver mb-2">Date</p>
                                <p className="text-white font-bold">{raceDate}</p>
                            </div>
                            <div className="border border-white/10 bg-black/35 p-4 rounded-lg">
                                <p className="text-[10px] uppercase tracking-widest text-titanium-silver mb-2">Location</p>
                                <p className="text-white font-bold">{raceLocation}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => navigate('/racing')}
                                className="px-8 py-3 bg-white text-carbon-black border border-transparent uppercase tracking-widest text-xs font-black hover:bg-f1-red hover:text-white transition-all duration-300 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                            >
                                Return to Calendar
                            </button>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default TicketsComingSoon;
