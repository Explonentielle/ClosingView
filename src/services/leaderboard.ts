import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardRow {
  id: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  city: string | null;
  close_score: number;
  streak: number;
  assiduite: number;
  leaderboard_score: number;
}

export type LeaderboardPeriod = '7d' | '30d' | 'all';

// Wraps the get_leaderboard() RPC (close_score 70% + assiduité 30%) — the
// single source of truth for "who ranks where", shared by every leaderboard
// widget instead of each one sorting `profiles` its own way.
export async function getLeaderboard(period: LeaderboardPeriod = 'all'): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase.rpc('get_leaderboard', { period });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return (data ?? []) as LeaderboardRow[];
}
