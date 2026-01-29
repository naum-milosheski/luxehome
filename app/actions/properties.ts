'use server';

import { createClient } from '@/lib/supabase';
import { Property } from '@/types/supabase';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth';

export async function createProperty(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const type = formData.get('type') as string;
    const status = formData.get('status') as string;
    const beds = parseInt(formData.get('beds') as string);
    const baths = parseInt(formData.get('baths') as string);
    const sqft = parseInt(formData.get('sqft') as string);
    const amenities = JSON.parse(formData.get('amenities') as string);
    const listingType = formData.get('listing_type') as string;
    const address = formData.get('address') as string;

    // Handle Multiple Image Uploads
    const imageCount = parseInt(formData.get('image_count') as string || '0');
    const imageUrls: string[] = [];

    const supabase = await createClient();

    if (imageCount > 0) {
        // Upload each image
        for (let i = 0; i < imageCount; i++) {
            const imageFile = formData.get(`image_${i}`) as File;
            if (imageFile && imageFile.size > 0) {
                const filename = `${Date.now()}-${i}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from('properties')
                    .upload(filename, imageFile);

                if (error) {
                    console.error('Upload Error:', error);
                    throw new Error('Failed to upload image');
                }

                const { data: publicUrlData } = supabase.storage
                    .from('properties')
                    .getPublicUrl(filename);

                imageUrls.push(publicUrlData.publicUrl);
            }
        }
    }

    // If no images uploaded, use fallback
    if (imageUrls.length === 0) {
        const fallback = '/fallback-property.jpg';
        imageUrls.push(fallback, fallback, fallback, fallback, fallback);
    } else if (imageUrls.length < 5) {
        // Pad to 5 images if less than 5
        while (imageUrls.length < 5) {
            imageUrls.push(imageUrls[0]);
        }
    }

    // Store as JSON string
    const imageData = JSON.stringify(imageUrls);

    const { data, error } = await supabase
        .from('properties')
        .insert({
            title,
            description,
            price,
            type,
            status,
            beds,
            baths,
            sqft,
            amenities,
            image: imageData,
            address: address || '123 Luxury Lane, Beverly Hills, CA',
            listing_type: listingType || 'Sale',
            user_id: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create property');
    }

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/listings');
    return { success: true, data };
}

export type PropertyFilters = {
    minPrice?: number;
    maxPrice?: number;
    beds?: number | 'Any';
    baths?: number | 'Any';
    type?: string;
    limit?: number;
    search?: string;
    amenities?: string[];
    sort?: string;
    listingType?: 'Sale' | 'Rent';
    status?: string;
    offset?: number;
};

export async function getProperties(filters?: PropertyFilters) {
    const supabase = await createClient();

    let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

    // Default sort
    let sortColumn = 'created_at';
    let sortAscending = false;

    // Default to Active status unless specified otherwise (e.g. 'All' for admin)
    if (filters?.status && filters.status !== 'All') {
        query = query.eq('status', filters.status);
    } else if (!filters?.status) {
        query = query.eq('status', 'Active');
    }

    if (filters) {
        if (filters.minPrice) query = query.gte('price', filters.minPrice);
        if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
        if (filters.beds && filters.beds !== 'Any') query = query.gte('beds', filters.beds);
        if (filters.baths && filters.baths !== 'Any') query = query.gte('baths', filters.baths);
        if (filters.type && filters.type !== 'All') query = query.eq('type', filters.type);

        // Search (Location & Title - Smart Search)
        if (filters.search) {
            const searchTerm = filters.search;
            // ILIKE is case-insensitive. We search in both address and title.
            query = query.or(`address.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
        }

        // Listing Type (Buy vs Rent)
        if (filters.listingType) {
            if (filters.listingType === 'Sale') {
                // Include NULLs for legacy data
                query = query.or('listing_type.eq.Sale,listing_type.is.null');
            } else {
                query = query.eq('listing_type', filters.listingType);
            }
        }

        // Amenities
        if (filters.amenities && filters.amenities.length > 0) {
            // Check if amenities JSONB column contains the selected amenities
            // This assumes amenities is stored like { "pool": true, "gym": true }
            // We need to construct a json object to match.
            // Example: .contains('amenities', { pool: true, gym: true })
            const amenitiesFilter: Record<string, boolean> = {};
            filters.amenities.forEach(a => {
                amenitiesFilter[a.toLowerCase()] = true;
            });
            query = query.contains('amenities', amenitiesFilter);
        }

        if (filters.limit) {
            const from = filters.offset || 0;
            const to = from + filters.limit - 1;
            query = query.range(from, to);
        }

        // Sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'Price: Low to High':
                    sortColumn = 'price';
                    sortAscending = true;
                    break;
                case 'Price: High to Low':
                    sortColumn = 'price';
                    sortAscending = false;
                    break;
                case 'Newest First':
                    sortColumn = 'created_at';
                    sortAscending = false;
                    break;
                default:
                    sortColumn = 'created_at';
                    sortAscending = false;
            }
        }
    }

    query = query.order(sortColumn, { ascending: sortAscending });

    const { data, error, count } = await query;

    if (error) {
        console.error('Fetch Error:', error);
        return { data: [], count: 0 };
    }

    return { data: data as Property[], count: count || 0 };
}

export async function getPropertyById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Fetch Single Error:', error);
        return null;
    }

    return data as Property;
}

export async function getUserProperties() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch User Properties Error:', error);
        return [];
    }

    return data as Property[];
}

export async function deleteProperty(propertyId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();
    // RLS will ensure user can only delete their own properties
    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Delete Property Error:', error);
        throw new Error('Failed to delete property');
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/listings');
    return { success: true };
}

export async function updateProperty(propertyId: string, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();

    //Verify ownership first
    const { data: existingProperty, error: fetchError } = await supabase
        .from('properties')
        .select('user_id')
        .eq('id', propertyId)
        .single();

    if (fetchError || !existingProperty) {
        throw new Error('Property not found');
    }

    if (existingProperty.user_id !== user.id) {
        throw new Error('Unauthorized: You can only edit your own properties');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const type = formData.get('type') as string;
    const status = formData.get('status') as string;
    const beds = parseInt(formData.get('beds') as string);
    const baths = parseInt(formData.get('baths') as string);
    const sqft = parseInt(formData.get('sqft') as string);
    const amenities = JSON.parse(formData.get('amenities') as string);
    const listingType = formData.get('listing_type') as string;
    const address = formData.get('address') as string;

    // Handle Image Upload (optional - keep existing if no new image)
    const imageFile = formData.get('image') as File;
    let imageUrl = formData.get('existing_image') as string; // Pass existing image URL from form

    if (imageFile && imageFile.size > 0) {
        const filename = `${Date.now()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
            .from('properties')
            .upload(filename, imageFile);

        if (error) {
            console.error('Upload Error:', error);
            throw new Error('Failed to upload image');
        }

        const { data: publicUrlData } = supabase.storage
            .from('properties')
            .getPublicUrl(filename);

        imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
        .from('properties')
        .update({
            title,
            description,
            price,
            type,
            status,
            beds,
            baths,
            sqft,
            amenities,
            image: imageUrl,
            address,
            listing_type: listingType
        })
        .eq('id', propertyId)
        .eq('user_id', user.id) // Double check ownership
        .select()
        .single();

    if (error) {
        console.error('Update Error:', error);
        throw new Error('Failed to update property');
    }

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/listings');
    revalidatePath(`/listings/${propertyId}`);
    return { success: true, data };
}
