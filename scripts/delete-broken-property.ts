
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log(`Using key: ${supabaseKey === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'}`);

async function findAndDeleteProperty() {
    const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .ilike('title', '%Minimalist Cliffside Villa%');

    if (error) {
        console.error('Error finding property:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log(`Found ${data.length} properties.`);
        for (const p of data) {
            console.log(`Deleting property: ${p.title} (${p.id})`);
            const { error: deleteError } = await supabase
                .from('properties')
                .delete()
                .eq('id', p.id);

            if (deleteError) {
                console.error('Error deleting property:', deleteError);
            } else {
                console.log('Successfully deleted property.');
            }
        }

    } else {
        console.log('Property not found.');
    }
}

findAndDeleteProperty();
