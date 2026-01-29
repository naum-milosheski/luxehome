'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { getProperties, PropertyFilters } from '@/app/actions/properties';
import { Property } from '@/types/supabase';
import { SlidersHorizontal, Search, ChevronDown, X, Filter } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useSearchParams } from 'next/navigation';
import FadeIn from '@/components/FadeIn';
import FilterContent from '@/components/FilterContent';

function ListingsContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRefDesktop = useRef<HTMLDivElement>(null);
    const sortRefMobile = useRef<HTMLDivElement>(null);
    const sortRefTablet = useRef<HTMLDivElement>(null);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const isOutsideDesktop = !sortRefDesktop.current || !sortRefDesktop.current.contains(event.target as Node);
            const isOutsideMobile = !sortRefMobile.current || !sortRefMobile.current.contains(event.target as Node);
            const isOutsideTablet = !sortRefTablet.current || !sortRefTablet.current.contains(event.target as Node);

            if (isOutsideDesktop && isOutsideMobile && isOutsideTablet) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [sortBy, setSortBy] = useState('Newest First');

    // Data State
    const [properties, setProperties] = useState<Property[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Filter State
    const [filters, setFilters] = useState<PropertyFilters>({
        type: 'All',
        beds: 'Any',
        baths: 'Any',
        minPrice: undefined,
        maxPrice: undefined,
        search: initialSearch,
        amenities: [],
        sort: 'Newest First',
        listingType: 'Sale', // Default to Sale
    });

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Detect screen size for card count
    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth < 1024);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    // Lock body scroll when mobile filter is open
    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileFilterOpen]);

    // Fetch Data
    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            setDisplayCount(6); // Reset display count when filters change
            // Always fetch 9 items initially
            const { data, count } = await getProperties({ ...filters, limit: 9, offset: 0 });
            setProperties(data);
            setTotalCount(count);
            setIsLoading(false);
        };

        // Debounce fetch for text inputs if needed, but for now direct call
        const timeoutId = setTimeout(() => {
            fetchProperties();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const [displayCount, setDisplayCount] = useState(6); // Track how many to display on mobile

    const handleLoadMore = async () => {
        // On mobile, if we have more items in the fetched array, just show more
        if (isMobileView && displayCount < properties.length) {
            setDisplayCount(prev => Math.min(prev + 6, properties.length));
            return;
        }

        // Otherwise, fetch more from server
        setIsLoadingMore(true);
        const nextOffset = properties.length;
        const { data } = await getProperties({ ...filters, limit: 9, offset: nextOffset });
        setProperties(prev => [...prev, ...data]);
        if (isMobileView) {
            setDisplayCount(prev => prev + 6);
        }
        setIsLoadingMore(false);
    };

    const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
        setFilters(prev => {
            // Special handling for Property Type toggle (deselect)
            if (key === 'type' && prev.type === value) {
                return { ...prev, type: 'All' };
            }
            return { ...prev, [key]: value };
        });
    };

    const toggleAmenity = (amenity: string) => {
        setFilters(prev => {
            const currentAmenities = prev.amenities || [];
            if (currentAmenities.includes(amenity)) {
                return { ...prev, amenities: currentAmenities.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...currentAmenities, amenity] };
            }
        });
    };

    return (
        <main className="min-h-screen bg-brand-bg pb-20">
            <Navbar />

            <div className="pt-32 md:pt-48 px-4 max-w-[1600px] mx-auto">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Pro-Level Sidebar Filters (Desktop) */}
                    <FadeIn delay={0.1} className="hidden lg:block">
                        <aside className="w-[340px] shrink-0 space-y-6">
                            <div className="bg-brand-card rounded-3xl p-6 shadow-sm sticky top-32">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <SlidersHorizontal size={20} />
                                        Filters
                                    </h3>
                                    <button
                                        onClick={() => setFilters({
                                            type: 'All',
                                            beds: 'Any',
                                            baths: 'Any',
                                            minPrice: undefined,
                                            maxPrice: undefined,
                                            search: '',
                                            amenities: [],
                                            sort: 'Newest First',
                                            listingType: 'Sale'
                                        })}
                                        className="text-sm text-gray-400 hover:text-brand-dark transition-colors"
                                    >
                                        Reset All
                                    </button>
                                </div>

                                <FilterContent
                                    filters={filters}
                                    setFilters={setFilters}
                                    handleFilterChange={handleFilterChange}
                                    toggleAmenity={toggleAmenity}
                                    isSidebar={true}
                                />
                            </div>
                        </aside>
                    </FadeIn>

                    {/* Property Grid */}
                    <FadeIn className="flex-1">
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-brand-dark mb-2">Luxury Listings</h1>
                                    <p className="text-gray-500">Discover your next dream home in exclusive locations.</p>
                                </div>

                                <div className="hidden lg:flex items-center gap-3 relative self-start md:self-auto">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                                    <div className="relative w-full md:w-auto" ref={sortRefDesktop}>
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-brand-lime transition-colors min-w-[160px] justify-between w-full md:w-auto"
                                        >
                                            {sortBy}
                                            <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isSortOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
                                                {['Newest First', 'Price: High to Low', 'Price: Low to High'].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            handleFilterChange('sort', option);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Filter Bar - Below Heading (Mobile Only) */}
                            <div className="md:hidden mb-6">
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="w-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl p-4 flex items-center justify-between font-bold text-brand-dark mb-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter size={20} />
                                        <span>Filters</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-normal">
                                        {filters.type !== 'All' && <span className="bg-brand-lime/20 text-brand-dark px-2 py-0.5 rounded-md">{filters.type}</span>}
                                        <ChevronDown size={16} />
                                    </div>
                                </button>

                                {/* Mobile Sort By - Below Filters (Mobile Only) */}
                                <div className="flex items-center gap-3 relative">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                                    <div className="relative w-full" ref={sortRefMobile}>
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-brand-lime transition-colors min-w-[160px] justify-between w-full"
                                        >
                                            {sortBy}
                                            <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isSortOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
                                                {['Newest First', 'Price: High to Low', 'Price: Low to High'].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            handleFilterChange('sort', option);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tablet Filter + Sort By Row (Tablet Only) */}
                            <div className="hidden md:flex lg:hidden items-center gap-4 mb-6">
                                <button
                                    onClick={() => setIsMobileFilterOpen(true)}
                                    className="flex-1 bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl p-4 flex items-center justify-between font-bold text-brand-dark"
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter size={20} />
                                        <span>Filters</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-normal">
                                        {filters.type !== 'All' && <span className="bg-brand-lime/20 text-brand-dark px-2 py-0.5 rounded-md">{filters.type}</span>}
                                        <ChevronDown size={16} />
                                    </div>
                                </button>

                                <div className="flex items-center gap-3 relative">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                                    <div className="relative" ref={sortRefTablet}>
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-brand-lime transition-colors min-w-[160px] justify-between"
                                        >
                                            {sortBy}
                                            <ChevronDown size={16} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isSortOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-10">
                                                {['Newest First', 'Price: High to Low', 'Price: Low to High'].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            handleFilterChange('sort', option);
                                                            setIsSortOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <div key={n} className="bg-brand-card rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
                                            {/* Image skeleton */}
                                            <div className="relative h-64 w-full shrink-0 bg-gray-200 animate-pulse">
                                                {/* Badge skeleton */}
                                                <div className="absolute top-4 right-4 bg-gray-300 rounded-full h-6 w-16 animate-pulse" />
                                            </div>
                                            {/* Content skeleton */}
                                            <div className="p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            {/* Title skeleton */}
                                                            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse" />
                                                            {/* Address skeleton */}
                                                            <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
                                                        </div>
                                                        {/* Price skeleton */}
                                                        <div className="h-6 bg-gray-200 rounded-lg w-20 ml-4 animate-pulse" />
                                                    </div>
                                                </div>
                                                {/* Stats skeleton */}
                                                <div className="flex gap-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                                        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                                        <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                                                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : properties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(isMobileView ? properties.slice(0, displayCount) : properties).map((property) => (
                                        <Link key={property.id} href={`/listings/${property.id}`} className="block h-full">
                                            <PropertyCard property={property} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-brand-card rounded-3xl p-12 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-2">No Properties Found</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        We couldn't find any properties matching your current filters. Try adjusting your search criteria.
                                    </p>
                                    <button
                                        onClick={() => setFilters({
                                            type: 'All',
                                            beds: 'Any',
                                            baths: 'Any',
                                            minPrice: undefined,
                                            maxPrice: undefined,
                                            search: '',
                                            amenities: [],
                                            sort: 'Newest First',
                                            listingType: 'Sale'
                                        })}
                                        className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-lime hover:text-brand-dark transition-all"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}

                            {/* Load More Button */}
                            {!isLoading && (
                                (isMobileView && displayCount < properties.length) ||
                                properties.length < totalCount
                            ) && (
                                    <div className="mt-12 flex justify-center">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                            className="bg-white border border-gray-200 text-brand-dark px-8 py-3 rounded-full font-bold hover:bg-brand-lime hover:border-brand-lime hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center gap-2"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                                                    Loading...
                                                </>
                                            ) : (
                                                'Load More Properties'
                                            )}
                                        </button>
                                    </div>
                                )}
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden h-[85vh] flex flex-col shadow-2xl"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-xl">Filters</h3>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <FilterContent
                                    filters={filters}
                                    setFilters={setFilters}
                                    handleFilterChange={handleFilterChange}
                                    toggleAmenity={toggleAmenity}
                                    isSidebar={false}
                                />
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-white pb-8">
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="w-full bg-brand-dark text-white font-bold py-3 rounded-xl hover:bg-brand-lime hover:text-brand-dark transition-all"
                                >
                                    Show {totalCount} Properties
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function ListingsPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-brand-bg pb-20">
                <Navbar />
                <div className="pt-32 md:pt-48 px-4 max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-brand-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </main>
        }>
            <ListingsContent />
        </Suspense>
    );
}
