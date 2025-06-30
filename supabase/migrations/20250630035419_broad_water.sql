/*
  # Complete MMS Gold Database Schema

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `fixed_deposits` - Fixed deposit investments with different plans
    - `transactions` - All financial transactions (deposits, withdrawals, trades, commissions)
    - `referrals` - Referral network tracking
    - `trades` - Gold trading records
    - `kyc_documents` - KYC verification documents
    - `notifications` - User notifications
    - `system_settings` - Platform configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only policies for sensitive operations

  3. Functions
    - Automatic profile creation on signup
    - Referral commission calculation
    - Fixed deposit interest calculation
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'trade_profit', 'trade_loss', 'referral_commission', 'fixed_deposit', 'fixed_deposit_return');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE trade_type AS ENUM ('buy', 'sell');
CREATE TYPE trade_status AS ENUM ('open', 'closed');
CREATE TYPE deposit_plan AS ENUM ('3_month', '6_month', '1_year');
CREATE TYPE deposit_status AS ENUM ('active', 'matured', 'cancelled');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  address text,
  date_of_birth date,
  nationality text,
  occupation text,
  role user_role DEFAULT 'client',
  kyc_status kyc_status DEFAULT 'pending',
  balance decimal(15,2) DEFAULT 0.00,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fixed deposits table
CREATE TABLE IF NOT EXISTS fixed_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(15,2) NOT NULL,
  plan deposit_plan NOT NULL,
  interest_rate decimal(5,2) NOT NULL,
  start_date timestamptz DEFAULT now(),
  maturity_date timestamptz NOT NULL,
  status deposit_status DEFAULT 'active',
  total_earned decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount decimal(15,2) NOT NULL,
  description text NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference_id text UNIQUE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  level integer NOT NULL CHECK (level >= 1 AND level <= 3),
  commission_rate decimal(5,2) NOT NULL,
  total_commission decimal(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pair text DEFAULT 'XAU/USD',
  type trade_type NOT NULL,
  amount decimal(15,2) NOT NULL,
  entry_price decimal(10,4),
  exit_price decimal(10,4),
  profit_loss decimal(15,2) DEFAULT 0.00,
  status trade_status DEFAULT 'open',
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- KYC documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  status kyc_status DEFAULT 'pending',
  uploaded_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  notes text
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Fixed deposits policies
CREATE POLICY "Users can read own fixed deposits"
  ON fixed_deposits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own fixed deposits"
  ON fixed_deposits
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all fixed deposits"
  ON fixed_deposits
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Referrals policies
CREATE POLICY "Users can read own referrals"
  ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "System can create referrals"
  ON referrals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trades policies
CREATE POLICY "Users can read own trades"
  ON trades
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own trades"
  ON trades
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own trades"
  ON trades
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- KYC documents policies
CREATE POLICY "Users can read own KYC documents"
  ON kyc_documents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload own KYC documents"
  ON kyc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all KYC documents"
  ON kyc_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- System settings policies (admin only)
CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'REF' || UPPER(SUBSTRING(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to calculate referral commissions
CREATE OR REPLACE FUNCTION calculate_referral_commission(
  user_id uuid,
  amount decimal
)
RETURNS void AS $$
DECLARE
  referrer_record RECORD;
  commission_amount decimal;
  level_rates decimal[] := ARRAY[0.10, 0.03, 0.02]; -- 10%, 3%, 2%
  current_level integer := 1;
  current_user uuid := user_id;
BEGIN
  WHILE current_level <= 3 AND current_user IS NOT NULL LOOP
    SELECT referred_by INTO current_user
    FROM profiles
    WHERE id = current_user;
    
    IF current_user IS NOT NULL THEN
      commission_amount := amount * level_rates[current_level];
      
      -- Update referrer balance
      UPDATE profiles
      SET balance = balance + commission_amount
      WHERE id = current_user;
      
      -- Create transaction record
      INSERT INTO transactions (user_id, type, amount, description, status, reference_id)
      VALUES (
        current_user,
        'referral_commission',
        commission_amount,
        'Level ' || current_level || ' referral commission',
        'completed',
        'REF-' || EXTRACT(epoch FROM now())::text
      );
      
      -- Update referral record
      UPDATE referrals
      SET total_commission = total_commission + commission_amount
      WHERE referrer_id = current_user
      AND referred_id IN (
        SELECT id FROM profiles WHERE referred_by = current_user
      );
      
      current_level := current_level + 1;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process fixed deposit returns
CREATE OR REPLACE FUNCTION process_fixed_deposit_returns()
RETURNS void AS $$
DECLARE
  deposit_record RECORD;
  monthly_return decimal;
BEGIN
  FOR deposit_record IN
    SELECT * FROM fixed_deposits
    WHERE status = 'active'
    AND start_date <= now() - INTERVAL '1 month'
  LOOP
    monthly_return := deposit_record.amount * (deposit_record.interest_rate / 100);
    
    -- Update user balance
    UPDATE profiles
    SET balance = balance + monthly_return
    WHERE id = deposit_record.user_id;
    
    -- Create transaction record
    INSERT INTO transactions (user_id, type, amount, description, status, reference_id)
    VALUES (
      deposit_record.user_id,
      'fixed_deposit_return',
      monthly_return,
      'Fixed deposit monthly return - ' || deposit_record.plan,
      'completed',
      'FDR-' || deposit_record.id::text
    );
    
    -- Update total earned
    UPDATE fixed_deposits
    SET total_earned = total_earned + monthly_return
    WHERE id = deposit_record.id;
    
    -- Check if deposit has matured
    IF deposit_record.maturity_date <= now() THEN
      UPDATE fixed_deposits
      SET status = 'matured'
      WHERE id = deposit_record.id;
      
      -- Return principal amount
      UPDATE profiles
      SET balance = balance + deposit_record.amount
      WHERE id = deposit_record.user_id;
      
      INSERT INTO transactions (user_id, type, amount, description, status, reference_id)
      VALUES (
        deposit_record.user_id,
        'fixed_deposit',
        deposit_record.amount,
        'Fixed deposit maturity return - ' || deposit_record.plan,
        'completed',
        'FDM-' || deposit_record.id::text
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('fixed_deposit_rates', '{"3_month": 6, "6_month": 8, "1_year": 10}', 'Fixed deposit interest rates'),
('referral_rates', '{"level_1": 10, "level_2": 3, "level_3": 2}', 'Referral commission rates'),
('trading_enabled', 'true', 'Enable/disable trading functionality'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_id ON fixed_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_status ON fixed_deposits(status);
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);