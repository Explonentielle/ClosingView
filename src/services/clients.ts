import { supabase } from '@/integrations/supabase/client';
import type { Client, Offer } from '@/types';

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

export async function createClient(clientData: {
  user_id: string;
  name: string;
  niche: string;
  type: string[];
  initials: string;
  color: string;
  total_amount: number;
  offers: Array<{ name: string; amount: number; max_installments: number }>;
}): Promise<Client | null> {
  const { offers, ...clientPayload } = clientData;

  const { data: newClient, error: clientError } = await supabase
    .from('clients')
    .insert([clientPayload])
    .select()
    .single();

  if (clientError) {
    console.error('Error creating client:', clientError.message, clientError.details, clientError.code);
    console.error('Client payload:', clientPayload);
    return null;
  }

  if (offers && offers.length > 0) {
    const offersPayload = offers.map(o => ({
      client_id: newClient.id,
      user_id: clientData.user_id,
      name: o.name,
      amount: o.amount,
      max_installments: o.max_installments || 1,
    }));

    const { error: offersError } = await supabase
      .from('offers')
      .insert(offersPayload);

    if (offersError) {
      console.error('Error creating offers:', offersError.message);
    }
  }

  return newClient;
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

export async function getClientOffers(clientId: string): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching client offers:', error.message);
    return [];
  }

  return data ?? [];
}
