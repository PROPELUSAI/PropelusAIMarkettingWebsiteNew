-- =====================================================
-- Test Affiliate Status Update Functionality
-- =====================================================
-- Run this to test that status updates are working correctly
-- =====================================================

-- Check current affiliate records and their status fields
SELECT 
  id,
  full_name,
  email,
  status,
  affiliate_status,
  lead_status,
  priority,
  updated_at
FROM affiliate_registrations 
ORDER BY created_at DESC 
LIMIT 5;

-- Test updating a status (replace 'your-affiliate-id' with actual ID)
-- UPDATE affiliate_registrations 
-- SET status = 'approved', updated_at = now()
-- WHERE id = 'your-affiliate-id';

-- Verify the update worked
-- SELECT 
--   id,
--   full_name,
--   status,
--   affiliate_status,
--   updated_at
-- FROM affiliate_registrations 
-- WHERE id = 'your-affiliate-id';