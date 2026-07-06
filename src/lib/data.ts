// Fallback to mocks when real data is unavailable (development mode)
import type { Stat, Client } from '@/types';
import { statsData as mockStatsData, closingRateData as mockClosingRateData, commissionsData as mockCommissionsData, clients as mockClients } from '@/data/mocks';

/**
 * Aggregates stats data into the format expected by Dashboard KPI cards.
 * Falls back to mock data if real stats are not available.
 */
export function aggregateStatsData(stats: Stat[], range: '7j' | '30j' | '3m' | '1a' = '30j') {
  if (!stats || stats.length === 0) {
    return mockStatsData[range];
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
    cashTrend: stats[0]?.cashTrend ?? mockStatsData[range].cashTrend,
    closingTrend: stats[0]?.closingTrend ?? mockStatsData[range].closingTrend,
  };
}

/**
 * Returns chart data, falling back to mocks if unavailable
 */
export function getChartData(statsCount: number) {
  return statsCount > 0 ? 'real' : 'mock';
}

export const defaultChartData = {
  closingRate: mockClosingRateData,
  commissions: mockCommissionsData,
};

/**
 * Adapts client data with UI properties (color, initials, etc.)
 */
export function adaptClientData(client: Client & { color?: string; initials?: string; amount?: number; offers?: number }) {
  const initials =
    client.initials ||
    client.name
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '??';

  const COLORS = ['#0EFF9C', '#EFB027', '#3B82F6', '#9B7FE8', '#F87171'];
  const color = client.color || COLORS[Math.abs(client.id.charCodeAt(0)) % COLORS.length];

  return {
    ...client,
    initials,
    color,
    amount: client.amount || 0,
    offers: client.offers || 0,
  };
}

/**
 * Returns mock clients if no real clients are provided
 */
export function getDefaultClients() {
  return mockClients;
}
