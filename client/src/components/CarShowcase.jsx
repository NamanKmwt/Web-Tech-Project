import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CarShowcase = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const carX = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const textX = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const filterBlur = useTransform(scrollYProgress, [0, 0.5, 1], ["blur(10px)", "blur(0px)", "blur(10px)"]);

    return (
        <section ref={containerRef} className="py-32 bg-carbon-black relative overflow-hidden min-h-[80vh] flex items-center">
            {/* Background Text */}
            <motion.div
                style={{ x: textX }}
                className="absolute top-1/2 left-0 -translate-y-1/2 w-full whitespace-nowrap opacity-[0.03] pointer-events-none z-0"
            >
                <span className="text-[15vw] font-black italic tracking-tighter">ENGINEERING EXCELLENCE</span>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Content */}
                    <div>
                        <span className="text-f1-red font-bold uppercase tracking-widest text-sm mb-4 block">The Machine</span>
                        <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white mb-6">
                            AERODYNAMIC <br /> <span className="text-titanium-silver">MASTERY</span>
                        </h2>
                        <p className="text-lg text-titanium-silver mb-8 max-w-md">
                            Discover the intricate details of the 2026 regulations car. Built for unprecedented speed and aggressive racing, with refined ground effect elements and an advanced power unit.
                        </p>

                        <div className="space-y-6">
                            {[
                                { label: 'Downforce Level', value: 'Maximum', width: '90%' },
                                { label: 'Power Unit', value: 'V6 Turbo Hybrid', width: '100%' },
                                { label: 'Chassis Weight', value: '798 kg', width: '85%' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2 text-white">
                                        <span>{stat.label}</span>
                                        <span className="text-f1-red">{stat.value}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10">
                                        <motion.div
                                            className="h-full bg-f1-red"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: stat.width }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Car Image with Parallax & Blur */}
                    <div className="relative h-[400px] flex items-center justify-center">
                        {/* Glowing Backdrop */}
                        <div className="absolute inset-0 bg-f1-red/20 blur-[100px] rounded-full scale-75" />

                        <motion.img
                            style={{ x: carX, filter: filterBlur }}
                            src="/images/tech.png"
                            alt="F1 Car Engine"
                            className="w-[120%] max-w-none relative z-10 drop-shadow-2xl brightness-110 contrast-125 saturate-50 mix-blend-screen"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CarShowcase;
