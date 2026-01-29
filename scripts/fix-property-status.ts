
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPropertyStatus() {
    const { error } = await supabase
        .from('properties')
        .update({ status: 'Active', listing_type: 'Sale' })
        .in('title', ['The Aspen Summit Lodge', 'Silicon Valley Glass Cube', 'The Hamptons Heritage Estate']);

    if (error) {
        console.error('Error updating properties:', error);
        return;
    }

    console.log('Successfully updated properties status to Active and listing_type to Sale.');
}

fixPropertyStatus();
