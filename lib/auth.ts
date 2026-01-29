'use server';

import { createClient, createAdminClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function signIn(email: string, password: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
}

export async function signUp(email: string, password: string, fullName: string) {
    const supabaseAdmin = createAdminClient();
    const supabase = await createClient();

    // 1. Create user with email automatically confirmed
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName,
        },
    });

    if (adminError) {
        return { success: false, error: adminError.message };
    }

    // 2. Immediately sign in to establish the session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        return { success: false, error: signInError.message };
    }

    // 3. Create profile entry for the new user
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: adminData.user.id,
            email: adminData.user.email,
            full_name: fullName,
            job_title: null,
            phone: null,
            bio: null,
            avatar_url: null
        });

    if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail signup if profile creation fails - user can update later
    }

    return { success: true, user: signInData.user };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

export async function getSession() {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        return null;
    }

    return session;
}
