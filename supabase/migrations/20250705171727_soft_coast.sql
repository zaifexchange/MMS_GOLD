/*
  # Create Prediction System Tables

  1. New Tables
    - `prediction_questions` - Store prediction questions
    - `user_predictions` - Store user predictions and outcomes

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
*/

-- Create prediction questions table
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

-- Create user predictions table
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

-- Enable RLS
ALTER TABLE prediction_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_predictions ENABLE ROW LEVEL SECURITY;

-- Prediction questions policies
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

-- User predictions policies
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

-- Function to create prediction tables (for initialization)
CREATE OR REPLACE FUNCTION create_prediction_tables()
RETURNS void AS $$
BEGIN
  -- Tables are already created above, this function is for compatibility
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prediction_questions_status ON prediction_questions(status);
CREATE INDEX IF NOT EXISTS idx_prediction_questions_deadline ON prediction_questions(deadline);
CREATE INDEX IF NOT EXISTS idx_user_predictions_user_id ON user_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_question_id ON user_predictions(question_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_status ON user_predictions(status);

-- Insert default prediction questions
INSERT INTO prediction_questions (question, description, deadline, multiplier, status) VALUES
  (
    'Will the price of gold exceed $3,400 per ounce at 7 PM tomorrow during the NFP report release?',
    'Non-Farm Payroll (NFP) reports often cause significant volatility in gold prices.',
    now() + INTERVAL '1 day',
    1.9,
    'active'
  ),
  (
    'Will the price of gold drop by 5% or more within the next month?',
    'Major corrections in gold prices can present significant opportunities.',
    now() + INTERVAL '30 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold fall below $3,300 per ounce during the next FOMC report?',
    'Federal Open Market Committee decisions heavily influence precious metals.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will the market closing price of gold tomorrow be above $3,500 per ounce?',
    'Daily closing prices are crucial for technical analysis and trend determination.',
    now() + INTERVAL '1 day',
    1.9,
    'active'
  ),
  (
    'Will gold prices rise by more than 3% within the next week following the US CPI data release?',
    'Consumer Price Index data is a key inflation indicator affecting gold prices.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold stay above $3,200 per ounce during the next ECB interest rate announcement?',
    'European Central Bank decisions impact global precious metals markets.',
    now() + INTERVAL '14 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices surpass $3,600 per ounce before the next US Federal Reserve meeting?',
    'Federal Reserve meetings are major market-moving events for precious metals.',
    now() + INTERVAL '21 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold decline by more than 2% on the day of the next US unemployment report?',
    'Employment data releases often trigger immediate market reactions.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices be higher than $3,450 per ounce at the close of the next trading week?',
    'Weekly closing levels are important for medium-term trend analysis.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold drop below $3,150 per ounce during the next OPEC meeting?',
    'Oil market decisions can indirectly affect precious metals through currency impacts.',
    now() + INTERVAL '30 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices increase by more than 4% within the next two weeks after the US GDP report?',
    'Gross Domestic Product data reflects economic health and affects safe-haven demand.',
    now() + INTERVAL '14 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold remain below $3,700 per ounce at the next market close following a US retail sales report?',
    'Retail sales data indicates consumer spending patterns and economic strength.',
    now() + INTERVAL '7 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices exceed $3,500 per ounce during the next Bank of Japan interest rate decision?',
    'Japanese monetary policy affects global currency markets and precious metals.',
    now() + INTERVAL '21 days',
    1.9,
    'active'
  ),
  (
    'Will the price of gold fall by more than 3% within the next 10 days after a US PPI report release?',
    'Producer Price Index data provides early inflation signals affecting precious metals.',
    now() + INTERVAL '10 days',
    1.9,
    'active'
  ),
  (
    'Will gold prices be above $3,300 per ounce at the close of the next trading day after a US housing starts report?',
    'Housing market data reflects economic activity and investment demand patterns.',
    now() + INTERVAL '3 days',
    1.9,
    'active'
  )
ON CONFLICT DO NOTHING;

-- Add prediction system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('prediction_enabled', 'true', 'Enable/disable prediction system'),
  ('prediction_min_amount', '10', 'Minimum prediction amount'),
  ('prediction_max_amount', '10000', 'Maximum prediction amount'),
  ('prediction_default_multiplier', '1.9', 'Default payout multiplier'),
  ('prediction_auto_resolve', 'false', 'Auto-resolve predictions based on price feeds')
ON CONFLICT (key) DO NOTHING;