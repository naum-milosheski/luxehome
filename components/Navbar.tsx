'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check auth state on mount and subscribe to changes
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsOpen(false);
        router.push('/');
        router.refresh();
    };

    return (
        <>
            <nav className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center px-4">
                <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg rounded-full px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-12 w-full max-w-5xl">
                    <Link href="/" className="text-xl lg:text-2xl font-bold tracking-tight text-brand-dark z-50 relative">
                        LuxeHome<span className="text-brand-lime">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className="text-brand-dark hover:text-brand-lime transition-colors font-medium">Home</Link>
                        <Link href="/listings" className="text-brand-dark hover:text-brand-lime transition-colors font-medium">Properties</Link>
                        <Link href="/about" className="text-brand-dark hover:text-brand-lime transition-colors font-medium">About</Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-3">
                        {/* Auth Button */}
                        {!isLoading && (
                            user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 border-2 border-brand-dark/20 text-brand-dark px-5 py-2 rounded-full font-medium hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            ) : (
                                <Link
                                    href="/admin"
                                    className="border-2 border-brand-lime text-brand-dark px-5 py-2 rounded-full font-medium hover:bg-brand-lime transition-all"
                                >
                                    Agent Portal
                                </Link>
                            )
                        )}
                        <Link href="/contact" className="bg-brand-dark text-white px-6 py-2 rounded-full font-medium hover:bg-brand-lime hover:text-brand-dark transition-all">
                            Book Consultation
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-brand-dark z-50 relative"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 right-0 bg-brand-bg z-50 flex flex-col p-6 pb-8 rounded-b-3xl shadow-xl lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold tracking-tight text-brand-dark">
                                    LuxeHome<span className="text-brand-lime">.</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-brand-dark hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-6">
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-brand-dark hover:text-brand-lime transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/listings"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-brand-dark hover:text-brand-lime transition-colors"
                                >
                                    Properties
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-bold text-brand-dark hover:text-brand-lime transition-colors"
                                >
                                    About
                                </Link>

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col space-y-4">
                                    {/* Auth Button */}
                                    {!isLoading && (
                                        user ? (
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center justify-center gap-2 border-2 border-red-200 text-red-500 px-6 py-3 rounded-full font-medium hover:bg-red-50 transition-all cursor-pointer"
                                            >
                                                <LogOut size={18} />
                                                Sign Out
                                            </button>
                                        ) : (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="border-2 border-brand-lime text-brand-dark px-6 py-3 rounded-full text-center font-medium hover:bg-brand-lime transition-all"
                                            >
                                                Agent Portal
                                            </Link>
                                        )
                                    )}
                                    <Link
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-brand-dark text-white px-6 py-3 rounded-full text-center font-medium hover:bg-brand-lime hover:text-brand-dark transition-all"
                                    >
                                        Book Consultation
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
