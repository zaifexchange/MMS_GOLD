/*
  # Create Admin Account

  1. Admin Account Creation
    - Create admin user with specified credentials
    - Set up proper admin role and permissions
    - Generate referral code and initial data

  2. Security
    - Ensure admin has proper access
    - Set up initial admin settings
*/

-- Create admin profile directly (this will work with Supabase Auth)
-- Note: The actual auth user creation should be done through Supabase Auth API
-- This migration sets up the profile data for when the user signs up

-- Insert admin user data (will be linked when user signs up with the email)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  kyc_status,
  balance,
  referral_code,
  phone,
  address,
  nationality,
  occupation,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'monirhasan2003@gmail.com',
  'Monir Hasan',
  'admin',
  'approved',
  100000.00,
  'ADMIN001',
  '+1 (555) 123-4567',
  'Admin Office, MMS Gold Headquarters',
  'United States',
  'Platform Administrator',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  kyc_status = 'approved',
  balance = 100000.00,
  referral_code = 'ADMIN001',
  phone = '+1 (555) 123-4567',
  address = 'Admin Office, MMS Gold Headquarters',
  nationality = 'United States',
  occupation = 'Platform Administrator';

-- Create a function to setup admin user after auth signup
CREATE OR REPLACE FUNCTION setup_admin_user()
RETURNS trigger AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'monirhasan2003@gmail.com' THEN
    -- Update the profile to admin role
    UPDATE profiles 
    SET 
      role = 'admin',
      kyc_status = 'approved',
      balance = 100000.00,
      referral_code = 'ADMIN001',
      phone = '+1 (555) 123-4567',
      address = 'Admin Office, MMS Gold Headquarters',
      nationality = 'United States',
      occupation = 'Platform Administrator'
    WHERE id = NEW.id;
    
    -- Log admin account creation
    INSERT INTO admin_logs (admin_id, action, details)
    VALUES (NEW.id, 'admin_account_created', '{"email": "monirhasan2003@gmail.com", "role": "admin"}');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin setup
DROP TRIGGER IF EXISTS setup_admin_on_signup ON profiles;
CREATE TRIGGER setup_admin_on_signup
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION setup_admin_user();

-- Insert admin-specific system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('admin_email', '"monirhasan2003@gmail.com"', 'Primary admin email address'),
  ('admin_setup_complete', 'true', 'Admin account setup status'),
  ('platform_initialized', 'true', 'Platform initialization status'),
  ('admin_dashboard_enabled', 'true', 'Enable admin dashboard access'),
  ('super_admin_permissions', '["user_management", "system_settings", "content_management", "analytics", "security"]', 'Super admin permissions')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Create admin welcome notification
INSERT INTO notifications (
  id,
  user_id,
  title,
  message,
  type,
  read,
  created_at
) SELECT
  gen_random_uuid(),
  p.id,
  'Welcome to MMS Gold Admin Panel',
  'Your administrator account has been successfully created. You now have full access to manage the platform, users, and system settings.',
  'admin',
  false,
  now()
FROM profiles p 
WHERE p.email = 'monirhasan2003@gmail.com'
ON CONFLICT DO NOTHING;

-- Create sample admin activity log
INSERT INTO admin_logs (
  admin_id,
  action,
  target_type,
  details,
  created_at
) SELECT
  p.id,
  'admin_panel_access_granted',
  'system',
  '{"message": "Admin account created and configured", "permissions": ["full_access"], "created_by": "system"}',
  now()
FROM profiles p 
WHERE p.email = 'monirhasan2003@gmail.com';