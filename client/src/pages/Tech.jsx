import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import CarShowcase from '../components/CarShowcase';
import { API_BASE, fetcher } from '../utils/fetcher';

const ROAD_OPTIONS = ['all', 'street', 'permanent', 'hybrid'];
const CAR_OPTIONS = ['all', 'high-downforce', 'low-drag', 'balanced'];
const WEATHER_OPTIONS = ['all', 'sunny', 'cloudy', 'mixed', 'rain', 'storm', 'night'];

const pageVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
        },
    },
};

const riseVariant = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
};

const matchesSelection = (entry, selection) => {
    const roadMatch = selection.roadType === 'all' || entry.roadType === selection.roadType;
    const carMatch = selection.carType === 'all' || entry.carType === selection.carType;
    const weatherMatch = selection.weather === 'all' || entry.weatherNow?.condition === selection.weather;
    return roadMatch && carMatch && weatherMatch;
};

const buildPriority = (currentValue, options) => {
    const seen = new Set();
    const ordered = [currentValue, 'all', ...options];
    return ordered.filter((value) => {
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
};

const Tech = () => {
    const [roadType, setRoadType] = useState('all');
    const [carType, setCarType] = useState('all');
    const [weather, setWeather] = useState('all');

    const { data: allTechData = [] } = useSWR(`${API_BASE}/tech/races`, fetcher);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (roadType !== 'all') params.set('roadType', roadType);
        if (carType !== 'all') params.set('carType', carType);
        if (weather !== 'all') params.set('weather', weather);
        const serialized = params.toString();
        return serialized ? `?${serialized}` : '';
    }, [roadType, carType, weather]);

    const { data, isLoading, error } = useSWR(`${API_BASE}/tech/races${queryString}`, fetcher);

    const hasMatch = (selection) => allTechData.some((entry) => matchesSelection(entry, selection));

    const getAvailability = (key, options) => {
        return options.reduce((acc, option) => {
            const candidate = { roadType, carType, weather, [key]: option };
            acc[option] = hasMatch(candidate);
            return acc;
        }, {});
    };

    const roadAvailability = getAvailability('roadType', ROAD_OPTIONS);
    const carAvailability = getAvailability('carType', CAR_OPTIONS);
    const weatherAvailability = getAvailability('weather', WEATHER_OPTIONS);

    const applySelection = (nextSelection) => {
        if (!allTechData.length) {
            setRoadType(nextSelection.roadType);
            setCarType(nextSelection.carType);
            setWeather(nextSelection.weather);
            return;
        }

        if (hasMatch(nextSelection)) {
            setRoadType(nextSelection.roadType);
            setCarType(nextSelection.carType);
            setWeather(nextSelection.weather);
            return;
        }

        const roadPriority = buildPriority(nextSelection.roadType, ROAD_OPTIONS);
        const carPriority = buildPriority(nextSelection.carType, CAR_OPTIONS);
        const weatherPriority = buildPriority(nextSelection.weather, WEATHER_OPTIONS);

        for (const nextRoad of roadPriority) {
            for (const nextCar of carPriority) {
                for (const nextWeather of weatherPriority) {
                    const candidate = { roadType: nextRoad, carType: nextCar, weather: nextWeather };
                    if (hasMatch(candidate)) {
                        setRoadType(candidate.roadType);
                        setCarType(candidate.carType);
                        setWeather(candidate.weather);
                        return;
                    }
                }
            }
        }

        // Emergency fallback: if data exists but no specific combo was found, return to global view.
        setRoadType('all');
        setCarType('all');
        setWeather('all');
    };

    const onFilterChange = (key, value) => {
        const next = { roadType, carType, weather, [key]: value };
        applySelection(next);
    };

    return (
        <motion.div
            className="pt-28 min-h-screen bg-carbon-black text-white"
            variants={pageVariants}
            initial="hidden"
            animate="show"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <motion.div
                    variants={riseVariant}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                >
                    <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-2 block">Innovation</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">TECHNICAL <span className="text-titanium-silver">SHOWCASE</span></h1>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 md:mb-4">
                <motion.div
                    variants={riseVariant}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-white/10 bg-f1-dark/70 backdrop-blur-sm p-4 md:p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-titanium-silver">Filter Technical View</p>
                        <button
                            onClick={() => {
                                applySelection({ roadType: 'all', carType: 'all', weather: 'all' });
                            }}
                            className="text-xs uppercase tracking-widest text-titanium-silver hover:text-f1-red transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="text-xs uppercase tracking-widest text-titanium-silver">
                            Road Type
                            <div className="mt-2 relative">
                                <select
                                    value={roadType}
                                    onChange={(event) => onFilterChange('roadType', event.target.value)}
                                    className="w-full appearance-none bg-carbon-black border border-white/15 hover:border-f1-red/70 focus:border-f1-red px-3 py-3 pr-10 text-white font-semibold tracking-wide transition-colors outline-none"
                                >
                                    {ROAD_OPTIONS.map((option) => (
                                        <option key={option} value={option} disabled={!roadAvailability[option]}>
                                            {option === 'all' ? 'All' : option[0].toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-f1-red text-sm">▼</span>
                            </div>
                        </label>

                        <label className="text-xs uppercase tracking-widest text-titanium-silver">
                            Car Type
                            <div className="mt-2 relative">
                                <select
                                    value={carType}
                                    onChange={(event) => onFilterChange('carType', event.target.value)}
                                    className="w-full appearance-none bg-carbon-black border border-white/15 hover:border-f1-red/70 focus:border-f1-red px-3 py-3 pr-10 text-white font-semibold tracking-wide transition-colors outline-none"
                                >
                                    {CAR_OPTIONS.map((option) => (
                                        <option key={option} value={option} disabled={!carAvailability[option]}>
                                            {option === 'all'
                                                ? 'All'
                                                : option
                                                    .split('-')
                                                    .map((token) => token[0].toUpperCase() + token.slice(1))
                                                    .join(' ')}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-f1-red text-sm">▼</span>
                            </div>
                        </label>

                        <label className="text-xs uppercase tracking-widest text-titanium-silver">
                            Weather
                            <div className="mt-2 relative">
                                <select
                                    value={weather}
                                    onChange={(event) => onFilterChange('weather', event.target.value)}
                                    className="w-full appearance-none bg-carbon-black border border-white/15 hover:border-f1-red/70 focus:border-f1-red px-3 py-3 pr-10 text-white font-semibold tracking-wide transition-colors outline-none"
                                >
                                    {WEATHER_OPTIONS.map((option) => (
                                        <option key={option} value={option} disabled={!weatherAvailability[option]}>
                                            {option === 'all' ? 'All' : option[0].toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-f1-red text-sm">▼</span>
                            </div>
                        </label>
                    </div>
                </motion.div>

                {error && (
                    <p className="mt-4 text-sm text-red-400">Failed to load technical race data.</p>
                )}
            </div>

            <CarShowcase items={data || []} isLoading={isLoading} />
        </motion.div>
    );
};

export default Tech;
