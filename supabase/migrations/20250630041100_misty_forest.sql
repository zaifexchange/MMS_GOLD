/*
  # Create Demo Users

  1. Demo Users
    - Create admin and demo user accounts
    - Set up proper roles and initial data
  
  2. Security
    - Ensure demo accounts have proper permissions
    - Set up initial balances and referral codes
*/

-- Insert demo admin user (this will be handled by the trigger)
-- The actual user creation happens through Supabase Auth, but we can prepare the profile

-- Insert demo profiles (these will be created when users sign up through the app)
-- We'll create some sample data for testing

-- Insert sample system data for demo purposes
INSERT INTO system_settings (key, value, description) VALUES
('demo_mode', 'true', 'Enable demo mode with sample data'),
('gold_price', '2045.32', 'Current gold price for demo'),
('platform_fee', '0.1', 'Platform trading fee percentage')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Create a function to set up demo user data
CREATE OR REPLACE FUNCTION setup_demo_user(user_email text, user_role user_role DEFAULT 'client')
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_id FROM profiles WHERE email = user_email;
  
  IF user_id IS NOT NULL THEN
    -- Update user role and add demo balance
    UPDATE profiles 
    SET 
      role = user_role,
      balance = CASE WHEN user_role = 'admin' THEN 100000.00 ELSE 25000.00 END,
      kyc_status = 'approved',
      phone = '+1 (555) 123-4567',
      address = '123 Demo Street, Demo City, DC 12345',
      nationality = 'United States',
      occupation = CASE WHEN user_role = 'admin' THEN 'Administrator' ELSE 'Trader' END
    WHERE id = user_id;
    
    -- Add some demo transactions for client users
    IF user_role = 'client' THEN
      INSERT INTO transactions (user_id, type, amount, description, status, reference_id) VALUES
      (user_id, 'deposit', 25000.00, 'Initial demo deposit', 'completed', 'DEMO-DEP-001'),
      (user_id, 'trade_profit', 1250.50, 'XAU/USD Trade Profit', 'completed', 'DEMO-TRD-001'),
      (user_id, 'trade_loss', -450.25, 'XAU/USD Trade Loss', 'completed', 'DEMO-TRD-002'),
      (user_id, 'referral_commission', 125.00, 'Level 1 Referral Commission', 'completed', 'DEMO-REF-001');
      
      -- Add some demo trades
      INSERT INTO trades (user_id, pair, type, amount, entry_price, exit_price, profit_loss, status, closed_at) VALUES
      (user_id, 'XAU/USD', 'buy', 2500.00, 2040.50, 2055.75, 1250.50, 'closed', now() - INTERVAL '2 hours'),
      (user_id, 'XAU/USD', 'sell', 1800.00, 2048.20, 2035.10, -450.25, 'closed', now() - INTERVAL '1 hour'),
      (user_id, 'XAU/USD', 'buy', 3200.00, 2045.32, NULL, 0.00, 'open', now() - INTERVAL '30 minutes');
      
      -- Add a demo fixed deposit
      INSERT INTO fixed_deposits (user_id, amount, plan, interest_rate, maturity_date) VALUES
      (user_id, 10000.00, '6_month', 8.00, now() + INTERVAL '6 months');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;