'use client';

import Navbar from '@/components/Navbar';
import FadeIn from '@/components/FadeIn';
import Image from 'next/image';
import { Check } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-brand-bg pb-20">
            <Navbar />

            <div className="pt-48">
                {/* Section A: Founder's Vision (Zig-Zag) */}
                <FadeIn>
                    <div className="max-w-7xl mx-auto px-6 mb-24">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            {/* Left: Portrait */}
                            <div className="w-64 h-64 md:w-full md:h-[500px] mx-auto lg:mx-0 lg:w-5/12 relative rounded-full md:rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/ceo-portrait.png"
                                    alt="Founder"
                                    fill
                                    className="object-cover object-center"
                                />
                            </div>
                            {/* Right: Letter */}
                            <div className="w-full lg:w-7/12 space-y-8">
                                <h1 className="text-5xl font-bold text-brand-dark leading-tight">
                                    Real Estate, <span className="text-brand-lime">Elevated.</span>
                                </h1>
                                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        We didn't start LuxeHome to sell houses. We started it to curate lifestyles. In a world where "luxury" is often overused, we believe true luxury lies in the details—the unseen, the felt, and the experienced.
                                    </p>
                                    <p>
                                        Our philosophy is simple: every property has a soul, and every client has a dream. Our mission is to bridge the gap between the two with seamless precision, cutting-edge technology, and an unwavering commitment to excellence.
                                    </p>
                                    <p>
                                        Welcome to the new standard of real estate.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <p className="font-cursive text-3xl text-brand-dark opacity-80" style={{ fontFamily: 'cursive' }}>
                                        Victoria Sterling
                                    </p>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-2">Founder & CEO</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Section B: Trust Bar (Social Proof) */}
                <FadeIn delay={0.2}>
                    <div className="bg-brand-dark text-white py-20 mb-24">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-brand-lime">$2.5B</div>
                                    <div className="text-gray-400 uppercase tracking-wider text-sm">Sales Volume</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-brand-lime">15+</div>
                                    <div className="text-gray-400 uppercase tracking-wider text-sm">Years Experience</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-brand-lime">850+</div>
                                    <div className="text-gray-400 uppercase tracking-wider text-sm">Happy Clients</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-brand-lime">24/7</div>
                                    <div className="text-gray-400 uppercase tracking-wider text-sm">Concierge Service</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Section C: Meet the Team */}
                <div className="max-w-7xl mx-auto px-6 mb-24">
                    <FadeIn delay={0.3}>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-brand-dark mb-4">The People Behind the Properties</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our team of elite agents brings together decades of experience, market insight, and a passion for architectural excellence.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Agent 1 */}
                        <FadeIn delay={0.4}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="relative h-72">
                                    <Image
                                        src="/james-wilson.png"
                                        alt="James Wilson"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 md:p-8 text-center">
                                    <h3 className="text-2xl font-bold text-brand-dark mb-1">James Wilson</h3>
                                    <p className="text-brand-lime font-medium mb-4">Senior Partner</p>
                                    <p className="text-gray-500 text-sm">+1 (323) 555-0101</p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Agent 2 */}
                        <FadeIn delay={0.5}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="relative h-72">
                                    <Image
                                        src="/sarah-miller.png"
                                        alt="Sarah Miller"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 md:p-8 text-center">
                                    <h3 className="text-2xl font-bold text-brand-dark mb-1">Sarah Miller</h3>
                                    <p className="text-brand-lime font-medium mb-4">Luxury Specialist</p>
                                    <p className="text-gray-500 text-sm">+1 (323) 555-0102</p>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Agent 3 */}
                        <FadeIn delay={0.6}>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="relative h-72">
                                    <Image
                                        src="/david-chen.png"
                                        alt="David Chen"
                                        fill
                                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 md:p-8 text-center">
                                    <h3 className="text-2xl font-bold text-brand-dark mb-1">David Chen</h3>
                                    <p className="text-brand-lime font-medium mb-4">Head of Sales</p>
                                    <p className="text-gray-500 text-sm">+1 (323) 555-0103</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* Section D: The Modern Experience */}
                <FadeIn delay={0.4}>
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl overflow-hidden">
                            <div className="flex flex-col lg:flex-row items-center gap-16">
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <h2 className="text-4xl font-bold text-brand-dark">The Modern Experience</h2>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        We've reimagined the real estate journey to put you in control. No more waiting games or outdated processes—just a seamless, efficient, and transparent experience from search to close.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-brand-dark" />
                                            </div>
                                            <span>Instant Digital Scheduling</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-brand-dark" />
                                            </div>
                                            <span>Smart Property Filtering</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-6 h-6 rounded-full bg-brand-lime flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-brand-dark" />
                                            </div>
                                            <span>Seamless Mobile Experience</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="w-full lg:w-1/2 relative h-[200px] md:h-[500px] rounded-3xl overflow-hidden">
                                    <Image
                                        src="/modern-experience.png"
                                        alt="Modern Real Estate Experience"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

            </div>
        </main>
    );
}
