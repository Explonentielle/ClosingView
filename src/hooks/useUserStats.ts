import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Stat } from '@/types';

interface UseUserStatsOptions {
  startDate?: string;
  endDate?: string;
}

export function useUserStats(options?: UseUserStatsOptions) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Default to last 30 days if not specified
        const today = new Date();
        const startDate = options?.startDate || new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
        const endDate = options?.endDate || new Date().toISOString().split('T')[0];

        // Fetch daily entries and calculate stats for each day
        const { data: entries, error: entriesError } = await supabase
          .from('daily_entries')
          .select('entry_date, closes_count')
          .eq('user_id', user.id)
          .gte('entry_date', startDate)
          .lte('entry_date', endDate)
          .order('entry_date', { ascending: true });

        if (entriesError) {
          console.error('Error fetching daily entries:', entriesError);
          setStats([]);
          return;
        }

        // Transform daily entries into stats format
        const calculatedStats: Stat[] = (entries || []).map((entry: any) => ({
          id: `${user.id}-${entry.entry_date}`,
          user_id: user.id,
          date: entry.entry_date,
          cash: 0,
          closes: entry.closes_count || 0,
          taux: 0,
          commissions: 0,
          cashTrend: 0,
          closingTrend: 0,
          created_at: new Date().toISOString(),
        }));

        setStats(calculatedStats);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch stats';
        setError(message);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, options?.startDate, options?.endDate]);

  return { stats, loading, error };
}
