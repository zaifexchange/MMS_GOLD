import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  nationality?: string;
  occupation?: string;
  role: 'client' | 'admin';
  kyc_status: 'pending' | 'approved' | 'rejected';
  balance: number;
  referral_code?: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FixedDeposit {
  id: string;
  user_id: string;
  amount: number;
  plan: '3_month' | '6_month' | '1_year';
  interest_rate: number;
  start_date: string;
  maturity_date: string;
  status: 'active' | 'matured' | 'cancelled';
  total_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'trade_profit' | 'trade_loss' | 'referral_commission' | 'fixed_deposit' | 'fixed_deposit_return';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  entry_price?: number;
  exit_price?: number;
  profit_loss: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  level: number;
  commission_rate: number;
  total_commission: number;
  created_at: string;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}