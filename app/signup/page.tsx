'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signUp } from '@/lib/auth';

export default function SignUpPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signUp(email, password, fullName);

            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Failed to create account');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side: Luxury Pool Image (50%) */}
            <div className="hidden lg:block w-1/2 relative bg-brand-dark shrink-0">
                <img
                    src="/images/signup_hero.png"
                    alt="Luxury Pool"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />

                <div className="absolute bottom-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold leading-tight mb-6">"Elevate your lifestyle."</h2>
                    <p className="text-lg text-gray-300">Join the exclusive network of premium property owners and seekers.</p>
                </div>
            </div>

            {/* Right Side: Sign Up Form (50%) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <Link href="/" className="text-2xl font-bold text-brand-dark mb-8 block">LuxeHome AI</Link>
                        <h1 className="text-4xl font-bold text-brand-dark mb-3">Create your account</h1>
                        <p className="text-gray-500">Enter your details to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} className="text-red-600 shrink-0" />
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-brand-dark mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-0 outline-none transition-colors bg-white pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-lime text-brand-dark py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-500">
                        Already have an account? <Link href="/login" className="font-bold text-brand-dark hover:text-brand-lime transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
