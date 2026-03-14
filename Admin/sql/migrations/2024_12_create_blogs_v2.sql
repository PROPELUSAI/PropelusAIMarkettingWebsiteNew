-- ============================================
-- BLOGS MODULE MIGRATION
-- Created: 2024-12-20
-- Description: Complete blog management system with analytics and audit logging
-- RLS: ENABLED with public access policies
-- ============================================

-- ============================================
-- TABLE: blogs
-- ============================================
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AI', 'Sales', 'SaaS', 'HRTech', 'IT Services', 'Automation')),
  tags TEXT[],
  
  -- Content
  content_raw TEXT NOT NULL,
  content_html TEXT,
  
  -- Media (Optional)
  featured_image TEXT,
  
  -- SEO
  seo_title TEXT,
  meta_description TEXT,
  schema_markup JSONB,
  canonical_url TEXT,
  
  -- CTA Configuration
  cta_type TEXT CHECK (cta_type IN ('Book Demo', 'Contact', 'Affiliate', 'Custom')),
  cta_button_text TEXT,
  cta_link TEXT,
  
  -- Publishing Controls
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'archived')),
  publish_date TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Author & Approval
  author_id UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  cta_clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: blog_analytics
-- ============================================
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'cta_click', 'share')),
  event_data JSONB,
  user_agent TEXT,  
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: blog_audit_log
-- ============================================
CREATE TABLE IF NOT EXISTS blog_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  changed_by UUID,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_publish_date ON blogs(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(is_featured);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_id ON blog_analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_event_type ON blog_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_audit_log_blog_id ON blog_audit_log(blog_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET view_count = view_count + 1
  WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to log blog changes
CREATE OR REPLACE FUNCTION log_blog_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO blog_audit_log (blog_id, action, changed_by, changes)
  VALUES (
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    COALESCE(NEW.author_id, OLD.author_id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to log all blog changes
DROP TRIGGER IF EXISTS log_blog_changes_trigger ON blogs;
CREATE TRIGGER log_blog_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION log_blog_changes();

-- ============================================
-- ROW LEVEL SECURITY (PUBLIC ACCESS)
-- ============================================
-- RLS is enabled with public policies for all operations
-- This matches the pattern used in contact_submissions and testimonials

-- ============================================
-- BLOGS TABLE RLS
-- ============================================
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_blogs"
ON blogs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select_blogs"
ON blogs
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update_blogs"
ON blogs
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_blogs"
ON blogs
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- ============================================
-- BLOG_ANALYTICS TABLE RLS
-- ============================================
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_blog_analytics"
ON blog_analytics
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select_blog_analytics"
ON blog_analytics
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update_blog_analytics"
ON blog_analytics
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_blog_analytics"
ON blog_analytics
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- ============================================
-- BLOG_AUDIT_LOG TABLE RLS
-- ============================================
ALTER TABLE blog_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_blog_audit_log"
ON blog_audit_log
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_public_select_blog_audit_log"
ON blog_audit_log
FOR SELECT
TO anon, authenticated, service_role
USING (true);

CREATE POLICY "allow_public_update_blog_audit_log"
ON blog_audit_log
FOR UPDATE
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_blog_audit_log"
ON blog_audit_log
FOR DELETE
TO anon, authenticated, service_role
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'BLOGS MODULE MIGRATION COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  ✓ blogs';
    RAISE NOTICE '  ✓ blog_analytics';
    RAISE NOTICE '  ✓ blog_audit_log';
    RAISE NOTICE '';
    RAISE NOTICE 'Indexes created: 9';
    RAISE NOTICE 'Functions created: 3';
    RAISE NOTICE 'Triggers created: 2';
    RAISE NOTICE '';
    RAISE NOTICE 'RLS Status: ENABLED with public policies';
    RAISE NOTICE 'Policies per table: 4 (SELECT, INSERT, UPDATE, DELETE)';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
