// Business domain types

export interface Client {
  id: string;
  user_id: string;
  name: string;
  niche: string;
  types: string[];
  offers: Offer[];
  created_at: string;
  updated_at?: string;
}

export interface Offer {
  name: string;
  amount: number;
  split: number;
}

export interface Stat {
  id: string;
  user_id: string;
  date: string;
  cash: number;
  closes: number;
  taux: number;
  commissions: number;
  cashTrend?: number;
  closingTrend?: number;
  created_at: string;
}

export interface Objective {
  label: string;
  pct: number;
  display: string;
  color: 'green' | 'yellow' | 'blue';
}

export interface CommissionData {
  name: string;
  value: number;
  source: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}
