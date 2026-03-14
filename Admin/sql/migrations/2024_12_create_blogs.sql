-- ============================================
-- BLOGS MODULE MIGRATION
-- Created: 2024-12-20
-- Description: Complete blog management system with analytics and audit logging
-- RLS: DISABLED (Access control handled at API layer)
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
-- ROW LEVEL SECURITY (DISABLED)
-- ============================================
-- RLS is explicitly disabled for all blog tables
-- Access control is handled at the API/Admin layer

ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_audit_log DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies (cleanup)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop policies on blogs
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blogs') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON blogs', r.policyname);
    END LOOP;
    
    -- Drop policies on blog_analytics
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blog_analytics') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON blog_analytics', r.policyname);
    END LOOP;
    
    -- Drop policies on blog_audit_log
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blog_audit_log') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON blog_audit_log', r.policyname);
    END LOOP;
END $$;

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
    RAISE NOTICE 'RLS Status: DISABLED (all tables)';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
