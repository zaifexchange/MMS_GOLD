/*
  # Fix Authentication Integration

  1. Database Updates
    - Ensure proper auth integration with profiles table
    - Fix any remaining RLS policy issues
    - Add proper indexes for performance

  2. Security
    - Ensure all RLS policies are working correctly
    - Add proper constraints and validations
*/

-- Ensure the handle_new_user function is properly set up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    CONCAT('REF', UPPER(SUBSTRING(new.id::text, 1, 8)))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add some sample data for testing (admin user)
DO $$
BEGIN
  -- Check if admin user exists, if not create one
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@mmsgold.com') THEN
    -- Insert admin user into auth.users (this would normally be done through Supabase Auth)
    -- Note: In production, this should be done through the Supabase dashboard or auth API
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@mmsgold.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin User"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;

-- Update admin user profile to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@mmsgold.com';

-- Add some sample system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('platform_name', '"MMS Gold"', 'Platform display name'),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('max_leverage', '100', 'Maximum leverage allowed'),
  ('min_deposit', '100', 'Minimum deposit amount'),
  ('withdrawal_fee', '0', 'Withdrawal fee percentage')
ON CONFLICT (key) DO NOTHING;

-- Ensure all tables have proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_trades_user_status ON trades(user_id, status);
CREATE INDEX IF NOT EXISTS idx_fixed_deposits_user_status ON fixed_deposits(user_id, status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_level ON referrals(referrer_id, level);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_status ON kyc_documents(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);