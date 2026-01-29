'use server';

import { createClient } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { Lead } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import { scoreLead } from './ai';

export async function createLead(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const property_id = formData.get('property_id') as string | null;
    let agent_id = formData.get('agent_id') as string | null;

    // If no agent_id provided (manual entry), assign to current user
    if (!agent_id) {
        const user = await getCurrentUser();
        if (user) {
            agent_id = user.id;
        }
    }

    // AI Scoring
    const score = await scoreLead(message);

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('leads')
        .insert({
            name,
            email,
            phone,
            message,
            status: 'New',
            score,
            property_id,
            agent_id
        })
        .select()
        .single();

    if (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create lead');
    }

    revalidatePath('/admin/leads');
    return { success: true, data };
}

export async function getLeads() {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('agent_id', user.id) // STRICT PRIVACY: Only show leads for this agent
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Fetch Error:', error);
        return [];
    }

    return data as Lead[];
}

export async function updateLeadStatus(leadId: string, status: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();

    // Verify ownership
    const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('id', leadId)
        .eq('agent_id', user.id);

    if (!count) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

    if (error) throw new Error('Failed to update status');

    revalidatePath('/admin/leads');
    return { success: true };
}

export async function deleteLead(leadId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)
        .eq('agent_id', user.id); // Security check

    if (error) throw new Error('Failed to delete lead');

    revalidatePath('/admin/leads');
    return { success: true };
}
