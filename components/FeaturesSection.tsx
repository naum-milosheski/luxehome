import { Zap, Calendar, Shield } from 'lucide-react';

export default function FeaturesSection() {
    return (
        <div className="max-w-7xl mx-auto px-4 mt-20 mb-0">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">Why Choose LuxeHome</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    We leverage cutting-edge technology to provide a seamless and secure real estate experience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-brand-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-brand-lime/20 rounded-2xl flex items-center justify-center text-brand-dark mb-6">
                        <Zap size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Instant AI Valuation</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Get an accurate price estimate for your property in seconds using our advanced AI algorithms.
                    </p>
                </div>

                <div className="bg-brand-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-brand-lime/20 rounded-2xl flex items-center justify-center text-brand-dark mb-6">
                        <Calendar size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Smart Tours</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Schedule physical or virtual viewings automatically at times that work best for you.
                    </p>
                </div>

                <div className="bg-brand-card rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-brand-lime/20 rounded-2xl flex items-center justify-center text-brand-dark mb-6">
                        <Shield size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3">Verified Listings</h3>
                    <p className="text-gray-500 leading-relaxed">
                        Every home on our platform is vetted by real estate experts to ensure quality and authenticity.
                    </p>
                </div>
            </div>
        </div>
    );
}
