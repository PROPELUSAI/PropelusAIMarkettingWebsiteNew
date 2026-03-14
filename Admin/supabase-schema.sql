-- =====================================================
-- Supabase SQL Schema for Admin Panel
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. USERS TABLE (Custom Authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public to read users (for login authentication)
CREATE POLICY "allow_public_select_users"
ON users
FOR SELECT
TO anon, authenticated, service_role
USING (true);

-- Allow service role to manage users
CREATE POLICY "allow_service_role_all_users"
ON users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert a test admin user (password: admin123)
-- ⚠️ In production, use bcrypt to hash passwords!
INSERT INTO users (username, password_hash, email)
VALUES ('admin', 'admin123', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- 2. CONTACT SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  -- Original fields (user-submitted)
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  mobile_number TEXT,
  
  -- Admin management fields
  lead_status TEXT DEFAULT 'open' NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  assigned_to TEXT,
  admin_notes TEXT,
  response_sent BOOLEAN DEFAULT false NOT NULL,
  response_date TIMESTAMP WITH TIME ZONE,
  response_method TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_by TEXT,
  
  -- Constraints
  CONSTRAINT contact_submissions_lead_status_check 
    CHECK (lead_status IN ('open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam')),
  CONSTRAINT contact_submissions_priority_check 
    CHECK (priority IN ('high', 'medium', 'low')),
  CONSTRAINT contact_submissions_response_method_check 
    CHECK (response_method IS NULL OR response_method IN ('email', 'phone', 'meeting', 'chat', 'other'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_country ON contact_submissions(country);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_lead_status ON contact_submissions(lead_status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_priority ON contact_submissions(priority);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_assigned_to ON contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_follow_up_date ON contact_submissions(follow_up_date);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_response_sent ON contact_submissions(response_sent);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_updated_at ON contact_submissions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_mobile_number ON contact_submissions(mobile_number) WHERE mobile_number IS NOT NULL;

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public full access
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
-- 3. TESTIMONIALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  mobile_number TEXT,
  
  -- Constraints
  CONSTRAINT testimonials_status_check 
    CHECK (status IN ('pending', 'approved', 'denied'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_email ON testimonials(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_mobile_number ON testimonials(mobile_number) WHERE mobile_number IS NOT NULL;

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public full access
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
-- 4. AFFILIATE REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS affiliate_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Basic information (user-submitted)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile_number TEXT,
  description TEXT NOT NULL,
  
  -- Admin management fields (matching admin panel expectations)
  status TEXT DEFAULT 'pending' NOT NULL,
  affiliate_status TEXT DEFAULT 'pending' NOT NULL,
  lead_status TEXT DEFAULT 'open' NOT NULL,
  priority TEXT DEFAULT 'medium' NOT NULL,
  assigned_to TEXT,
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  
  -- Affiliate specific fields
  affiliate_code TEXT UNIQUE,
  commission_rate DECIMAL(5,2),
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT affiliate_registrations_status_check 
    CHECK (status IN ('pending', 'approved', 'denied')),
  CONSTRAINT affiliate_registrations_affiliate_status_check 
    CHECK (affiliate_status IN ('pending', 'approved', 'rejected', 'active', 'inactive', 'suspended')),
  CONSTRAINT affiliate_registrations_lead_status_check 
    CHECK (lead_status IN ('open', 'in_progress', 'contacted', 'qualified', 'converted', 'closed', 'lost', 'spam')),
  CONSTRAINT affiliate_registrations_priority_check 
    CHECK (priority IN ('high', 'medium', 'low'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_status ON affiliate_registrations(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_affiliate_status ON affiliate_registrations(affiliate_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_lead_status ON affiliate_registrations(lead_status);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_created_at ON affiliate_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_submitted_at ON affiliate_registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_email ON affiliate_registrations(email);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_priority ON affiliate_registrations(priority);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_assigned_to ON affiliate_registrations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_affiliate_code ON affiliate_registrations(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_mobile_number ON affiliate_registrations(mobile_number) WHERE mobile_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_updated_at ON affiliate_registrations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_registrations_last_contacted_at ON affiliate_registrations(last_contacted_at);

-- Enable RLS
ALTER TABLE affiliate_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public full access
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
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION validate_email_format()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format: %', NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate email on insert for contacts
CREATE TRIGGER validate_email_before_insert
BEFORE INSERT ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION validate_email_format();

-- Trigger to validate email on insert for testimonials
CREATE TRIGGER validate_testimonial_email_before_insert
BEFORE INSERT ON testimonials
FOR EACH ROW
EXECUTE FUNCTION validate_email_format();

-- Trigger to validate email on insert for affiliates
CREATE TRIGGER validate_affiliate_email_before_insert
BEFORE INSERT ON affiliate_registrations
FOR EACH ROW
EXECUTE FUNCTION validate_email_format();

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update for contacts
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on row update for testimonials
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on row update for users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on row update for affiliates
CREATE TRIGGER update_affiliate_registrations_updated_at
BEFORE UPDATE ON affiliate_registrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample contacts
INSERT INTO contact_submissions (full_name, email, country, scheduled_time, description, lead_status, priority)
VALUES 
  ('John Doe', 'john@example.com', 'USA', now() + interval '1 day', 'Interested in enterprise plan', 'open', 'high'),
  ('Jane Smith', 'jane@example.com', 'UK', now() + interval '2 days', 'Need more information', 'in_progress', 'medium'),
  ('Bob Johnson', 'bob@example.com', 'Canada', now() + interval '3 days', 'Ready to purchase', 'qualified', 'high')
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (full_name, email, testimonial, status)
VALUES 
  ('Alice Brown', 'alice@example.com', 'Great service! Highly recommend.', 'pending'),
  ('Charlie Wilson', 'charlie@example.com', 'Amazing product, exceeded expectations.', 'approved'),
  ('Diana Prince', 'diana@example.com', 'Best decision we made for our business.', 'pending')
ON CONFLICT DO NOTHING;

-- Insert sample affiliates
INSERT INTO affiliate_registrations (full_name, email, mobile_number, description, status, priority)
VALUES 
  ('Mark Thompson', 'mark@techblog.com', '+1-555-0201', 'Tech blogger with 50k monthly visitors interested in promoting AI tools', 'pending', 'high'),
  ('Sarah Martinez', 'sarah@digitalagency.com', '+1-555-0202', 'Digital marketing agency specializing in SaaS products', 'pending', 'medium'),
  ('David Lee', 'david@youtube.com', '+1-555-0203', 'YouTube channel focused on productivity tools with 100k subscribers', 'approved', 'high')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. VERIFICATION QUERY
-- =====================================================
-- Run this to verify all tables are created
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE tablename IN ('contact_submissions', 'testimonials', 'users', 'affiliate_registrations');

-- =====================================================
-- 8. AFFILIATE CODE GENERATION & LEAD ATTRIBUTION
-- =====================================================

-- Add affiliate_code column to contact_submissions for lead attribution
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS affiliate_code TEXT NULL;

-- Create index for better performance on affiliate code lookups
CREATE INDEX IF NOT EXISTS idx_contact_affiliate_code ON contact_submissions(affiliate_code);

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code(
  p_full_name TEXT,
  p_email TEXT,
  p_mobile_number TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  name_part TEXT;
  email_part TEXT;
  random_part TEXT;
  generated_code TEXT;
  counter INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Extract first name (up to first space, max 4 chars)
  name_part := UPPER(LEFT(SPLIT_PART(p_full_name, ' ', 1), 4));
  
  -- Extract email username part (before @, max 3 chars)
  email_part := UPPER(LEFT(SPLIT_PART(p_email, '@', 1), 3));
  
  -- Generate random 4-digit number
  random_part := LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
  
  -- Construct initial affiliate code: AFFNAMEEMAILRANDOM
  generated_code := 'AFF' || name_part || email_part || random_part;
  
  -- Ensure uniqueness by checking existing codes
  WHILE EXISTS (SELECT 1 FROM affiliate_registrations WHERE affiliate_registrations.affiliate_code = generated_code) 
    AND counter < max_attempts LOOP
    
    counter := counter + 1;
    random_part := LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
    generated_code := 'AFF' || name_part || email_part || random_part;
  END LOOP;
  
  -- If we couldn't find a unique code after max attempts, add timestamp
  IF counter >= max_attempts THEN
    generated_code := generated_code || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
  END IF;
  
  RETURN generated_code;
END;
$$ LANGUAGE plpgsql;
