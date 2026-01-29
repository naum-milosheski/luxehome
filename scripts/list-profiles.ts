
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listProfiles() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name');

    if (error) {
        console.error('Error listing profiles:', error);
        return;
    }

    console.log('Existing Profiles:');
    data.forEach((p: any) => console.log(`- ${p.full_name} (${p.id})`));
}

listProfiles();
