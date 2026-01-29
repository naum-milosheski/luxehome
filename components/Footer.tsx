import Link from 'next/link';
import { Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const XIcon = ({ size = 24 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
    </svg>
);


export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white rounded-t-[3rem] mt-0">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
                    {/* Column 1: Brand (4 cols) */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="text-3xl font-bold tracking-tight mb-6 block">
                            LuxeHome<span className="text-brand-lime">.</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            Discover the world's finest homes. We curate the most exclusive properties for discerning clients.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                                <XIcon size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-lime hover:text-brand-dark transition-all">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links (2 cols) */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/listings" className="hover:text-brand-lime transition-colors">Properties</Link></li>
                            <li><Link href="/about" className="hover:text-brand-lime transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-lime transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Support (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-lg mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="#" className="hover:text-brand-lime transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-brand-lime transition-colors">FAQ</Link></li>
                            <li><Link href="/admin" className="hover:text-brand-lime transition-colors">Agent Portal</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter (3 cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-lg mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-4">Subscribe to get the latest property updates.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/10 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-brand-lime transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-lime text-brand-dark rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright Row */}
                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-gray-400 text-sm">
                    <p className="text-left">© {new Date().getFullYear()} LuxeHome Inc. All rights reserved. <span className="mx-2 text-gray-600">•</span> <span className="whitespace-nowrap">Designed & Developed by Naum Milosheski</span></p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 shrink-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
