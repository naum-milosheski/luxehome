
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

const FALLBACK_IMAGE = '/fallback-property.jpg';

async function sanitizeData() {
    console.log('Starting Data Sanitization...');

    const { data: properties, error } = await supabase
        .from('properties')
        .select('*');

    if (error) {
        console.error('Error fetching properties:', error);
        return;
    }

    console.log(`Found ${properties.length} properties to check.`);

    for (const property of properties) {
        let updates = {};
        let needsUpdate = false;

        // 1. Fix Images
        let newImages = [];
        let currentImage = property.image;

        if (!currentImage) {
            // Case: No image -> Use fallback repeated 5 times
            newImages = Array(5).fill(FALLBACK_IMAGE);
            needsUpdate = true;
            console.log(`[${property.title}] Fixed: Missing image -> Fallback`);
        } else {
            try {
                // Try to parse if it's a JSON string
                const parsed = JSON.parse(currentImage);
                if (Array.isArray(parsed)) {
                    // Case: Already an array
                    newImages = parsed;
                    if (newImages.length < 5) {
                        // Pad with the first image or fallback
                        const fillImg = newImages[0] || FALLBACK_IMAGE;
                        while (newImages.length < 5) {
                            newImages.push(fillImg);
                        }
                        needsUpdate = true;
                        console.log(`[${property.title}] Fixed: Array padded to 5`);
                    }
                } else {
                    // Case: JSON but not array? Treat as single string
                    newImages = Array(5).fill(parsed);
                    needsUpdate = true;
                    console.log(`[${property.title}] Fixed: Single JSON string -> Array of 5`);
                }
            } catch (e) {
                // Case: Simple string URL
                newImages = Array(5).fill(currentImage);
                // Only update if it wasn't already a stringified array of 5 identical URLs (unlikely to match exactly without parsing, so safe to update)
                // But wait, the DB column is text. If we write a JSON array, it becomes a string.
                // We should check if the current string is NOT the stringified version of this new array.
                if (currentImage !== JSON.stringify(newImages)) {
                    needsUpdate = true;
                    console.log(`[${property.title}] Fixed: Single URL string -> Array of 5`);
                }
            }
        }

        if (needsUpdate) {
            updates.image = JSON.stringify(newImages);
        }

        // 2. Fix Amenities
        let newAmenities = {
            pool: false,
            gym: false,
            view: false,
            parking: false,
            security: false,
            wifi: false
        };
        let amenitiesChanged = false;

        if (property.amenities) {
            if (typeof property.amenities === 'string') {
                // Check if it's the old array format e.g. '["Pool", "Gym"]'
                if (property.amenities.trim().startsWith('[')) {
                    try {
                        const parsed = JSON.parse(property.amenities);
                        if (Array.isArray(parsed)) {
                            parsed.forEach(tag => {
                                const t = tag.toLowerCase();
                                if (t.includes('pool')) newAmenities.pool = true;
                                if (t.includes('gym') || t.includes('fitness')) newAmenities.gym = true;
                                if (t.includes('view') || t.includes('ocean') || t.includes('mountain') || t.includes('lake')) newAmenities.view = true;
                                if (t.includes('parking') || t.includes('garage')) newAmenities.parking = true;
                                if (t.includes('security') || t.includes('doorman') || t.includes('gated')) newAmenities.security = true;
                                if (t.includes('wifi') || t.includes('smart') || t.includes('internet')) newAmenities.wifi = true;
                            });
                            amenitiesChanged = true;
                            console.log(`[${property.title}] Fixed: Converted Array Amenities to Object`);
                        }
                    } catch (e) {
                        console.error(`[${property.title}] Error parsing amenities:`, e);
                    }
                } else {
                    // Maybe it's already an object string?
                    try {
                        const parsed = JSON.parse(property.amenities);
                        if (!Array.isArray(parsed) && typeof parsed === 'object') {
                            // It's already an object, just ensure keys
                            newAmenities = { ...newAmenities, ...parsed };
                            // Check if we actually changed anything (missing keys)
                            if (JSON.stringify(newAmenities) !== JSON.stringify(parsed)) {
                                amenitiesChanged = true;
                                console.log(`[${property.title}] Fixed: Normalized Object Amenities`);
                            }
                        }
                    } catch (e) {
                        // Not JSON, maybe comma separated?
                        // Assume legacy data is mostly JSON array from seed.
                    }
                }
            } else if (typeof property.amenities === 'object') {
                // Already object (from Supabase client auto-parse if configured, but here we get raw usually?)
                // The supabase js client might return JSON columns as objects.
                // Let's assume 'properties' table 'amenities' column is JSONB.
                // If it is JSONB, supabase returns it as object/array.
                if (Array.isArray(property.amenities)) {
                    // Same logic as above for array
                    property.amenities.forEach(tag => {
                        const t = tag.toLowerCase();
                        if (t.includes('pool')) newAmenities.pool = true;
                        if (t.includes('gym') || t.includes('fitness')) newAmenities.gym = true;
                        if (t.includes('view') || t.includes('ocean') || t.includes('mountain') || t.includes('lake')) newAmenities.view = true;
                        if (t.includes('parking') || t.includes('garage')) newAmenities.parking = true;
                        if (t.includes('security') || t.includes('doorman') || t.includes('gated')) newAmenities.security = true;
                        if (t.includes('wifi') || t.includes('smart') || t.includes('internet')) newAmenities.wifi = true;
                    });
                    amenitiesChanged = true;
                    console.log(`[${property.title}] Fixed: Converted Array (JSONB) Amenities to Object`);
                } else {
                    // Object
                    newAmenities = { ...newAmenities, ...property.amenities };
                    // We can't easily compare equality without deep check, but let's just update to be safe if keys were missing
                    // Actually, let's just force update to ensure consistency
                    amenitiesChanged = true;
                }
            }
        }

        if (amenitiesChanged) {
            updates.amenities = newAmenities; // Supabase will handle JSON stringification for JSONB column
            needsUpdate = true;
        }

        if (needsUpdate) {
            const { error: updateError } = await supabase
                .from('properties')
                .update(updates)
                .eq('id', property.id);

            if (updateError) {
                console.error(`[${property.title}] Update Failed:`, updateError);
            } else {
                console.log(`[${property.title}] SUCCESS: Updated.`);
            }
        } else {
            console.log(`[${property.title}] Skipped: Already clean.`);
        }
    }

    console.log('Sanitization Complete.');
}

sanitizeData();
