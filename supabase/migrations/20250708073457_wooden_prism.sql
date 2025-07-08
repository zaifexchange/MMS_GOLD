/*
  # Fix Prediction System

  1. Ensure prediction tables exist with proper structure
  2. Add default prediction questions
  3. Fix any missing indexes or constraints
*/

-- Ensure prediction_questions table exists
CREATE TABLE IF NOT EXISTS prediction_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  description text NOT NULL,
  deadline timestamptz NOT NULL,
  multiplier decimal(3,1) DEFAULT 1.9,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved')),
  correct_answer boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure user_predictions table exists
CREATE TABLE IF NOT EXISTS user_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES prediction_questions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prediction boolean NOT NULL,
  amount decimal(15,2) NOT NULL,
  potential_payout decimal(15,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(question_id, user_id)
);

-- Enable RLS if not already enabled
ALTER TABLE prediction_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Anyone can read active prediction questions" ON prediction_questions;
DROP POLICY IF EXISTS "Admins can manage prediction questions" ON prediction_questions;
DROP POLICY IF EXISTS "Users can read own predictions" ON user_predictions;
DROP POLICY IF EXISTS "Users can create own predictions" ON user_predictions;
DROP POLICY IF EXISTS "Admins can read all predictions" ON user_predictions;
DROP POLICY IF EXISTS "Admins can update predictions" ON user_predictions;

-- Recreate policies
CREATE POLICY "Anyone can read active prediction questions"
  ON prediction_questions
  FOR SELECT
  TO authenticated
  USING (status = 'active' OR status = 'closed');

CREATE POLICY "Admins can manage prediction questions"
  ON prediction_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can read own predictions"
  ON user_predictions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own predictions"
  ON user_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all predictions"
  ON user_predictions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update predictions"
  ON user_predictions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prediction_questions_status ON prediction_questions(status);
CREATE INDEX IF NOT EXISTS idx_prediction_questions_deadline ON prediction_questions(deadline);
CREATE INDEX IF NOT EXISTS idx_user_predictions_user_id ON user_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_question_id ON user_predictions(question_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_status ON user_predictions(status);

-- Clear existing questions and insert fresh default questions
DELETE FROM prediction_questions;

-- Insert default prediction questions
INSERT INTO prediction_questions (question, description, deadline, multiplier, status) VALUES
  (
    'Will the price of gold exceed $2,100 per ounce by the end of this week?',
    'Gold has been showing strong momentum. Technical indicators suggest a potential breakout above key resistance levels.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices drop below $2,000 per ounce within the next month?',
    'Economic indicators and Fed policy decisions could impact gold prices significantly in the coming weeks.',
    now() + INTERVAL '30 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold reach $2,200 per ounce before the next FOMC meeting?',
    'Federal Open Market Committee decisions heavily influence precious metals markets and investor sentiment.',
    now() + INTERVAL '14 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices rise by more than 5% this month?',
    'Current market conditions and geopolitical tensions could drive significant gold price movements.',
    now() + INTERVAL '20 days',
    1.9,
    'active'
  ),
  (
    'Will the gold-to-silver ratio exceed 80:1 within two weeks?',
    'The gold-to-silver ratio is a key indicator watched by precious metals traders worldwide.',
    now() + INTERVAL '14 days',
    1.9,
    'active'
  ),
  (
    'Will gold close above $2,050 for five consecutive trading days?',
    'Sustained price levels above key psychological levels often indicate strong market sentiment.',
    now() + INTERVAL '10 days',
    1.9,
    'active'
  ),
  (
    'Will the US Dollar Index (DXY) fall below 100 this month?',
    'Dollar strength has an inverse relationship with gold prices. A weaker dollar typically supports higher gold prices.',
    now() + INTERVAL '25 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices experience a daily move of more than 3% this week?',
    'High volatility events can create significant trading opportunities in the gold market.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  );

-- Add prediction system settings if they don't exist
INSERT INTO system_settings (key, value, description) VALUES
  ('prediction_enabled', 'true', 'Enable/disable prediction system'),
  ('prediction_min_amount', '10', 'Minimum prediction amount'),
  ('prediction_max_amount', '10000', 'Maximum prediction amount'),
  ('prediction_default_multiplier', '1.9', 'Default payout multiplier'),
  ('prediction_auto_resolve', 'false', 'Auto-resolve predictions based on price feeds')
ON CONFLICT (key) DO NOTHING;