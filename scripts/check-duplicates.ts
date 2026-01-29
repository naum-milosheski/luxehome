
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProperties() {
    const { data, error } = await supabase
        .from('properties')
        .select('id, title, image')
        .ilike('title', '%Minimalist Cliffside Villa%');

    if (error) {
        console.error('Error finding property:', error);
        return;
    }

    console.log(`Found ${data.length} properties:`);
    data.forEach((p: any) => {
        console.log(`- ID: ${p.id}, Title: ${p.title}, Image: ${p.image ? (p.image.length > 50 ? p.image.substring(0, 50) + '...' : p.image) : 'NULL'}`);
    });
}

checkProperties();
