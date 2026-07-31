// How often a connected client pings its own presence.
export const HEARTBEAT_MS = 45_000;

// How long since the last ping before a user is considered offline.
// Kept a bit above HEARTBEAT_MS to tolerate network jitter / tab throttling.
export const ONLINE_WINDOW_MS = 120_000;

export function isUserOnline(p?: { last_seen?: string | null } | null): boolean {
  if (!p?.last_seen) return false;
  return Date.now() - new Date(p.last_seen).getTime() < ONLINE_WINDOW_MS;
}
