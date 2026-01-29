
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`Using key: ${supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'}`);

const properties = [
    {
        title: 'The Aspen Summit Lodge',
        address: '123 Alpine Way, Aspen, CO 81611',
        price: 14500000,
        beds: 5,
        baths: 6,
        sqft: 4500,
        image: JSON.stringify(["/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png", "/aspen-lodge.png"]),
        amenities: { mountainView: true, fireplace: true, sauna: true, spa: true, parking: true },
        agentName: 'Sora Tanaka' // Was Marcus Thorne
    },
    {
        title: 'Silicon Valley Glass Cube',
        address: '456 Tech Blvd, Palo Alto, CA 94301',
        price: 8200000,
        beds: 4,
        baths: 4,
        sqft: 3200,
        image: JSON.stringify(["/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png", "/silicon-cube.png"]),
        amenities: { smartHome: true, homeTheater: true, infinityPool: true, gym: true, security: true },
        agentName: 'Eleanor Vance' // Was Elena Vance
    },
    {
        title: 'The Hamptons Heritage Estate',
        address: '789 Ocean Drive, Southampton, NY 11968',
        price: 22000000,
        beds: 8,
        baths: 9,
        sqft: 8500,
        image: JSON.stringify(["/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png", "/hamptons-estate.png"]),
        amenities: { wineCellar: true, gatedCommunity: true, guestHouse: true, pool: true, waterfront: true },
        agentName: 'Julian St. James' // Was James Sterling
    }
];

async function seedProperties() {
    for (const p of properties) {
        // Find agent ID
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('full_name', p.agentName)
            .limit(1);

        if (profileError || !profiles || profiles.length === 0) {
            console.error(`Error finding agent ${p.agentName}:`, profileError);
            continue;
        }

        const userId = profiles[0].id;
        console.log(`Found agent ${p.agentName} (ID: ${userId})`);

        // Insert property
        const { error: insertError } = await supabase
            .from('properties')
            .insert({
                title: p.title,
                address: p.address,
                price: p.price,
                beds: p.beds,
                baths: p.baths,
                sqft: p.sqft,
                image: p.image,
                amenities: p.amenities,
                user_id: userId
            });

        if (insertError) {
            console.error(`Error inserting ${p.title}:`, insertError);
        } else {
            console.log(`Successfully inserted ${p.title}`);
        }
    }
}

seedProperties();
