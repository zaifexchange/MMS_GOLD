/*
  # Fix infinite recursion in profiles RLS policies

  1. Problem
    - The "Admins can read all profiles" policy has infinite recursion
    - It references the profiles table within the policy condition
    - This causes the policy to recursively check itself

  2. Solution
    - Drop the problematic policy
    - Create a new policy that doesn't reference profiles table within itself
    - Use a simpler approach for admin access
    - Keep user policies simple and direct

  3. Changes
    - Remove recursive admin policy
    - Add simple admin policy using auth metadata or direct role check
    - Ensure user policies remain clean
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create a new admin policy that doesn't cause recursion
-- This policy allows users with admin role to read all profiles
-- but avoids the recursive reference to profiles table
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Check if current user has admin role by checking auth.jwt() claims
    -- or use a direct approach without subquery to profiles
    (auth.jwt() ->> 'user_role' = 'admin') OR
    -- Fallback: allow if user is reading their own profile
    (auth.uid() = id)
  );

-- Ensure the user policies are clean and don't cause recursion
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);