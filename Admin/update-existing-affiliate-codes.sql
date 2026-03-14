-- =====================================================
-- Update Existing Affiliate Codes to Alphanumeric Format
-- =====================================================
-- This script converts existing affiliate codes from AFF-NAME-EMAIL-RANDOM 
-- format to AFFNAMEEMAILRANDOM format (alphanumeric only)
-- =====================================================

-- Function to convert old format codes to new alphanumeric format
CREATE OR REPLACE FUNCTION convert_affiliate_code_to_alphanumeric(old_code TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Remove all dashes and convert to uppercase
  RETURN UPPER(REPLACE(old_code, '-', ''));
END;
$$ LANGUAGE plpgsql;

-- Update existing affiliate codes in affiliate_registrations table
UPDATE affiliate_registrations 
SET affiliate_code = convert_affiliate_code_to_alphanumeric(affiliate_code)
WHERE affiliate_code IS NOT NULL 
  AND affiliate_code LIKE 'AFF-%';

-- Update existing affiliate codes in contact_submissions table (if any exist)
UPDATE contact_submissions 
SET affiliate_code = convert_affiliate_code_to_alphanumeric(affiliate_code)
WHERE affiliate_code IS NOT NULL 
  AND affiliate_code LIKE 'AFF-%';

-- Verify the updates
SELECT 
  'affiliate_registrations' as table_name,
  COUNT(*) as total_codes,
  COUNT(CASE WHEN affiliate_code LIKE 'AFF%' AND affiliate_code NOT LIKE 'AFF-%' THEN 1 END) as alphanumeric_codes,
  COUNT(CASE WHEN affiliate_code LIKE 'AFF-%' THEN 1 END) as old_format_codes
FROM affiliate_registrations 
WHERE affiliate_code IS NOT NULL

UNION ALL

SELECT 
  'contact_submissions' as table_name,
  COUNT(*) as total_codes,
  COUNT(CASE WHEN affiliate_code LIKE 'AFF%' AND affiliate_code NOT LIKE 'AFF-%' THEN 1 END) as alphanumeric_codes,
  COUNT(CASE WHEN affiliate_code LIKE 'AFF-%' THEN 1 END) as old_format_codes
FROM contact_submissions 
WHERE affiliate_code IS NOT NULL;

-- Show sample of converted codes
SELECT 
  id,
  full_name,
  email,
  affiliate_code,
  'Converted from old format' as status
FROM affiliate_registrations 
WHERE affiliate_code IS NOT NULL 
ORDER BY updated_at DESC 
LIMIT 5;

-- Clean up the temporary function
DROP FUNCTION convert_affiliate_code_to_alphanumeric(TEXT);