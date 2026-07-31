import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { pingPresence, clearPresence } from '@/services/presence';
import { HEARTBEAT_MS } from '@/lib/presence';

/**
 * Marks the current user online with a periodic heartbeat, and offline when
 * the tab is hidden/closed or the app unmounts. This is the only code path
 * that ever writes profiles.is_online / last_seen.
 */
export function usePresence() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    pingPresence(user.id);
    const interval = setInterval(() => pingPresence(user.id), HEARTBEAT_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') pingPresence(user.id);
    };
    const handleUnload = () => clearPresence(user.id);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
      clearPresence(user.id);
    };
  }, [user]);
}
