// Business domain types

export interface Client {
  id: string;
  user_id: string;
  name: string;
  niche: string;
  type: string[];
  initials: string;
  color: string;
  total_amount: number;
  created_at: string;
}

export interface Offer {
  id: string;
  client_id: string;
  user_id: string;
  name: string;
  amount: number;
  max_installments: number;
  commission_rate: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  region?: string;
  experience_years?: number;
  close_score?: number;
  is_premium?: boolean;
  premium_until?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  display_name?: string | null;
  niche?: string;
  streak?: number;
  is_online?: boolean;
  last_seen?: string | null;
  onboarding_done?: boolean;
  target_cash_monthly?: number;
  target_closes_monthly?: number;
  created_at: string;
  updated_at?: string;
}
