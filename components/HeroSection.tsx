'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative w-full h-[100svh] lg:min-h-[85vh] lg:h-auto flex-none lg:flex lg:flex-row overflow-hidden bg-brand-bg">

            {/* LEFT SIDE: Editorial Typography & Search (45%) */}
            <div className="order-2 lg:order-1 lg:w-[45%] relative z-20 h-full lg:h-auto flex flex-col justify-center px-6 md:px-12 lg:pl-24 xl:pl-32 2xl:pl-44 items-center lg:items-start text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="inline-block py-1 px-3 rounded-full border border-white/30 lg:border-brand-dark/20 text-white lg:text-brand-dark/60 text-xs font-bold tracking-widest uppercase mb-6 lg:mb-8 bg-black/20 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
                        The Portfolio Collection
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white lg:text-brand-dark leading-[0.95] tracking-tight mb-6 lg:mb-8 drop-shadow-md lg:drop-shadow-none">
                        Design <br className="hidden lg:block" />
                        <span className="text-gray-200 lg:text-gray-400">for</span> Living.
                    </h1>

                    <p className="text-base sm:text-lg text-white font-medium lg:text-gray-500 max-w-xs sm:max-w-md leading-relaxed mb-8 lg:mb-12 mx-auto lg:mx-0 drop-shadow-md lg:drop-shadow-none">
                        Curated real estate for those who seek architecture, not just square footage. Discover homes that inspire.
                    </p>

                    {/* Minimal Search Bar */}
                    <div className="w-full max-w-md relative group mx-auto lg:mx-0">
                        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl shadow-brand-dark/5" />
                        <div className="relative flex items-center p-1 sm:p-2 bg-white rounded-2xl border border-gray-100">
                            <div className="pl-4 sm:pl-6 text-gray-400">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by city or neighborhood..."
                                className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-transparent outline-none text-sm sm:text-base text-brand-dark placeholder-gray-400 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                onClick={handleSearch}
                                className="h-10 w-10 sm:h-12 sm:w-12 bg-brand-dark rounded-xl flex items-center justify-center text-white hover:bg-brand-lime hover:text-brand-dark transition-all duration-300 shadow-lg shrink-0"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT SIDE: Golden Hour Architecture (55%) */}
            {/* Mobile: Absolute Background. Desktop: Relative Split Column */}
            <div className="absolute inset-0 lg:relative lg:inset-auto lg:w-[55%] h-full lg:h-auto z-0 order-1 lg:order-2 overflow-hidden">
                {/* Mobile Overlay - Darkens image for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80 lg:hidden z-10" />

                <div className="absolute inset-0 bg-gray-200">
                    <Image
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=90&w=2000"
                        alt="Modern Architecture"
                        fill
                        className="object-cover"
                        priority
                        quality={95}
                    />

                    {/* The Detail: Rounded Corner Cutout */}
                    <div className="hidden lg:block absolute bottom-0 left-0 w-32 h-32 bg-transparent pointer-events-none">
                        {/* This creates the inverse curve effect using a pseudo-element logic or SVG clip if simpler */}
                        {/* Simpler approach: A white overlay with border-radius? No, we want the image itself to have the curve. */}
                        {/* Actual CSS Trick: The Container has the curve. */}
                    </div>
                </div>

                {/* The "Cut" - Using a pseudo-div to create the curve on the bottom left of the image container to reveal the background/left side */}
                <div className="hidden lg:block absolute bottom-0 left-0 w-24 h-24">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-brand-bg rounded-tr-[4rem] z-20"></div>
                </div>
            </div>
        </div>
    );
}
