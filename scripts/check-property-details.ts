
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPropertyDetails() {
    const { data, error } = await supabase
        .from('properties')
        .select('title, status, listing_type')
        .in('title', ['The Aspen Summit Lodge', 'Silicon Valley Glass Cube', 'The Hamptons Heritage Estate']);

    if (error) {
        console.error('Error checking properties:', error);
        return;
    }

    console.log('Property Details:');
    data.forEach((p: any) => {
        console.log(`- ${p.title}: Status=${p.status}, Type=${p.listing_type}`);
    });
}

checkPropertyDetails();
