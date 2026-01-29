import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

export default function SearchFilter() {
    return (
        <div className="relative z-20 -mt-12 px-4">
            <div className="max-w-4xl mx-auto bg-brand-card rounded-full shadow-xl p-3 flex items-center gap-2 md:gap-4">
                <div className="flex-1 flex items-center gap-3 px-4 border-r border-gray-100">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by location..."
                        className="w-full bg-transparent outline-none text-brand-dark placeholder:text-gray-400"
                    />
                </div>

                <div className="hidden md:flex items-center gap-3 px-4 border-r border-gray-100">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-brand-dark font-medium">Los Angeles</span>
                </div>

                <button className="p-3 text-gray-400 hover:text-brand-dark transition-colors">
                    <SlidersHorizontal size={20} />
                </button>

                <button className="bg-brand-lime text-brand-dark px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all">
                    Search
                </button>
            </div>
        </div>
    );
}
