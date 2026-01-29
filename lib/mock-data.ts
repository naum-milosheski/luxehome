// Mock data types are not strictly enforced to allow demo-specific properties

// Mock data for demo purposes - uses extended properties for UI display
export const PROPERTIES = [
    {
        id: '1',
        title: 'Modern Glass Villa',
        address: '1234 Silver Lake Blvd, Los Angeles, CA',
        price: 4500000,
        beds: 4,
        baths: 3.5,
        sqft: 3200,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'A stunning architectural masterpiece featuring floor-to-ceiling glass walls, panoramic views of the city, and a private infinity pool. This modern home offers the ultimate in luxury living with open-concept spaces and high-end finishes throughout.',
        features: ['Pool', 'Smart Home', 'View', 'Modern Kitchen', 'Wine Cellar'],
        agent: {
            name: 'Sarah Miller',
            phone: '(323) 555-0123',
            email: 'sarah.miller@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.0869, lng: -118.2702 }
    },
    {
        id: '2',
        title: 'Beverly Hills Estate',
        address: '90210 Sunset Blvd, Beverly Hills, CA',
        price: 12500000,
        beds: 6,
        baths: 7,
        sqft: 8500,
        type: 'Mansion',
        image: 'https://images.unsplash.com/photo-1600596542815-6ad4c72268c2?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1600596542815-6ad4c72268c2?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Exquisite Mediterranean estate in the heart of Beverly Hills. Features a grand entrance, lush gardens, tennis court, and a guest house. Perfect for entertaining on a grand scale.',
        features: ['Tennis Court', 'Guest House', 'Theater', 'Library', 'Pool'],
        agent: {
            name: 'James Bond',
            phone: '(310) 555-0007',
            email: 'james.bond@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.0736, lng: -118.4004 }
    },
    {
        id: '3',
        title: 'Malibu Oceanfront',
        address: '23000 Pacific Coast Hwy, Malibu, CA',
        price: 8900000,
        beds: 3,
        baths: 3,
        sqft: 2800,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Direct beach access and breathtaking ocean views from every room. This contemporary beach house is the epitome of California coastal living.',
        features: ['Ocean View', 'Beach Access', 'Deck', 'Fireplace'],
        agent: {
            name: 'Sarah Miller',
            phone: '(323) 555-0123',
            email: 'sarah.miller@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.0259, lng: -118.7798 }
    },
    {
        id: '4',
        title: 'Downtown Penthouse',
        address: '1111 S Figueroa St, Los Angeles, CA',
        price: 3200000,
        beds: 2,
        baths: 2.5,
        sqft: 1900,
        type: 'Condo',
        image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Luxury penthouse in the sky. Enjoy city lights and resort-style amenities including a rooftop pool, gym, and 24-hour concierge.',
        features: ['City View', 'Concierge', 'Gym', 'Rooftop Pool'],
        agent: {
            name: 'James Bond',
            phone: '(310) 555-0007',
            email: 'james.bond@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.0416, lng: -118.2653 }
    },
    {
        id: '5',
        title: 'Hollywood Hills Modern',
        address: '1500 Blue Jay Way, Los Angeles, CA',
        price: 5500000,
        beds: 3,
        baths: 4,
        sqft: 3500,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Iconic bird streets location with jetliner views. Sleek modern design with open floor plan and walls of glass.',
        features: ['View', 'Pool', 'Smart Home', 'Gated'],
        agent: {
            name: 'Sarah Miller',
            phone: '(323) 555-0123',
            email: 'sarah.miller@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.1031, lng: -118.3888 }
    },
    {
        id: '6',
        title: 'Venice Canal Cottage',
        address: '400 Venice Blvd, Venice, CA',
        price: 2800000,
        beds: 2,
        baths: 2,
        sqft: 1500,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Charming cottage right on the historic Venice Canals. Walk to the beach and Abbot Kinney.',
        features: ['Waterfront', 'Garden', 'Historic', 'Walkable'],
        agent: {
            name: 'James Bond',
            phone: '(310) 555-0007',
            email: 'james.bond@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 33.9850, lng: -118.4695 }
    },
    {
        id: '7',
        title: 'Pasadena Craftsman',
        address: '500 Orange Grove Blvd, Pasadena, CA',
        price: 1900000,
        beds: 4,
        baths: 3,
        sqft: 2600,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Beautifully restored Craftsman home with original woodwork, built-ins, and a large front porch.',
        features: ['Historic', 'Garden', 'Porch', 'Fireplace'],
        agent: {
            name: 'Sarah Miller',
            phone: '(323) 555-0123',
            email: 'sarah.miller@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.1478, lng: -118.1445 }
    },
    {
        id: '8',
        title: 'Bel Air Mansion',
        address: '700 Bel Air Rd, Los Angeles, CA',
        price: 25000000,
        beds: 8,
        baths: 10,
        sqft: 12000,
        type: 'Mansion',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'The ultimate in privacy and luxury. Gated estate with expansive grounds, ballroom, screening room, and wine cellar.',
        features: ['Gated', 'Pool', 'Theater', 'Wine Cellar', 'Tennis Court'],
        agent: {
            name: 'James Bond',
            phone: '(310) 555-0007',
            email: 'james.bond@luxehome.ai',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        coordinates: { lat: 34.0837, lng: -118.4455 }
    }
];

export const mockLeads = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-0101',
        message: 'I am looking for a property in Beverly Hills. Cash buyer.',
        status: 'New',
        created_at: '2023-10-27T10:00:00Z',
    },
    {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '555-0102',
        message: 'Just looking around, not ready to buy yet.',
        status: 'New',
        created_at: '2023-10-26T14:30:00Z',
    },
    {
        id: '3',
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        phone: '555-0103',
        message: 'Interested in the Malibu property. Can we schedule a viewing?',
        status: 'Contacted',
        created_at: '2023-10-25T09:15:00Z',
    },
];

export function getPropertyById(id: string) {
    return PROPERTIES.find((p) => p.id === id);
}
