/**
 * Master Amenities List - Single Source of Truth
 * 
 * This file defines ALL amenities used across the LuxeHome AI platform.
 * Any changes made here will automatically propagate to:
 * - Add Property page
 * - Edit Property page  
 * - Search Filters
 * - Property Detail pages
 */

export type AmenityKey =
    // Wellness
    | 'pool'
    | 'infinityPool'
    | 'spa'
    | 'sauna'
    | 'gym'
    // Views
    | 'oceanView'
    | 'cityView'
    | 'mountainView'
    | 'waterfront'
    // Premium
    | 'homeTheater'
    | 'wineCellar'
    | 'smartHome'
    | 'fireplace'
    | 'elevator'
    | 'guestHouse'
    // Basics
    | 'wifi'
    | 'parking'
    | 'security'
    | 'gatedCommunity';

export interface Amenity {
    key: AmenityKey;
    label: string;
    category: 'wellness' | 'views' | 'premium' | 'basics';
}

export const MASTER_AMENITIES: Amenity[] = [
    // Wellness
    { key: 'pool', label: 'Pool', category: 'wellness' },
    { key: 'infinityPool', label: 'Infinity Pool', category: 'wellness' },
    { key: 'spa', label: 'Spa/Hot Tub', category: 'wellness' },
    { key: 'sauna', label: 'Sauna', category: 'wellness' },
    { key: 'gym', label: 'Gym', category: 'wellness' },

    // Views
    { key: 'oceanView', label: 'Ocean View', category: 'views' },
    { key: 'cityView', label: 'City View', category: 'views' },
    { key: 'mountainView', label: 'Mountain View', category: 'views' },
    { key: 'waterfront', label: 'Waterfront', category: 'views' },

    // Premium
    { key: 'homeTheater', label: 'Home Theater', category: 'premium' },
    { key: 'wineCellar', label: 'Wine Cellar', category: 'premium' },
    { key: 'smartHome', label: 'Smart Home', category: 'premium' },
    { key: 'fireplace', label: 'Fireplace', category: 'premium' },
    { key: 'elevator', label: 'Elevator', category: 'premium' },
    { key: 'guestHouse', label: 'Guest House', category: 'premium' },

    // Basics
    { key: 'wifi', label: 'Wifi', category: 'basics' },
    { key: 'parking', label: 'Parking', category: 'basics' },
    { key: 'security', label: 'Security', category: 'basics' },
    { key: 'gatedCommunity', label: 'Gated Community', category: 'basics' },
];

/**
 * Creates an empty amenities object with all keys set to false
 * Used for initializing state in forms
 */
export const createEmptyAmenities = (): Record<AmenityKey, boolean> => {
    return MASTER_AMENITIES.reduce((acc, amenity) => {
        acc[amenity.key] = false;
        return acc;
    }, {} as Record<AmenityKey, boolean>);
};

/**
 * Gets amenity label from key
 */
export const getAmenityLabel = (key: string): string => {
    const amenity = MASTER_AMENITIES.find(a => a.key === key);
    return amenity ? amenity.label : key;
};

/**
 * Gets active amenities from an object
 */
export const getActiveAmenities = (amenities: Record<string, boolean>): string[] => {
    return Object.keys(amenities).filter(key => amenities[key]);
};
