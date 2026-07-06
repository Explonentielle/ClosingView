import type { Client } from '@/types';
import { clients as mockClients } from '@/data/mocks';

/**
 * Aggregates stats data into the format expected by Dashboard KPI cards.
 * Uses real stats data from Supabase (with fallback trends if unavailable)
 */
export function aggregateStatsData(stats: any[], range: '7j' | '30j' | '3m' | '1a' = '30j') {
  if (!stats || stats.length === 0) {
    return {
      cash: '0€',
      closes: 0,
      taux: '0%',
      commissions: '0€',
      cashTrend: 0,
      closingTrend: 0,
    };
  }

  // Calculate aggregates from real stats
  const cash = stats.reduce((sum, s) => sum + (parseInt(s.cash.toString()) || 0), 0);
  const closes = stats.reduce((sum, s) => sum + s.closes, 0);
  const avgTaux = Math.round(
    stats.reduce((sum, s) => {
      const taux = parseInt(s.taux.toString());
      return sum + (isNaN(taux) ? 0 : taux);
    }, 0) / stats.length
  );
  const commissions = stats.reduce((sum, s) => sum + (parseInt(s.commissions.toString()) || 0), 0);

  return {
    cash: `${cash.toLocaleString('fr-FR')}€`,
    closes,
    taux: `${avgTaux}%`,
    commissions: `${commissions.toLocaleString('fr-FR')}€`,
    cashTrend: stats[0]?.cashTrend ?? 0,
    closingTrend: stats[0]?.closingTrend ?? 0,
  };
}

/**
 * Adapts client data with UI properties (color, initials, etc.)
 */
export function adaptClientData(client: Client) {
  return {
    ...client,
    amount: client.total_amount || 0,
    offers: 0,
  };
}

/**
 * Returns mock clients if no real clients are provided
 */
export function getDefaultClients() {
  return mockClients;
}
