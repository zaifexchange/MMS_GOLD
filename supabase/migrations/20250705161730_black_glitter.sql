/*
  # Admin Dashboard Enhancement

  1. New Tables
    - Enhanced system_settings for website content management
    - Add admin activity logs
    - Add website analytics tracking

  2. Security
    - Enhanced admin policies
    - Add audit trail functionality

  3. Functions
    - Website content management functions
    - Admin activity logging
*/

-- Create admin activity logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create website analytics table
CREATE TABLE IF NOT EXISTS website_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  visitor_id text,
  session_id text,
  referrer text,
  user_agent text,
  ip_address inet,
  country text,
  device_type text,
  browser text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_analytics ENABLE ROW LEVEL SECURITY;

-- Admin logs policies (admin only)
CREATE POLICY "Admins can read all admin logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create admin logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Website analytics policies (admin only)
CREATE POLICY "Admins can read website analytics"
  ON website_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type text,
  target_type text DEFAULT NULL,
  target_id text DEFAULT NULL,
  details jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), action_type, target_type, target_id, details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get website statistics
CREATE OR REPLACE FUNCTION get_website_stats(days_back integer DEFAULT 30)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_visits', (
      SELECT COUNT(*) FROM website_analytics 
      WHERE created_at >= now() - (days_back || ' days')::interval
    ),
    'unique_visitors', (
      SELECT COUNT(DISTINCT visitor_id) FROM website_analytics 
      WHERE created_at >= now() - (days_back || ' days')::interval
    ),
    'top_pages', (
      SELECT jsonb_agg(jsonb_build_object('page', page_path, 'visits', visit_count))
      FROM (
        SELECT page_path, COUNT(*) as visit_count
        FROM website_analytics 
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY page_path
        ORDER BY visit_count DESC
        LIMIT 10
      ) top_pages
    ),
    'daily_visits', (
      SELECT jsonb_agg(jsonb_build_object('date', visit_date, 'visits', visit_count))
      FROM (
        SELECT DATE(created_at) as visit_date, COUNT(*) as visit_count
        FROM website_analytics 
        WHERE created_at >= now() - (days_back || ' days')::interval
        GROUP BY DATE(created_at)
        ORDER BY visit_date DESC
      ) daily_stats
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert additional system settings for website content
INSERT INTO system_settings (key, value, description) VALUES
  ('homepage_content', '{"hero_title": "MMS Gold", "hero_subtitle": "Your all-in-all gold trading platform with AI-powered solutions", "hero_description": "Trade gold with institutional-grade tools, real-time data, and advanced analytics."}', 'Homepage content settings'),
  ('about_content', '{"mission": "To democratize gold trading and make it accessible to everyone.", "vision": "To become the world''s leading gold trading platform."}', 'About page content'),
  ('services_content', '{"trading": "Professional gold trading services", "deposits": "Secure fixed deposit options", "ai_trading": "AI-powered trading solutions"}', 'Services page content'),
  ('contact_content', '{"email": "support@mmsgold.com", "phone": "+1 (555) 123-4567", "address": "123 Gold Street, Financial District"}', 'Contact information'),
  ('seo_settings', '{"meta_title": "MMS Gold - Professional Gold Trading Platform", "meta_description": "Trade gold with confidence using our advanced platform", "meta_keywords": "gold trading, forex, investment, XAU/USD"}', 'SEO settings'),
  ('social_media', '{"facebook": "", "twitter": "", "instagram": "", "linkedin": ""}', 'Social media links'),
  ('email_settings', '{"smtp_host": "", "smtp_port": 587, "smtp_user": "", "smtp_password": "", "from_email": "noreply@mmsgold.com"}', 'Email configuration'),
  ('notification_settings', '{"email_notifications": true, "sms_notifications": false, "push_notifications": true}', 'Notification preferences')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_website_analytics_created_at ON website_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_website_analytics_page_path ON website_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_website_analytics_visitor_id ON website_analytics(visitor_id);

-- Function to clean old analytics data (keep only last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM website_analytics 
  WHERE created_at < now() - INTERVAL '90 days';
  
  DELETE FROM admin_logs 
  WHERE created_at < now() - INTERVAL '365 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;