'use client';

import { Search, Check } from 'lucide-react';
import { PropertyFilters } from '@/app/actions/properties';
import { MASTER_AMENITIES } from '@/lib/amenities';
import { useState } from 'react';

interface FilterContentProps {
    filters: PropertyFilters;
    setFilters: React.Dispatch<React.SetStateAction<PropertyFilters>>;
    handleFilterChange: (key: keyof PropertyFilters, value: any) => void;
    toggleAmenity: (amenity: string) => void;
    isSidebar?: boolean;
}

export default function FilterContent({ filters, setFilters, handleFilterChange, toggleAmenity, isSidebar = false }: FilterContentProps) {
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    return (
        <div className="space-y-8">
            {/* Transaction Mode Toggle */}
            <div className="bg-brand-bg p-1 rounded-xl flex">
                <button
                    onClick={() => handleFilterChange('listingType', 'Sale')}
                    className={`flex-1 font-bold py-2 rounded-lg shadow-sm transition-all ${filters.listingType === 'Sale' ? 'bg-brand-lime text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}
                >
                    Buy
                </button>
                <button
                    onClick={() => handleFilterChange('listingType', 'Rent')}
                    className={`flex-1 font-bold py-2 rounded-lg shadow-sm transition-all ${filters.listingType === 'Rent' ? 'bg-brand-lime text-brand-dark' : 'text-gray-500 hover:text-brand-dark'}`}
                >
                    Rent
                </button>
            </div>

            {/* Location Search */}
            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Location</label>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="City, Neighborhood, or ZIP"
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full bg-brand-bg pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                    />
                </div>
            </div>

            {/* Price Range */}
            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Price Range</label>
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ''}
                            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-brand-bg pl-6 pr-3 py-2.5 rounded-xl text-sm outline-none"
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-brand-bg pl-6 pr-3 py-2.5 rounded-xl text-sm outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Property Type Grid */}
            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {['House', 'Condo', 'Villa', 'Townhome', 'Land', 'Multi-Family'].map((type) => (
                        <label
                            key={type}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all bg-white ${filters.type === type ? 'border-brand-lime ring-1 ring-brand-lime' : 'border-gray-100 hover:border-brand-lime'}`}
                            onClick={(e) => {
                                e.preventDefault(); // Prevent default radio behavior
                                handleFilterChange('type', type);
                            }}
                        >
                            <input
                                type="radio"
                                name="propertyType"
                                className="hidden"
                                checked={filters.type === type}
                                readOnly
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.type === type ? 'border-brand-lime' : 'border-gray-300'}`}>
                                {filters.type === type && <div className="w-2.5 h-2.5 bg-brand-lime rounded-[2px]" />}
                            </div>
                            <span className="text-xs font-medium text-brand-dark">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Beds & Baths Pills */}
            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Bedrooms</label>
                <div className="flex gap-2">
                    {['Any', 1, 2, 3, 4].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleFilterChange('beds', opt)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filters.beds === opt ? 'bg-brand-dark text-white' : 'bg-brand-bg text-gray-500 hover:bg-gray-200'}`}
                        >
                            {opt === 'Any' ? 'Any' : `${opt}+`}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Bathrooms</label>
                <div className="flex gap-2">
                    {['Any', 1, 2, 3, 4].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleFilterChange('baths', opt)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filters.baths === opt ? 'bg-brand-dark text-white' : 'bg-brand-bg text-gray-500 hover:bg-gray-200'}`}
                        >
                            {opt === 'Any' ? 'Any' : `${opt}+`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities Checklist */}
            <div>
                <label className="text-sm font-bold text-gray-500 mb-3 block">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-y-2 gap-x-4">
                    {(isSidebar && !showAllAmenities ? MASTER_AMENITIES.slice(0, 5) : MASTER_AMENITIES).map((amenity) => (
                        <label
                            key={amenity.key}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleAmenity(amenity.label);
                            }}
                        >
                            <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.amenities?.includes(amenity.label) ? 'bg-brand-lime border-brand-lime' : 'border-gray-300 bg-white group-hover:border-brand-lime'}`}
                            >
                                <Check size={12} className={`text-brand-dark transition-opacity ${filters.amenities?.includes(amenity.label) ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                            <span
                                className="text-sm text-gray-600 group-hover:text-brand-dark transition-colors"
                            >
                                {amenity.label}
                            </span>
                        </label>
                    ))}
                    {isSidebar && MASTER_AMENITIES.length > 5 && (
                        <button
                            onClick={() => setShowAllAmenities(!showAllAmenities)}
                            className="text-sm font-bold text-brand-lime hover:underline mt-2 col-span-full text-left"
                        >
                            {showAllAmenities ? 'Show less' : `Show more (+${MASTER_AMENITIES.length - 5})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
