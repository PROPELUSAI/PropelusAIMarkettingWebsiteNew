-- =====================================================
-- Affiliate Code Generation & Lead Attribution Migration
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Part C: Add affiliate_code column to contact_leads (contact_submissions table)
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS affiliate_code TEXT NULL;

-- Create index for better performance on affiliate code lookups
CREATE INDEX IF NOT EXISTS idx_contact_affiliate_code ON contact_submissions(affiliate_code);

-- Optional: Add foreign key constraint for strict linking (uncomment if needed)
-- ALTER TABLE contact_submissions 
-- ADD CONSTRAINT fk_affiliate_code 
-- FOREIGN KEY (affiliate_code) 
-- REFERENCES affiliate_registrations(affiliate_code);

-- =====================================================
-- Affiliate Code Generation Function
-- =====================================================

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
  generated_code :=  name_part || email_part || random_part;
  
  -- Ensure uniqueness by checking existing codes
  WHILE EXISTS (SELECT 1 FROM affiliate_registrations WHERE affiliate_registrations.affiliate_code = generated_code) 
    AND counter < max_attempts LOOP
    
    counter := counter + 1;
    random_part := LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
    generated_code :=  name_part || email_part || random_part;
  END LOOP;
  
  -- If we couldn't find a unique code after max attempts, add timestamp
  IF counter >= max_attempts THEN
    generated_code := generated_code || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
  END IF;
  
  RETURN generated_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Test the function (optional - remove in production)
-- =====================================================
-- SELECT generate_affiliate_code('John Doe', 'john.doe@example.com', '+1-555-0123');
-- SELECT generate_affiliate_code('Jane Smith', 'jane@company.com');

-- =====================================================
-- Verification Queries
-- =====================================================
-- Verify the new column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_submissions' 
AND column_name = 'affiliate_code';

-- Verify the index was created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'contact_submissions' 
AND indexname = 'idx_contact_affiliate_code';

-- Verify the function was created
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'generate_affiliate_code';