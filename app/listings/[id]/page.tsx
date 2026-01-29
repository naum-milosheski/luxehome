import { getPropertyById, getProperties } from '@/app/actions/properties';
import Navbar from '@/components/Navbar';
import { MapPin, Bed, Bath, Square, ArrowLeft, Map as MapIcon, MessageCircle, Check, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import MortgageCalculator from '@/components/MortgageCalculator';
import PropertyCard from '@/components/PropertyCard';
import PropertyGallery from '@/components/PropertyGallery';
import LeadForm from '@/components/LeadForm';
import { notFound } from 'next/navigation';
import FadeIn from '@/components/FadeIn';

import { getAmenityLabel } from '@/lib/amenities';
import { getProfileById } from '@/app/actions/profile';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
    const property = await getPropertyById(params.id);

    if (!property) {
        notFound();
    }

    // Get similar listings (exclude current property, take 3)
    const { data: allProperties } = await getProperties({ limit: 4 });
    const similarListings = allProperties.filter(p => p.id !== property.id).slice(0, 3);

    // Ensure amenities is an array (it might be JSON from DB)
    const amenitiesList = Array.isArray(property.amenities)
        ? property.amenities
        : typeof property.amenities === 'object'
            ? Object.keys(property.amenities).filter(k => (property.amenities as any)[k])
            : [];

    // Fetch Agent Profile
    let agent = {
        name: "Listing Agent",
        image: null as string | null,
        phone: "Contact for details"
    };

    if (property.user_id) {
        const profile = await getProfileById(property.user_id);
        if (profile) {
            agent = {
                name: profile.full_name || agent.name,
                image: profile.avatar_url || null,
                phone: profile.phone || agent.phone
            };
        }
    }

    // Ensure images is an array.
    let images: string[] = [];
    try {
        if (!property.image) {
            images = ['/fallback-property.jpg'];
        } else {
            const parsed = JSON.parse(property.image);
            if (Array.isArray(parsed)) {
                images = parsed.filter(url => url && url.length > 0);
            } else {
                images = property.image ? [property.image] : [];
            }
        }
    } catch {
        images = property.image ? [property.image] : [];
    }

    // Final fallback if images array is empty after processing
    if (images.length === 0) {
        images = ['/fallback-property.jpg'];
    }

    // Pad with fallback if we have fewer than 5 images to make the gallery look good
    // (Optional, but good for the grid layout)
    while (images.length < 5) {
        images.push(images[0] || '/fallback-property.jpg');
    }

    return (
        <main className="min-h-screen bg-brand-bg pb-20">
            <Navbar />

            <div className="pt-24 md:pt-32 px-6 max-w-7xl mx-auto">
                {/* Breadcrumb / Back */}
                <div className="mb-6 mt-4 md:mt-0">
                    <Link href="/listings" className="inline-flex items-center text-gray-500 hover:text-brand-dark transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Listings
                    </Link>
                </div>

                {/* Mosaic Gallery with Lightbox */}
                <PropertyGallery images={images} title={property.title} />

                {/* Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column (Content) - 65% */}
                    <div className="lg:w-[65%] space-y-12">

                        {/* Header Info */}
                        <div>
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl md:text-4xl font-bold text-brand-dark mb-2">{property.title}</h1>
                                    <div className="flex items-center text-gray-500 text-base md:text-lg">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        {property.address}
                                    </div>
                                </div>
                                <div className="lg:text-right mt-4 lg:mt-0">
                                    <div className="text-3xl font-bold text-brand-dark mb-2">
                                        ${property.price ? property.price.toLocaleString() : '0'}
                                    </div>
                                </div>
                            </div>

                            {/* Key Stats */}
                            <div className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-y border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <Bed className="w-6 h-6 text-brand-dark" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">{property.beds || 0} Beds</div>
                                        <div className="text-sm text-gray-500">Bedroom</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <Bath className="w-6 h-6 text-brand-dark" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">{property.baths || 0} Baths</div>
                                        <div className="text-sm text-gray-500">Bathroom</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <Square className="w-6 h-6 text-brand-dark" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">{property.sqft ? property.sqft.toLocaleString() : '0'}</div>
                                        <div className="text-sm text-gray-500">Square Feet</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description & Amenities */}
                        <FadeIn delay={0.2}>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">About this home</h2>
                                <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                    {property.description}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                    {amenitiesList.map((feature: any) => (
                                        <div key={feature} className="flex items-center gap-3 text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-brand-lime flex items-center justify-center shrink-0">
                                                <Check className="w-3 h-3 text-brand-dark" />
                                            </div>
                                            <span className="font-medium">{getAmenityLabel(feature)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Location Map Placeholder */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Location</h2>
                            <div className="bg-gray-200 rounded-3xl h-64 flex flex-col items-center justify-center text-gray-500 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                                <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
                                    <MapIcon className="w-5 h-5 text-brand-dark" />
                                    <span className="font-bold text-brand-dark">{property.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mortgage Calculator */}
                        <FadeIn delay={0.3}>
                            <MortgageCalculator homePrice={property.price} />
                        </FadeIn>

                    </div>

                    {/* Right Column (Sticky Sidebar) - 35% */}
                    <div className="lg:w-[35%]">
                        <div className="sticky top-32 space-y-6">
                            {/* Agent Card */}
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-16 h-16">
                                        {agent.image ? (
                                            <Image
                                                src={agent.image}
                                                alt={agent.name}
                                                fill
                                                className="object-cover rounded-full border-2 border-brand-lime"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full border-2 border-brand-lime bg-gray-100 flex items-center justify-center">
                                                <User className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{agent.name}</div>
                                        <div className="text-gray-500 text-sm">Listing Agent</div>
                                    </div>
                                </div>

                                <LeadForm propertyId={property.id} agentId={property.user_id} />
                            </div>

                            {/* Quick Contact */}
                            <div className="bg-brand-lime/20 p-6 rounded-3xl text-center">
                                <p className="font-bold text-brand-dark mb-2">Call or WhatsApp us</p>
                                {agent.phone !== "Contact for details" ? (
                                    <a
                                        href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl font-bold text-brand-dark hover:underline flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        {agent.phone}
                                    </a>
                                ) : (
                                    <div className="text-xl font-bold text-brand-dark flex items-center justify-center gap-2">
                                        <MessageCircle className="w-6 h-6" />
                                        {agent.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Listings */}
                <div className="mt-24 border-t border-gray-200 pt-16">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {similarListings.map((listing, index) => (
                            <Link
                                key={listing.id}
                                href={`/listings/${listing.id}`}
                                className={`block ${index === 2 ? 'hidden lg:block' : ''}`}
                            >
                                <PropertyCard property={listing} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
