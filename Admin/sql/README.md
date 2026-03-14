# SQL Structure Documentation

## Overview

This directory contains all database schemas for the admin panel, organized in a clean, maintainable structure.

## Directory Structure

```
sql/
├── main.sql                          # Master SQL file (imports all modules)
├── migrations/
│   └── 2024_12_create_blogs.sql     # Blogs module migration
└── README.md                         # This file
```

## Usage

### Running the Complete Schema

To set up the entire database, run the main SQL file:

```bash
# In Supabase SQL Editor or psql
\i sql/main.sql
```

Or copy the contents of `sql/main.sql` and run in Supabase Dashboard → SQL Editor.

### Running Individual Migrations

To run only the blogs migration:

```bash
# In Supabase SQL Editor or psql
\i sql/migrations/2024_12_create_blogs.sql
```

Or copy the contents of `sql/migrations/2024_12_create_blogs.sql` and run in Supabase Dashboard → SQL Editor.

## Blogs Module

### Tables Created

1. **blogs** - Main blog content storage
   - Blog metadata (title, subtitle, slug, category, tags)
   - Content (raw markdown and rendered HTML)
   - Optional featured image
   - SEO metadata (title, description, schema, canonical URL)
   - CTA configuration
   - Publishing controls (status, publish date, featured flag)
   - Author and approval tracking
   - Analytics counters (views, CTA clicks)

2. **blog_analytics** - Detailed event tracking
   - Page views
   - CTA clicks
   - Social shares
   - User agent and IP tracking

3. **blog_audit_log** - Complete change history
   - All CRUD operations
   - Before/after snapshots
   - User attribution

### Indexes

9 indexes created for optimal query performance:
- Status, category, slug lookups
- Publish date sorting
- Featured blog filtering
- Author filtering
- Analytics and audit log queries

### Functions

3 database functions:
- `increment_blog_views()` - Atomic view counter
- `update_updated_at_column()` - Auto-update timestamps
- `log_blog_changes()` - Automatic audit logging

### Triggers

2 triggers:
- Auto-update `updated_at` on blog changes
- Auto-log all blog operations to audit log

### Row Level Security (RLS)

**RLS is DISABLED for all blog tables.**

Access control is handled at the API/Admin layer, not at the database level.

This design choice was made because:
- All blog operations are admin-only
- Simplifies development and debugging
- Reduces policy complexity
- Improves performance

For production, you can optionally re-enable RLS with appropriate policies.

## Adding New Modules

To add a new module:

1. Create a new migration file in `sql/migrations/`
   - Use naming convention: `YYYY_MM_description.sql`
   - Example: `2024_12_create_analytics.sql`

2. Add the import to `sql/main.sql`:
   ```sql
   \i ./migrations/2024_12_create_analytics.sql
   ```

3. Document the module in this README

## Migration Best Practices

### DO:
- ✅ Use `IF NOT EXISTS` for tables, indexes, and functions
- ✅ Use `DROP TRIGGER IF EXISTS` before creating triggers
- ✅ Include verification messages at the end
- ✅ Document all tables, columns, and constraints
- ✅ Create indexes for frequently queried columns
- ✅ Use transactions for complex migrations

### DON'T:
- ❌ Create duplicate tables or schemas
- ❌ Hardcode environment-specific values
- ❌ Skip index creation for large tables
- ❌ Forget to handle existing data during schema changes
- ❌ Create circular dependencies between tables

## Verification

After running migrations, verify the setup:

```sql
-- Check tables exist
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'blog%'
ORDER BY tablename;

-- Check RLS status (should be disabled)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('blogs', 'blog_analytics', 'blog_audit_log');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename LIKE 'blog%'
ORDER BY tablename, indexname;

-- Check functions
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%blog%';

-- Check triggers
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgrelid::regclass::text LIKE 'blog%';
```

## Rollback

To rollback the blogs module:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
DROP TRIGGER IF EXISTS log_blog_changes_trigger ON blogs;

-- Drop functions
DROP FUNCTION IF EXISTS increment_blog_views(UUID);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS log_blog_changes();

-- Drop tables (cascades to dependent objects)
DROP TABLE IF EXISTS blog_audit_log CASCADE;
DROP TABLE IF EXISTS blog_analytics CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
```

## Maintenance

### Regular Tasks

1. **Monitor table sizes**
   ```sql
   SELECT 
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE tablename LIKE 'blog%'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

2. **Check index usage**
   ```sql
   SELECT 
     schemaname,
     tablename,
     indexname,
     idx_scan,
     idx_tup_read,
     idx_tup_fetch
   FROM pg_stat_user_indexes
   WHERE tablename LIKE 'blog%'
   ORDER BY idx_scan DESC;
   ```

3. **Vacuum and analyze**
   ```sql
   VACUUM ANALYZE blogs;
   VACUUM ANALYZE blog_analytics;
   VACUUM ANALYZE blog_audit_log;
   ```

## Support

For issues or questions:
- Check the migration file comments
- Review the verification queries above
- Check Supabase logs for errors
- Ensure proper database permissions

## Version History

- **2024-12-20**: Initial blogs module migration
  - Created blogs, blog_analytics, blog_audit_log tables
  - Added indexes, functions, and triggers
  - Disabled RLS for all blog tables
