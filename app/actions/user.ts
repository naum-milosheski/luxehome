'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteAccount() {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: 'Not authenticated' };
    }

    try {
        // Delete profile first (will be cascade deleted anyway, but explicit is good)
        await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);

        // Delete the user from auth.users
        // This will cascade delete:
        // - properties (ON DELETE CASCADE)
        // - Set leads.agent_id to NULL (ON DELETE SET NULL)
        const { error: deleteError } = await supabase.rpc('delete_user');

        if (deleteError) {
            console.error('Delete user error:', deleteError);
            return { error: deleteError.message };
        }

        // Sign out the user to invalidate their session
        await supabase.auth.signOut();

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Account deletion error:', error);
        return { error: 'Failed to delete account' };
    }
}
