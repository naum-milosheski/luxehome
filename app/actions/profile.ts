'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export type Profile = {
    id: string;
    full_name: string | null;
    job_title: string | null;
    email: string | null;
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
    updated_at: string | null;
};

export async function getCurrentProfile() {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Fetch Profile Error:', error);
        return null;
    }

    if (!data) {
        // If no profile exists, return a basic object with email from auth
        return {
            id: user.id,
            email: user.email,
            full_name: '',
            job_title: '',
            phone: '',
            bio: '',
            avatar_url: ''
        } as Profile;
    }

    return data as Profile;
}

export async function getProfileById(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Fetch Profile By ID Error:', error);
        return null;
    }

    return data as Profile;
}

export async function updateProfile(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const full_name = formData.get('full_name') as string;
    const job_title = formData.get('job_title') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const bio = formData.get('bio') as string;

    // Handle Image Upload
    const imageFile = formData.get('avatar') as File;
    let avatar_url = formData.get('existing_avatar') as string;

    if (imageFile && imageFile.size > 0) {
        const supabase = await createClient();
        // Organize by user ID for RLS policy
        const filename = `${user.id}/avatar-${Date.now()}`;
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filename, imageFile, {
                upsert: true // Replace existing file if present
            });

        if (error) {
            console.error('Avatar Upload Error:', error);
            throw new Error('Failed to upload avatar');
        }

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filename);

        avatar_url = publicUrlData.publicUrl;
    }

    const profileData = {
        id: user.id,
        full_name,
        job_title,
        email,
        phone,
        bio,
        avatar_url,
        updated_at: new Date().toISOString(),
    };

    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

    if (error) {
        console.error('Update Profile Error:', error);
        throw new Error('Failed to update profile');
    }

    revalidatePath('/admin/settings');
    revalidatePath('/listings'); // Revalidate listings to show new agent info
    return { success: true };
}
