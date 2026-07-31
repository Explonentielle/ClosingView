import { supabase } from '@/integrations/supabase/client';

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
      startDate: customRange.from,
      endDate: customRange.to,
      startDateStr: customRange.from.toISOString().split('T')[0],
      endDateStr: customRange.to.toISOString().split('T')[0] as string | undefined,
    };
  }
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return {
    startDate,
    endDate,
    startDateStr: startDate.toISOString().split('T')[0],
    endDateStr: undefined as string | undefined,
  };
}

type ChartGranularity = 'day' | 'week' | 'month';

function pickGranularity(spanDays: number): ChartGranularity {
  if (spanDays <= 35) return 'day';
  if (spanDays <= 200) return 'week';
  return 'month';
}

// Anchors a Date at UTC midnight of its LOCAL calendar date. Every bucket
// computation below reads/writes exclusively via UTC-* accessors afterward,
// so cursor dates (built from local "now - N days") and real data dates
// (date-only strings like "2026-07-28", which JS parses as UTC midnight)
// always land on the same key — mixing local and UTC accessors here was the
// bug: it made week/month buckets silently diverge and drop real data.
function toUTCDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

// Canonical start of the bucket a date falls into (the day itself, the
// Monday of its week, or the 1st of its month) — always UTC-midnight-anchored.
function bucketStart(date: Date, granularity: ChartGranularity): Date {
  const d = toUTCDateOnly(date);
  if (granularity === 'month') {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  }
  if (granularity === 'week') {
    const dayOfWeek = (d.getUTCDay() + 6) % 7; // Monday = 0
    d.setUTCDate(d.getUTCDate() - dayOfWeek);
    return d;
  }
  return d;
}

function bucketKey(anchor: Date, granularity: ChartGranularity): string {
  if (granularity === 'month') {
    return `${anchor.getUTCFullYear()}-${anchor.getUTCMonth()}`;
  }
  return anchor.toISOString().split('T')[0];
}

function formatBucketLabel(anchor: Date, granularity: ChartGranularity): string {
  const opts: Intl.DateTimeFormatOptions = { timeZone: 'UTC' };
  if (granularity === 'month') {
    return anchor.toLocaleDateString('fr-FR', { ...opts, month: 'short' });
  }
  return anchor.toLocaleDateString('fr-FR', { ...opts, day: '2-digit', month: 'short' });
}

/**
 * Builds a series spanning the FULL requested date range (bucketed by day,
 * week, or month depending on the span), filling zeros where no real data
 * exists — instead of silently compressing the chart down to only the dates
 * that happen to have entries.
 */
function buildBucketedSeries(
  startDate: Date,
  endDate: Date,
  granularity: ChartGranularity,
  rawByDate: Record<string, number>
): { data: number[]; labels: string[] } {
  const order: string[] = [];
  const totals = new Map<string, number>();
  const bucketDates = new Map<string, Date>();

  const cursor = toUTCDateOnly(startDate);
  const end = toUTCDateOnly(endDate);

  while (cursor <= end) {
    const anchor = bucketStart(cursor, granularity);
    const key = bucketKey(anchor, granularity);
    if (!totals.has(key)) {
      totals.set(key, 0);
      bucketDates.set(key, anchor);
      order.push(key);
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  Object.entries(rawByDate).forEach(([dateStr, value]) => {
    const anchor = bucketStart(new Date(dateStr), granularity);
    const key = bucketKey(anchor, granularity);
    if (totals.has(key)) {
      totals.set(key, (totals.get(key) || 0) + value);
    }
  });

  return {
    data: order.map((k) => totals.get(k) || 0),
    labels: order.map((k) => formatBucketLabel(bucketDates.get(k) as Date, granularity)),
  };
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
  const { startDate, endDate, startDateStr, endDateStr } = resolveDateBounds(days, customRange);
  const spanDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const granularity = pickGranularity(spanDays);

  let entriesQuery = supabase
    .from('daily_entries')
    .select('entry_date, closes_count')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr)
    .order('entry_date', { ascending: true });
  if (endDateStr) entriesQuery = entriesQuery.lte('entry_date', endDateStr);

  let closesQuery = supabase
    .from('closes')
    .select('close_date, contracted_amount, offers(commission_rate)')
    .eq('user_id', userId)
    .gte('close_date', startDateStr)
    .order('close_date', { ascending: true });
  if (endDateStr) closesQuery = closesQuery.lte('close_date', endDateStr);

  const [{ data: entries, error: entriesError }, { data: closes, error: closesError }] = await Promise.all([
    entriesQuery,
    closesQuery,
  ]);

  if (entriesError) console.error('Error fetching chart entries:', entriesError);
  if (closesError) console.error('Error fetching chart closes:', closesError);

  // Real closes per day
  const closesByDate: Record<string, number> = {};
  entries?.forEach(e => {
    closesByDate[e.entry_date] = (closesByDate[e.entry_date] || 0) + (e.closes_count || 0);
  });

  // Real commissions per day (contracted_amount * the linked offer's commission_rate,
  // falling back to DEFAULT_COMMISSION_RATE for closes without an offer)
  const commissionsByDate: Record<string, number> = {};
  closes?.forEach(c => {
    if (!c.close_date) return;
    const rate = Number(c.offers?.commission_rate ?? DEFAULT_COMMISSION_RATE);
    const commission = (Number(c.contracted_amount) || 0) * (rate / 100);
    commissionsByDate[c.close_date] = (commissionsByDate[c.close_date] || 0) + commission;
  });

  const closingRate = buildBucketedSeries(startDate, endDate, granularity, closesByDate);
  const commissions = buildBucketedSeries(startDate, endDate, granularity, commissionsByDate);

  return {
    closingRateData: closingRate.data,
    closingRateLabels: closingRate.labels,
    commissionsData: commissions.data,
    commissionLabels: commissions.labels,
    // Whether any real daily_entries exist in the range — the series above
    // always span the full period (zero-filled), so array length alone can't
    // tell an empty account from one with real data.
    hasData: (entries?.length ?? 0) > 0,
  };
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
