
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listProperties() {
    const { data, error } = await supabase
        .from('properties')
        .select('id, title, address');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('All Properties:', data);

    // Test Search
    const searchTerm = 'Villa';
    const { data: searchData, error: searchError } = await supabase
        .from('properties')
        .select('id, title, address')
        .or(`address.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);

    if (searchError) {
        console.error('Search Error:', searchError);
    } else {
        console.log(`Search Results for "${searchTerm}":`, searchData);
    }
}

listProperties();
