import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/types';

export async function getClients(userId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching clients:', error.message, error.details);
    return [];
  }

  return data ?? [];
}

export async function createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error.message, error.details, error.code);
    console.error('Client data sent:', client);
    return null;
  }

  return data;
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
    return null;
  }

  return data;
}

export async function deleteClient(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    return false;
  }

  return true;
}
