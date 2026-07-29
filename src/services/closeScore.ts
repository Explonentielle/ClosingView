import { supabase } from '@/integrations/supabase/client';
import { getClosingRates } from './stats';
import { getProfile, updateProfile } from './profile';

const CYCLE_NORMALIZATION_DAYS = 30;

export const profileLabel = (score: number) =>
  score >= 80 ? "EXCELLENT PROFIL" : score >= 65 ? "BON PROFIL" : score >= 50 ? "PROFIL EN COURS" : "DÉBUTANT";

export interface CloseScoreResult {
  score: number;
  axes: { label: string; v: number }[];
  avgCycleDays: number | null;
}

export async function computeCloseScore(userId: string, days: number = 90, filterClientIds?: string[]): Promise<CloseScoreResult> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  let entriesQuery = supabase.from('daily_entries').select('entry_date').eq('user_id', userId).gte('entry_date', startDateStr);
  let closesQuery = supabase.from('closes').select('close_date, client_id, contracted_amount').eq('user_id', userId).gte('close_date', startDateStr);
  if (filterClientIds) {
    entriesQuery = entriesQuery.in('client_id', filterClientIds);
    closesQuery = closesQuery.in('client_id', filterClientIds);
  }

  const [profile, rates, entriesRes, closesRes] = await Promise.all([
    getProfile(userId),
    getClosingRates(userId, days, filterClientIds),
    filterClientIds && filterClientIds.length === 0 ? Promise.resolve({ data: [] }) : entriesQuery,
    filterClientIds && filterClientIds.length === 0 ? Promise.resolve({ data: [] }) : closesQuery,
  ]);

  const targetCash = profile?.target_cash_monthly ?? 15000;
  const targetCloses = profile?.target_closes_monthly ?? 10;

  const entriesArr = entriesRes.data || [];
  const closesArr = closesRes.data || [];

  const regularite = Math.round((new Set(entriesArr.map((e) => e.entry_date)).size / days) * 100);

  const cashInWindow = closesArr.reduce((sum, c) => sum + (Number(c.contracted_amount) || 0), 0);
  const cashRatio = Math.min(100, (cashInWindow / targetCash) * 100);
  const closesRatio = Math.min(100, (closesArr.length / targetCloses) * 100);
  const cashScore = Math.round(cashRatio);
  const objectifsScore = Math.round((cashRatio + closesRatio) / 2);

  const clientIds = [...new Set(closesArr.map((c) => c.client_id).filter(Boolean) as string[])];
  let avgCycleDays: number | null = null;
  let cycleScore = 0;

  if (clientIds.length > 0) {
    const { data: firstEntries } = await supabase
      .from('daily_entries')
      .select('client_id, entry_date')
      .eq('user_id', userId)
      .in('client_id', clientIds)
      .order('entry_date', { ascending: true });

    const firstEntryByClient: Record<string, string> = {};
    (firstEntries || []).forEach((e) => {
      if (e.client_id && !firstEntryByClient[e.client_id]) {
        firstEntryByClient[e.client_id] = e.entry_date;
      }
    });

    const cycles = closesArr
      .filter((c) => c.client_id && firstEntryByClient[c.client_id] && c.close_date)
      .map((c) => {
        const first = new Date(firstEntryByClient[c.client_id as string]).getTime();
        const close = new Date(c.close_date as string).getTime();
        return Math.max(0, Math.round((close - first) / (1000 * 60 * 60 * 24)));
      });

    if (cycles.length > 0) {
      avgCycleDays = Math.round(cycles.reduce((s, v) => s + v, 0) / cycles.length);
      cycleScore = Math.min(100, Math.max(0, Math.round(100 - (avgCycleDays / CYCLE_NORMALIZATION_DAYS) * 100)));
    }
  }

  const axes = [
    { label: "Closing", v: rates.closing },
    { label: "Cash", v: cashScore },
    { label: "Régularité", v: regularite },
    { label: "Cycle de vente", v: cycleScore },
    { label: "Objectifs", v: objectifsScore },
  ];

  const score = Math.round(axes.reduce((s, a) => s + a.v, 0) / axes.length);

  await updateProfile(userId, { close_score: score });

  return { score, axes, avgCycleDays };
}
