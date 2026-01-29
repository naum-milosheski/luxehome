export type Property = {
    id: string;
    title: string;
    description: string;
    price: number;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    image: string;
    status: 'Draft' | 'Active' | 'Archived';
    type: 'House' | 'Condo' | 'Villa' | 'Apartment' | 'Land';
    listing_type: 'Sale' | 'Rent';
    amenities: {
        pool: boolean;
        gym: boolean;
        view: boolean;
        parking: boolean;
        security: boolean;
        wifi: boolean;
    };
    created_at: string;
    user_id: string;
};

export type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
    score: number;
    property_id: string | null;
    agent_id: string | null;
    created_at: string;
};
