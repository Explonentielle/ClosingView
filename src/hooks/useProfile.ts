import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getProfile } from '@/services';
import type { UserProfile } from '@/types';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch profile';
        setError(message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}
