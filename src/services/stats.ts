import { supabase } from '@/integrations/supabase/client';
import type { Stat } from '@/types';

export async function getStats(userId: string): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching stats:', error);
    return [];
  }

  return data ?? [];
}

export async function createStat(stat: Omit<Stat, 'id' | 'created_at'>): Promise<Stat | null> {
  const { data, error } = await supabase
    .from('stats')
    .insert([stat])
    .select()
    .single();

  if (error) {
    console.error('Error creating stat:', error);
    return null;
  }

  return data;
}

export async function getStatsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching stats by date range:', error);
    return [];
  }

  return data ?? [];
}
