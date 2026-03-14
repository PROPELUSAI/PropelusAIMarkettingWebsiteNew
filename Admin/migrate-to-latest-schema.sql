-- =====================================================
-- MIGRATION SCRIPT - Update Existing Database to Latest Schema
-- =====================================================
-- Run this ONCE in Supabase SQL Editor to fix existing tables
-- =====================================================

-- =====================================================
-- 1. FIX USERS TABLE RLS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "allow_service_role_all_users" ON users;
DROP POLICY IF EXISTS "allow_public_select_users" ON users;

-- Create new policies
CREATE POLICY "allow_public_select_users"
ON users
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_service_role_all_users"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Ensure admin user exists
INSERT INTO users (username, password_hash, email)
VALUES ('admin', 'admin123', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- 2. FIX CONTACT_SUBMISSIONS RLS POLICIES
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "allow_public_insert" ON contact_submissions;
DROP POLICY IF EXISTS "allow_public_select" ON contact_submissions;
DROP POLICY IF EXISTS "allow_public_update" ON contact_submissions;
DROP POLICY IF EXISTS "allow_public_delete" ON contact_submissions;
DROP POLICY IF EXISTS "allow_service_role_select" ON contact_submissions;
DROP POLICY IF EXISTS "allow_service_role_update" ON contact_submissions;
DROP POLICY IF EXISTS "allow_service_role_delete" ON contact_submissions;
DROP POLICY IF EXISTS "allow_public_all_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "allow_service_role_all_contact_submissions" ON contact_submissions;

-- Create new policies
CREATE POLICY "allow_public_insert"
ON contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select"
ON contact_submissions
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update"
ON contact_submissions
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete"
ON contact_submissions
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- =====================================================
-- 3. FIX TESTIMONIALS RLS POLICIES
-- =====================================================

-- Drop old policies
DROP POLICY IF EXISTS "allow_public_insert_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_public_select_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_public_update_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_public_delete_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_service_role_select_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_service_role_update_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_service_role_delete_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_public_all_testimonials" ON testimonials;
DROP POLICY IF EXISTS "allow_service_role_all_testimonials" ON testimonials;

-- Create new policies
CREATE POLICY "allow_public_insert_testimonials"
ON testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select_testimonials"
ON testimonials
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update_testimonials"
ON testimonials
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_testimonials"
ON testimonials
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- =====================================================
-- 4. FIX AFFILIATE_REGISTRATIONS TABLE
-- =====================================================

-- Add missing columns
DO $$ 
BEGIN
  -- Add submitted_at column (required by marketing site)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_registrations' 
    AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE affiliate_registrations 
    ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;
  END IF;

  -- Add affiliate_status column (required by admin panel)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_registrations' 
    AND column_name = 'affiliate_status'
  ) THEN
    ALTER TABLE affiliate_registrations 
    ADD COLUMN affiliate_status TEXT DEFAULT 'pending';
  END IF;

  -- Add lead_status column (required by admin panel)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_registrations' 
    AND column_name = 'lead_status'
  ) THEN
    ALTER TABLE affiliate_registrations 
    ADD COLUMN lead_status TEXT DEFAULT 'open';
  END IF;

  -- Add last_contacted_at column (required by admin panel)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'affiliate_registrations' 
    AND column_name = 'last_contacted_at'
  ) THEN
    ALTER TABLE affiliate_registrations 
    ADD COLUMN last_contacted_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Make mobile_number optional
ALTER TABLE affiliate_registrations 
ALTER COLUMN mobile_number DROP NOT NULL;

-- Drop old constraints
ALTER TABLE affiliate_registrations 
DROP CONSTRAINT IF EXISTS affiliate_registrations_status_check,
DROP CONSTRAINT IF EXISTS affiliate_registrations_affiliate_status_check,
DROP CONSTRAINT IF EXISTS affiliate_registrations_lead_status_check,
DROP CONSTRAINT IF EXISTS affiliate_registrations_priority_check;

-- Add updated constraints
ALTER TABLE affiliate_registrations 
ADD CONSTRAINT affiliate_registrations_status_check 
  CHECK (status IN ('pending', 'approved', 'denied')),
ADD CONSTRAINT affiliate_registrations_affiliate_status_check 
  CHECK (affiliate_status IN ('pending', 'approved', 'rejected', 'active', 'inactive', 'suspended')),
ADD CONSTRAINT affiliate_registrations_lead_status_check 
  CHECK (lead_status IN ('open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam')),
ADD CONSTRAINT affiliate_registrations_priority_check 
  CHECK (priority IN ('high', 'medium', 'low'));

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_submitted_at 
  ON affiliate_registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_affiliate_status 
  ON affiliate_registrations(affiliate_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_lead_status 
  ON affiliate_registrations(lead_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_last_contacted_at 
  ON affiliate_registrations(last_contacted_at);

-- Drop old RLS policies
DROP POLICY IF EXISTS "allow_public_insert_affiliates" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_public_insert_affiliate_registrations" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_public_select_affiliate_registrations" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_public_update_affiliate_registrations" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_public_delete_affiliate_registrations" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_service_role_select_affiliates" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_service_role_update_affiliates" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_service_role_delete_affiliates" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_public_all_affiliate_registrations" ON affiliate_registrations;
DROP POLICY IF EXISTS "allow_service_role_all_affiliate_registrations" ON affiliate_registrations;

-- Create new RLS policies
CREATE POLICY "allow_public_insert_affiliate_registrations"
ON affiliate_registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select_affiliate_registrations"
ON affiliate_registrations
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update_affiliate_registrations"
ON affiliate_registrations
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_affiliate_registrations"
ON affiliate_registrations
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- =====================================================
-- 5. VERIFICATION
-- =====================================================

-- Check all tables exist
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE tablename IN ('contact_submissions', 'testimonials', 'users', 'affiliate_registrations')
ORDER BY tablename;

-- Check affiliate_registrations columns
SELECT 
  'affiliate_registrations columns:' as info,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'affiliate_registrations'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  'RLS Policies:' as info,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename IN ('users', 'contact_submissions', 'testimonials', 'affiliate_registrations')
ORDER BY tablename, policyname;

-- Count records
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'contact_submissions' as table_name, COUNT(*) as count FROM contact_submissions
UNION ALL
SELECT 'testimonials' as table_name, COUNT(*) as count FROM testimonials
UNION ALL
SELECT 'affiliate_registrations' as table_name, COUNT(*) as count FROM affiliate_registrations;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ Migration complete! All tables updated with correct schema and RLS policies.' as status;
