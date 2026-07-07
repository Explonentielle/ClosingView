import { supabase } from '@/integrations/supabase/client';
import type { Stat } from '@/types';

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

export async function getClosingRates(userId: string, days: number = 30): Promise<ClosingRates> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: entries, error: entriesError } = await supabase
    .from('daily_entries')
    .select('r1_done, r2_done, closes_count')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);

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

export async function getClosingMetrics(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: closes, error } = await supabase
    .from('closes')
    .select('contracted_amount, collected_amount')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);

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

export async function getChartData(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  console.log('Fetching chart data for user:', userId, 'from', startDateStr);

  const { data: entries, error } = await supabase
    .from('daily_entries')
    .select('entry_date, closes_count')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr)
    .order('entry_date', { ascending: true });

  if (error) {
    console.error('Error fetching chart data:', error);
    return { closingRateData: [], commissionsData: [] };
  }

  console.log('Chart entries:', entries);

  const closingRateData = entries?.map(e => e.closes_count || 0) || [];
  const commissionsData = entries?.map(e => (e.closes_count || 0) * 1500) || [];

  console.log('Chart data:', { closingRateData, commissionsData });

  return { closingRateData, commissionsData };
}

export async function getDashboardStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  // Fetch daily entries
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('closes_count, r1_done, r2_done')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);

  // Fetch closes for cash
  const { data: closes } = await supabase
    .from('closes')
    .select('contracted_amount')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);

  const entriesArr = entries || [];
  const closesArr = closes || [];

  const totalCloses = entriesArr.reduce((sum, e) => sum + (e.closes_count || 0), 0);
  const totalRdvs = entriesArr.reduce((sum, e) => sum + ((e.r1_done || 0) + (e.r2_done || 0)), 0);
  const totalCash = closesArr.reduce((sum, c) => sum + (Number(c.contracted_amount) || 0), 0);
  const commissions = Math.round(totalCash * 0.20);

  return {
    closes: totalCloses,
    taux: totalRdvs > 0 ? Math.round((totalCloses / totalRdvs) * 100) : 0,
    cash: totalCash,
    commissions,
    cashTrend: 0,
    closingTrend: 0,
  };
}

export async function getSummaryStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: entries } = await supabase
    .from('daily_entries')
    .select('closes_count, r1_done, r2_done, r1_planned')
    .eq('user_id', userId)
    .gte('entry_date', startDateStr);

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

export async function getFullPayRatio(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data: closes } = await supabase
    .from('closes')
    .select('contracted_amount, collected_amount')
    .eq('user_id', userId)
    .gte('close_date', startDateStr);

  const closesArr = closes || [];
  if (closesArr.length === 0) return 0;

  const fullPay = closesArr.filter(c => {
    const contracted = Number(c.contracted_amount) || 0;
    const collected = Number(c.collected_amount) || 0;
    return contracted > 0 && Math.abs(contracted - collected) < 1; // Allow 1€ difference for rounding
  }).length;

  return Math.round((fullPay / closesArr.length) * 100);
}
