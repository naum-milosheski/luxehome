'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { createLead } from '@/app/actions/leads';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const formDataObj = new FormData();
            formDataObj.append('name', `${formData.firstName} ${formData.lastName}`);
            formDataObj.append('email', formData.email);
            formDataObj.append('phone', formData.phone || '');
            formDataObj.append('message', formData.message);

            const result = await createLead(formDataObj);

            if (result.success) {
                setSubmitStatus('success');
                // Clear form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setErrors({});
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <main className="min-h-screen bg-brand-bg pb-20">
            <Navbar />

            <div className="pt-48 px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4 md:mb-6">Get in Touch</h1>
                            <p className="text-base md:text-xl text-gray-600">
                                Whether you're looking to buy, sell, or just have a question, we're here to help.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-8">
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-card rounded-full flex items-center justify-center text-brand-lime shadow-sm shrink-0">
                                    <Mail size={24} className="md:w-8 md:h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base md:text-xl text-brand-dark">Email Us</h3>
                                    <p className="text-sm md:text-base text-gray-600">hello@luxehome.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-card rounded-full flex items-center justify-center text-brand-lime shadow-sm shrink-0">
                                    <Phone size={24} className="md:w-8 md:h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base md:text-xl text-brand-dark">Call Us</h3>
                                    <p className="text-sm md:text-base text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-card rounded-full flex items-center justify-center text-brand-lime shadow-sm shrink-0">
                                    <MapPin size={24} className="md:w-8 md:h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base md:text-xl text-brand-dark">Visit Us</h3>
                                    <p className="text-sm md:text-base text-gray-600">90210 Wilshire Blvd, Beverly Hills, CA</p>
                                </div>
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-xl text-brand-dark mb-4">Office Hours</h3>
                            <div className="space-y-2 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span className="font-medium text-brand-dark">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="font-medium text-brand-dark">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-medium text-brand-dark">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-card p-5 md:p-8 lg:p-10 rounded-[3rem] shadow-xl">
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-600 shrink-0" />
                                <p className="text-sm text-green-600 font-medium">Thank you! Your message has been sent successfully.</p>
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                <AlertCircle size={20} className="text-red-600 shrink-0" />
                                <p className="text-sm text-red-600 font-medium">Failed to send message. Please try again.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-bold text-brand-dark ml-2 text-sm">First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange('firstName', e.target.value)}
                                        className={`w-full bg-brand-bg p-3 rounded-xl outline-none transition-all ${errors.firstName
                                            ? 'ring-2 ring-red-500'
                                            : 'focus:ring-2 focus:ring-brand-lime'
                                            }`}
                                    />
                                    {errors.firstName && <p className="text-xs text-red-600 ml-2">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-brand-dark ml-2 text-sm">Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        className={`w-full bg-brand-bg p-3 rounded-xl outline-none transition-all ${errors.lastName
                                            ? 'ring-2 ring-red-500'
                                            : 'focus:ring-2 focus:ring-brand-lime'
                                            }`}
                                    />
                                    {errors.lastName && <p className="text-xs text-red-600 ml-2">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold text-brand-dark ml-2 text-sm">Email Address *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full bg-brand-bg p-3 rounded-xl outline-none transition-all ${errors.email
                                        ? 'ring-2 ring-red-500'
                                        : 'focus:ring-2 focus:ring-brand-lime'
                                        }`}
                                />
                                {errors.email && <p className="text-xs text-red-600 ml-2">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold text-brand-dark ml-2 text-sm">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full bg-brand-bg p-3 rounded-xl outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-bold text-brand-dark ml-2 text-sm">Message *</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleChange('message', e.target.value)}
                                    className={`w-full bg-brand-bg p-3 rounded-xl outline-none transition-all h-32 resize-none ${errors.message
                                        ? 'ring-2 ring-red-500'
                                        : 'focus:ring-2 focus:ring-brand-lime'
                                        }`}
                                />
                                {errors.message && <p className="text-xs text-red-600 ml-2">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-lime text-brand-dark font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
