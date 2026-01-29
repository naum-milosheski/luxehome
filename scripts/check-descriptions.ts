
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDescriptions() {
    const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, description');

    if (error) {
        console.error('Error fetching properties:', error);
        return;
    }

    console.log(`Found ${properties.length} properties.`);
    properties.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Title: ${p.title}`);
        console.log(`Description Length: ${p.description ? p.description.length : 0}`);
        console.log(`Description Preview: ${p.description ? p.description.substring(0, 50) + '...' : 'N/A'}`);
        console.log('---');
    });
}

checkDescriptions();
