import { supabase } from '@/integrations/supabase/client';
import { updateProfile } from './profile';
import { ONLINE_WINDOW_MS } from '@/lib/presence';

export async function pingPresence(userId: string): Promise<void> {
  await updateProfile(userId, { is_online: true, last_seen: new Date().toISOString() });
}

export async function clearPresence(userId: string): Promise<void> {
  await updateProfile(userId, { is_online: false });
}

export async function getOnlineCount(): Promise<number> {
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .gte('last_seen', cutoff);

  if (error) {
    console.error('Error fetching online count:', error);
    return 0;
  }

  return count ?? 0;
}

export interface OnlineProfile {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  close_score: number | null;
}

export async function getOnlineProfiles(excludeUserId?: string, limit = 5): Promise<OnlineProfile[]> {
  const cutoff = new Date(Date.now() - ONLINE_WINDOW_MS).toISOString();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, first_name, last_name, close_score')
    .gte('last_seen', cutoff)
    .order('last_seen', { ascending: false })
    .limit(limit + (excludeUserId ? 1 : 0));

  if (error) {
    console.error('Error fetching online profiles:', error);
    return [];
  }

  return (data ?? []).filter((p) => p.id !== excludeUserId).slice(0, limit);
}
