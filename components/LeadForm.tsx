'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { createLead } from '@/app/actions/leads';

interface LeadFormProps {
    propertyId?: string;
    agentId?: string;
}

export default function LeadForm({ propertyId, agentId }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        setStatus('idle');

        try {
            const result = await createLead(formData);
            if (result.success) {
                setStatus('success');
                // Optional: Reset form here if we had a ref
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 p-6 rounded-xl text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Request Sent!</h3>
                <p className="text-green-700">
                    Our team will contact you shortly to confirm your viewing appointment.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-green-700 font-bold hover:underline"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {/* Hidden fields for routing */}
            {propertyId && <input type="hidden" name="property_id" value={propertyId} />}
            {agentId && <input type="hidden" name="agent_id" value={agentId} />}

            <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark"
            />
            <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark"
            />
            <input
                type="tel"
                name="phone"
                required
                pattern="[0-9]*"
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark"
            />
            <textarea
                name="message"
                required
                placeholder="I am interested in this property..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark resize-none"
            ></textarea>

            {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <span>Something went wrong. Please try again.</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    'Sending...'
                ) : (
                    <>
                        <Calendar className="w-5 h-5" />
                        Schedule Viewing
                    </>
                )}
            </button>
        </form>
    );
}
