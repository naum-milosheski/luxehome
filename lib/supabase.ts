import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-safe Supabase client (for use in client components)
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

// Server-side Supabase client with cookie support (for server actions and components)
export function createClient() {
    // Dynamic import to avoid importing server-only code at module level
    const { cookies } = require('next/headers');
    const cookieStore = cookies();

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value, ...options });
                } catch (error) {
                    // Handle error when cookies cannot be set (e.g., in middleware)
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value: '', ...options });
                } catch (error) {
                    // Handle error when cookies cannot be removed (e.g., in middleware)
                }
            },
        },
    });
}

// Admin Supabase client (bypasses RLS and Auth policies)
export function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
