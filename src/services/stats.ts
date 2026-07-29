import { supabase } from '@/integrations/supabase/client';
import type { Stat } from '@/types';

// Fallback commission rate used when a close isn't linked to an offer
// (or the linked offer predates the per-offer commission_rate field).
const DEFAULT_COMMISSION_RATE = 20;

interface DateRangeOverride {
  from: Date;
  to: Date;
}

function resolveDateBounds(days: number, customRange?: DateRangeOverride) {
  if (customRange) {
    return {
      startDateStr: customRange.from.toISOString().split('T')[0],
      endDateStr: customRange.to.toISOString().split('T')[0] as string | undefined,
    };
  }
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDateStr: startDate.toISOString().split('T')[0], endDateStr: undefined as string | undefined };
}

export async function getStats(userId: string): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching stats:', error);
    return [];
  }

  return data ?? [];
}

export async function createStat(stat: Omit<Stat, 'id' | 'created_at'>): Promise<Stat | null> {
  const { data, error } = await supabase
    .from('stats')
    .insert([stat])
    .select()
    .single();

  if (error) {
    console.error('Error creating stat:', error);
    return null;
  }

  return data;
}

export async function getStatsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching stats by date range:', error);
    return [];
  }

  return data ?? [];
}

export interface ClosingRates {
  closing: number;
  noShow: number;
  followUp: number;
}

export async function getClosingRates(userId: string, days: number = 30, clientIds?: string[]): Promise<ClosingRates> {
  if (clientIds && clientIds.length === 0) {
    return { closing: 0, noShow: 0, followUp: 0 };
  }

  const { startDateStr } = resolveDateBounds(days);

  let query = supabase
    .from('daily_entries')
    .select('r1_done, r2_done, closes_count')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);
  if (clientIds) query = query.in('client_id', clientIds);

  const { data: entries, error: entriesError } = await query;

  if (entriesError) {
    console.error('Error fetching daily entries:', entriesError);
    return { closing: 0, noShow: 0, followUp: 0 };
  }

  const totalRdvs = entries?.reduce((sum, e) => sum + (e.r1_done || 0) + (e.r2_done || 0), 0) || 0;
  const totalCloses = entries?.reduce((sum, e) => sum + (e.closes_count || 0), 0) || 0;
  const followUps = entries?.reduce((sum, e) => sum + (e.r2_done || 0), 0) || 0;

  if (totalRdvs === 0) {
    return { closing: 0, noShow: 0, followUp: 0 };
  }

  return {
    closing: Math.round((totalCloses / totalRdvs) * 100),
    noShow: Math.round(((totalRdvs - followUps) / totalRdvs) * 100),
    followUp: Math.round((followUps / totalRdvs) * 100),
  };
}

export async function getClosingMetrics(userId: string, days: number = 30, clientIds?: string[]) {
  if (clientIds && clientIds.length === 0) {
    return { totalContracted: 0, totalCollected: 0, count: 0 };
  }

  const { startDateStr } = resolveDateBounds(days);

  let query = supabase
    .from('closes')
    .select('contracted_amount, collected_amount')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);
  if (clientIds) query = query.in('client_id', clientIds);

  const { data: closes, error } = await query;

  if (error) {
    console.error('Error fetching closes:', error);
    return { totalContracted: 0, totalCollected: 0, count: 0 };
  }

  const totalContracted = closes?.reduce((sum, c) => sum + (Number(c.contracted_amount) || 0), 0) || 0;
  const totalCollected = closes?.reduce((sum, c) => sum + (Number(c.collected_amount) || 0), 0) || 0;

  return {
    totalContracted,
    totalCollected,
    count: closes?.length || 0,
  };
}

export async function getChartData(userId: string, days: number = 30, customRange?: DateRangeOverride) {
  const { startDateStr, endDateStr } = resolveDateBounds(days, customRange);

  let query = supabase
    .from('daily_entries')
    .select('entry_date, closes_count')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr)
    .order('entry_date', { ascending: true });
  if (endDateStr) query = query.lte('entry_date', endDateStr);

  const { data: entries, error } = await query;

  if (error) {
    console.error('Error fetching chart data:', error);
    return { closingRateData: [], commissionsData: [] };
  }

  // Group by date and sum closes_count for duplicate dates
  const byDate: Record<string, number> = {};
  entries?.forEach(e => {
    const date = e.entry_date;
    byDate[date] = (byDate[date] || 0) + (e.closes_count || 0);
  });

  const closingRateData = Object.values(byDate);
  const commissionsData = closingRateData.map(v => v * 1500);

  return { closingRateData, commissionsData };
}

export interface DailyEntryHistoryRow {
  id: string;
  entry_date: string;
  r1_planned: number;
  r1_done: number;
  r2_planned: number;
  r2_done: number;
  closes_count: number;
  clientName: string | null;
}

export async function getDailyEntriesHistory(userId: string, days: number = 30, customRange?: DateRangeOverride): Promise<DailyEntryHistoryRow[]> {
  const { startDateStr, endDateStr } = resolveDateBounds(days, customRange);

  let query = supabase
    .from('daily_entries')
    .select('id, entry_date, r1_planned, r1_done, r2_planned, r2_done, closes_count, clients(name)')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr)
    .order('entry_date', { ascending: false });
  if (endDateStr) query = query.lte('entry_date', endDateStr);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching daily entries history:', error);
    return [];
  }

  return (data ?? []).map((e) => ({
    id: e.id,
    entry_date: e.entry_date,
    r1_planned: e.r1_planned || 0,
    r1_done: e.r1_done || 0,
    r2_planned: e.r2_planned || 0,
    r2_done: e.r2_done || 0,
    closes_count: e.closes_count || 0,
    clientName: e.clients?.name ?? null,
  }));
}

export async function getDashboardStats(userId: string, days: number = 30, customRange?: DateRangeOverride) {
  const { startDateStr, endDateStr } = resolveDateBounds(days, customRange);

  // Fetch daily entries
  let entriesQuery = supabase
    .from('daily_entries')
    .select('closes_count, r1_done, r2_done')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);
  if (endDateStr) entriesQuery = entriesQuery.lte('entry_date', endDateStr);
  const { data: entries } = await entriesQuery;

  // Fetch closes for cash, along with each close's linked offer commission rate
  let closesQuery = supabase
    .from('closes')
    .select('contracted_amount, offers(commission_rate)')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);
  if (endDateStr) closesQuery = closesQuery.lte('close_date', endDateStr);
  const { data: closes } = await closesQuery;

  const entriesArr = entries || [];
  const closesArr = closes || [];

  const totalCloses = entriesArr.reduce((sum, e) => sum + (e.closes_count || 0), 0);
  const totalRdvs = entriesArr.reduce((sum, e) => sum + ((e.r1_done || 0) + (e.r2_done || 0)), 0);
  const totalCash = closesArr.reduce((sum, c) => sum + (Number(c.contracted_amount) || 0), 0);
  const commissions = Math.round(
    closesArr.reduce((sum, c) => {
      const rate = Number(c.offers?.commission_rate ?? DEFAULT_COMMISSION_RATE);
      return sum + (Number(c.contracted_amount) || 0) * (rate / 100);
    }, 0)
  );

  return {
    closes: totalCloses,
    taux: totalRdvs > 0 ? Math.round((totalCloses / totalRdvs) * 100) : 0,
    cash: totalCash,
    commissions,
    cashTrend: 0,
    closingTrend: 0,
  };
}

export async function getSummaryStats(userId: string, days: number = 30, clientIds?: string[]) {
  if (clientIds && clientIds.length === 0) {
    return { closes: 0, r1Done: 0, r2Done: 0, followUp: 0 };
  }

  const { startDateStr } = resolveDateBounds(days);

  let query = supabase
    .from('daily_entries')
    .select('closes_count, r1_done, r2_done, r1_planned')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);
  if (clientIds) query = query.in('client_id', clientIds);

  const { data: entries } = await query;

  const entriesArr = entries || [];

  const totalCloses = entriesArr.reduce((sum, e) => sum + (e.closes_count || 0), 0);
  const totalR1 = entriesArr.reduce((sum, e) => sum + (e.r1_done || 0), 0);
  const totalR2 = entriesArr.reduce((sum, e) => sum + (e.r2_done || 0), 0);
  const totalFollowUp = entriesArr.filter(e => (e.r2_done || 0) > 0).length;

  return {
    closes: totalCloses,
    r1Done: totalR1,
    r2Done: totalR2,
    followUp: totalFollowUp,
  };
}

export async function getFullPayRatio(userId: string, days: number = 30, clientIds?: string[]) {
  if (clientIds && clientIds.length === 0) return 0;

  const { startDateStr } = resolveDateBounds(days);

  let query = supabase
    .from('closes')
    .select('contracted_amount, collected_amount')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);
  if (clientIds) query = query.in('client_id', clientIds);

  const { data: closes } = await query;

  const closesArr = closes || [];
  if (closesArr.length === 0) return 0;

  const fullPay = closesArr.filter(c => {
    const contracted = Number(c.contracted_amount) || 0;
    const collected = Number(c.collected_amount) || 0;
    return contracted > 0 && Math.abs(contracted - collected) < 1; // Allow 1€ difference for rounding
  }).length;

  return Math.round((fullPay / closesArr.length) * 100);
}
