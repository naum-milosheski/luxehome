'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDemoLogin = async () => {
        setError('');
        setIsDemoLoading(true);

        try {
            const result = await signIn('demo@luxehome.com', 'demo123');

            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Demo account unavailable');
            }
        } catch (err) {
            setError('Could not load demo');
        } finally {
            setIsDemoLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signIn(email, password);

            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side: Architectural Image (50%) */}
            <div className="hidden lg:block w-1/2 relative bg-brand-dark shrink-0">
                <img
                    src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000"
                    alt="Luxury Architecture"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />

                <div className="absolute bottom-20 left-20 right-20 text-white">
                    <h2 className="text-4xl font-bold leading-tight mb-6">"The future of real estate is here."</h2>
                    <p className="text-lg text-gray-300">Experience the next generation of property management and client relations.</p>
                </div>
            </div>

            {/* Right Side: Login Form (50%) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <Link href="/" className="text-2xl font-bold text-brand-dark mb-8 block">LuxeHome AI</Link>
                        <h1 className="text-4xl font-bold text-brand-dark mb-3">Welcome back</h1>
                        <p className="text-gray-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} className="text-red-600 shrink-0" />
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-dark focus:ring-brand-dark" />
                                <span className="text-sm text-gray-500 font-medium">Remember me</span>
                            </label>
                            <Link href="#" className="text-sm font-bold text-brand-dark hover:text-brand-lime transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-lime text-brand-dark py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    {/* Demo Account Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400">or explore with</span>
                        </div>
                    </div>

                    {/* Magic Demo Button */}
                    <button
                        type="button"
                        onClick={handleDemoLogin}
                        disabled={isDemoLoading || isSubmitting}
                        className="w-full py-4 rounded-xl font-bold text-base border-2 border-gray-200 text-gray-600 hover:border-brand-dark hover:text-brand-dark hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDemoLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Loading Demo...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                View Demo Account
                            </>
                        )}
                    </button>

                    <p className="text-center mt-8 text-gray-500">
                        Don't have an account? <Link href="/signup" className="font-bold text-brand-dark hover:text-brand-lime transition-colors">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
