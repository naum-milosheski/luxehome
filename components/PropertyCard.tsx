import Image from 'next/image';
import { Property } from '@/types/supabase';
import { Bed, Bath, Square } from 'lucide-react';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    return (
        <div className="bg-brand-card rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
            <div className="relative h-64 w-full shrink-0 overflow-hidden">
                <Image
                    src={(() => {
                        try {
                            if (!property.image) return '/fallback-property.jpg';
                            const parsed = JSON.parse(property.image);
                            const url = Array.isArray(parsed) ? parsed[0] : property.image;
                            return url || '/fallback-property.jpg';
                        } catch {
                            return property.image || '/fallback-property.jpg';
                        }
                    })()}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Active
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-1">{property.title}</h3>
                            <p className="text-gray-500 text-sm">{property.address}</p>
                        </div>
                        <p className="text-xl font-bold text-brand-dark">
                            ${(property.price / 1000000).toFixed(1)}M
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-gray-500 text-sm border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                        <Bed size={18} />
                        <span>{property.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bath size={18} />
                        <span>{property.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Square size={18} />
                        <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
