
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

const updates = [
    {
        title: 'The Aspen Summit Lodge',
        description: 'Experience the pinnacle of alpine luxury in this breathtaking mountain estate. Nestled in the heart of Aspen, this architectural masterpiece offers panoramic views of the Rockies, ski-in/ski-out access, and a private wellness center. The interior features reclaimed timber beams, floor-to-ceiling glass walls, and a grand stone fireplace that anchors the living space. Perfect for entertaining, the lodge includes a gourmet chef\'s kitchen, a wine cellar, and a home theater. Outside, enjoy the heated infinity pool, expansive terraces, and a cozy fire pit under the stars.'
    },
    {
        title: 'Silicon Valley Glass Cube',
        description: 'A marvel of modern engineering and design, this transparent sanctuary redefines luxury living in Silicon Valley. The "Glass Cube" offers a seamless indoor-outdoor experience with its fully retractable glass walls and minimalist aesthetic. Smart home technology is integrated into every corner, allowing for effortless control of lighting, climate, and security. The property features a zen garden, a floating staircase, and a rooftop lounge with sweeping views of the tech capital. Ideally located near major tech campuses yet secluded enough to offer total privacy.'
    },
    {
        title: 'The Hamptons Heritage Estate',
        description: 'Timeless elegance meets modern comfort in this sprawling Hamptons estate. Set on 5 acres of manicured grounds, this heritage property boasts a classic shingle-style main house, a guest cottage, and a pool house. The interiors are appointed with custom millwork, hardwood floors, and designer finishes throughout. The estate features a professional-grade kitchen, a formal dining room, and a sun-drenched conservatory. Outdoors, you\'ll find a tennis court, a heated gunite pool, and private access to the beach. A true legacy property for the discerning buyer.'
    }
];

async function updateDescriptions() {
    for (const update of updates) {
        const { error } = await supabase
            .from('properties')
            .update({ description: update.description })
            .eq('title', update.title);

        if (error) {
            console.error(`Error updating ${update.title}:`, error);
        } else {
            console.log(`Updated description for: ${update.title}`);
        }
    }
}

updateDescriptions();
