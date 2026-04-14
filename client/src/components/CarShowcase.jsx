import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CloudRain, Droplets, Gauge, Route, Wind } from 'lucide-react';

const roundImageMap = {
    1: '/images/races/bahrain.png',
    2: '/images/races/jeddah.png',
    3: '/images/races/australia.png',
    4: '/images/races/japan.png',
    5: '/images/races/miami.png',
    6: '/images/races/monaco.jpg',
};

const conditionTheme = {
    sunny: {
        panelClass: 'from-amber-500/15 via-orange-500/10 to-f1-dark',
        glowClass: 'bg-amber-400/20',
        label: 'High visibility, rising track temps'
    },
    cloudy: {
        panelClass: 'from-slate-300/10 via-slate-500/10 to-f1-dark',
        glowClass: 'bg-slate-300/10',
        label: 'Stable but cooler asphalt window'
    },
    mixed: {
        panelClass: 'from-cyan-400/10 via-slate-500/15 to-f1-dark',
        glowClass: 'bg-cyan-400/15',
        label: 'Volatile grip and tire warmup'
    },
    rain: {
        panelClass: 'from-blue-600/20 via-slate-900/30 to-f1-dark',
        glowClass: 'bg-blue-500/20',
        label: 'Intermediates likely in play'
    },
    storm: {
        panelClass: 'from-indigo-700/25 via-slate-900/40 to-f1-dark',
        glowClass: 'bg-indigo-500/20',
        label: 'High disruption risk and strategy divergence'
    },
    night: {
        panelClass: 'from-blue-950/40 via-f1-dark to-black',
        glowClass: 'bg-blue-500/10',
        label: 'Cooler track with lower thermal degradation'
    },
};

const toTitleCase = (value) => value.split('-').map((token) => token[0].toUpperCase() + token.slice(1)).join(' ');

const CarShowcase = ({ items, isLoading }) => {
    const containerRef = useRef(null);
    const [selectedRaceId, setSelectedRaceId] = useState(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const carX = useTransform(scrollYProgress, [0, 1], [-36, 36]);
    const textX = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);

    useEffect(() => {
        if (!items?.length) {
            setSelectedRaceId(null);
            return;
        }

        const stillExists = items.some((entry) => entry._id === selectedRaceId);
        if (!selectedRaceId || !stillExists) {
            setSelectedRaceId(items[0]._id);
        }
    }, [items, selectedRaceId]);

    const selectedRace = useMemo(() => {
        if (!items?.length) return null;
        return items.find((entry) => entry._id === selectedRaceId) || items[0];
    }, [items, selectedRaceId]);

    if (isLoading) {
        return (
            <section className="py-20 bg-carbon-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-[460px] bg-white/5 border border-white/10 animate-pulse" />
                </div>
            </section>
        );
    }

    if (!selectedRace) {
        return null;
    }

    const condition = selectedRace.weatherNow?.condition || 'mixed';
    const theme = conditionTheme[condition] || conditionTheme.mixed;
    const raceRound = selectedRace.raceId?.round;
    const raceImage = roundImageMap[raceRound] || '/images/tech.png';

    return (
        <section ref={containerRef} className="pt-4 pb-14 md:pt-6 md:pb-18 bg-carbon-black relative overflow-hidden min-h-[80vh] flex items-center">
            <motion.div
                style={{ x: textX }}
                className="absolute top-1/2 left-0 -translate-y-1/2 w-full whitespace-nowrap opacity-[0.03] pointer-events-none z-0"
            >
                <span className="text-[15vw] font-black italic tracking-tighter">TRACK INTELLIGENCE</span>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className={`relative overflow-hidden border border-white/10 bg-gradient-to-br ${theme.panelClass}`}>
                    {(condition === 'rain' || condition === 'storm') && (
                        <div className="absolute inset-0 weather-rain opacity-30 pointer-events-none" />
                    )}
                    {(condition === 'cloudy' || condition === 'mixed') && (
                        <div className="absolute inset-0 weather-clouds opacity-45 pointer-events-none" />
                    )}
                    {condition === 'night' && (
                        <div className="absolute inset-0 weather-stars pointer-events-none" />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-6 md:p-10">
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-20"
                        >
                            <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-4 block">Track Engineering Brief</span>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-4">
                                {selectedRace.raceId?.name || 'Race'}
                            </h2>
                            <p className="text-titanium-silver mb-8 max-w-xl">
                                {theme.label}. {selectedRace.setupHint}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-black/35 border border-white/10 p-4">
                                    <p className="text-[11px] uppercase tracking-widest text-titanium-silver mb-2">Road Type</p>
                                    <p className="text-lg font-black italic text-white">{toTitleCase(selectedRace.roadType)}</p>
                                </div>
                                <div className="bg-black/35 border border-white/10 p-4">
                                    <p className="text-[11px] uppercase tracking-widest text-titanium-silver mb-2">Car Focus</p>
                                    <p className="text-lg font-black italic text-white">{toTitleCase(selectedRace.carType)}</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {[
                                    {
                                        label: 'Grip Window',
                                        value: `${selectedRace.gripLevel}%`,
                                        width: `${selectedRace.gripLevel}%`
                                    },
                                    {
                                        label: 'Rain Probability',
                                        value: `${selectedRace.weatherNow?.rainChancePct || 0}%`,
                                        width: `${selectedRace.weatherNow?.rainChancePct || 0}%`
                                    },
                                    {
                                        label: 'Humidity',
                                        value: `${selectedRace.weatherNow?.humidityPct || 0}%`,
                                        width: `${selectedRace.weatherNow?.humidityPct || 0}%`
                                    },
                                ].map((stat, index) => (
                                    <div key={stat.label}>
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-white">
                                            <span>{stat.label}</span>
                                            <span className="text-f1-red">{stat.value}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10">
                                            <motion.div
                                                className="h-full bg-f1-red"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: stat.width }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.9, delay: index * 0.15 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 28, scale: 0.99 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                            className="relative h-[420px] flex items-center justify-center overflow-hidden z-10"
                        >
                            <div className={`absolute inset-0 ${theme.glowClass} blur-[90px] rounded-full scale-75`} />
                            <motion.img
                                style={{ x: carX }}
                                src={raceImage}
                                alt={selectedRace.raceId?.name || 'Race circuit'}
                                className="w-full lg:w-[110%] max-w-none relative z-10 drop-shadow-2xl brightness-110 contrast-125 pointer-events-none"
                            />

                            <div className="absolute top-5 left-5 bg-black/60 border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-white z-20">
                                Round {selectedRace.raceId?.round || '-'}
                            </div>
                            <div className="absolute top-5 right-5 bg-black/60 border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-white z-20">
                                {selectedRace.weatherNow?.condition || 'mixed'}
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 md:grid-cols-4 gap-2 z-20">
                                <div className="bg-black/60 border border-white/10 p-2">
                                    <p className="text-[10px] uppercase tracking-widest text-titanium-silver">Air</p>
                                    <p className="text-white font-bold">{selectedRace.weatherNow?.airTempC} C</p>
                                </div>
                                <div className="bg-black/60 border border-white/10 p-2">
                                    <p className="text-[10px] uppercase tracking-widest text-titanium-silver">Track</p>
                                    <p className="text-white font-bold">{selectedRace.weatherNow?.trackTempC} C</p>
                                </div>
                                <div className="bg-black/60 border border-white/10 p-2">
                                    <p className="text-[10px] uppercase tracking-widest text-titanium-silver">Wind</p>
                                    <p className="text-white font-bold">{selectedRace.weatherNow?.windKph} kph</p>
                                </div>
                                <div className="bg-black/60 border border-white/10 p-2">
                                    <p className="text-[10px] uppercase tracking-widest text-titanium-silver">Risk</p>
                                    <p className="text-white font-bold uppercase">{selectedRace.riskLevel}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((entry, index) => {
                        const isActive = entry._id === selectedRace._id;
                        return (
                            <motion.button
                                key={entry._id}
                                onClick={() => setSelectedRaceId(entry._id)}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                whileHover={{ y: -4 }}
                                className={`text-left p-4 border transition-colors ${isActive ? 'border-f1-red bg-white/10' : 'border-white/10 bg-f1-dark hover:border-white/30'}`}
                            >
                                <p className="text-xs uppercase tracking-widest text-titanium-silver mb-2">
                                    Round {entry.raceId?.round || '-'}
                                </p>
                                <h3 className="text-lg font-black italic text-white mb-3">{entry.raceId?.name || 'Unknown Race'}</h3>

                                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wider mb-3">
                                    <span className="px-2 py-1 bg-white/10 text-white">{toTitleCase(entry.roadType)}</span>
                                    <span className="px-2 py-1 bg-white/10 text-white">{toTitleCase(entry.carType)}</span>
                                    <span className="px-2 py-1 bg-white/10 text-white">{entry.weatherNow?.condition}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2 text-xs text-titanium-silver">
                                    <p className="inline-flex items-center gap-1"><Route size={13} /> Grip {entry.gripLevel}%</p>
                                    <p className="inline-flex items-center gap-1"><CloudRain size={13} /> Rain {entry.weatherNow?.rainChancePct}%</p>
                                    <p className="inline-flex items-center gap-1"><Droplets size={13} /> Humidity {entry.weatherNow?.humidityPct}%</p>
                                    <p className="inline-flex items-center gap-1"><Wind size={13} /> Wind {entry.weatherNow?.windKph} kph</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedRace.weatherTrend?.map((point, index) => (
                        <motion.div
                            key={point.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="border border-white/10 bg-black/30 p-4"
                        >
                            <p className="text-xs uppercase tracking-widest text-titanium-silver mb-2">{point.label}</p>
                            <p className="text-lg font-black italic text-white mb-1">{point.condition}</p>
                            <p className="text-sm text-titanium-silver inline-flex items-center gap-2"><Gauge size={14} /> {point.airTempC} C</p>
                            <p className="text-sm text-titanium-silver inline-flex items-center gap-2"><CloudRain size={14} /> {point.rainChancePct}% rain</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CarShowcase;
