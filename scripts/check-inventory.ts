
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInventory() {
    const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting properties:', error);
        return;
    }

    console.log(`Total Properties: ${count}`);

    const { data, error: listError } = await supabase
        .from('properties')
        .select('title')
        .in('title', ['The Aspen Summit Lodge', 'Silicon Valley Glass Cube', 'The Hamptons Heritage Estate']);

    if (listError) {
        console.error('Error listing specific properties:', listError);
        return;
    }

    console.log('Found specific properties:', data.map((p: any) => p.title));
}

checkInventory();
