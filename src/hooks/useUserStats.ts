import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getStatsByDateRange } from '@/services';
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

        const data = await getStatsByDateRange(user.id, startDate, endDate);
        setStats(data);
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
