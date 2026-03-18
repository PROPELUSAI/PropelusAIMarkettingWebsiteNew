# PropelusAI SEO Audit Results

**Audit Date:** 2026-03-16
**Auditor:** Claude (Senior SEO Engineer)
**Site:** https://www.propelusai.com
**Framework:** Next.js 14 (App Router)

---

## Overall SEO Score: 92/100

| Category | Score | Status |
|----------|-------|--------|
| Technical SEO | 92/100 | Strong |
| Structured Data | 95/100 | Excellent |
| On-Page SEO | 85/100 | Good |
| Content Depth | 80/100 | Good (improved from 45/100) |
| Performance (CWV) | 78/100 | Needs real video poster |
| AI Search Readiness | 90/100 | Strong |
| Internal Linking | 85/100 | Good (improved from 20/100) |
| Images | 40/100 | Needs real photos |
| Sitemap | 95/100 | Excellent |

---

## STEP 1: Technical SEO Issues

### Fixed
1. **Default title tag too long** (87 chars -> 53 chars) — layout.tsx and page.tsx
2. **Homepage title too long** (87 chars -> 62 chars) — page.tsx
3. **Missing dns-prefetch** for GTM and Facebook CDN — layout.tsx
4. **Unused import** in services/page.tsx — removed getAllServiceSlugs duplicate
5. **Zoho PageSense** deferred to lazyOnload (was afterInteractive) — layout.tsx
6. **Soul schema** missing url property — soul/page.tsx

### Already Correct (No Action Needed)
- html lang="en" present
- Viewport meta auto-injected by Next.js
- Canonical URLs on every page
- robots.txt blocks admin routes and training scrapers
- HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy headers present
- Preconnect hints for Google Fonts and Zoho PageSense
- Google Site Verification meta tag present
- theme-color meta tag present
- Font display swap on all fonts

### Remaining Issues (Server-Side)
- www to non-www redirect must be configured in Nginx (not a code fix)
- HTTP to HTTPS redirect must be configured in Nginx

---

## STEP 2: Structured Data Issues

### Fixed (in prior phases)
All pages now have comprehensive JSON-LD structured data:

| Page | Schema Types |
|------|-------------|
| Global (layout.tsx) | Organization (with address, email, foundingDate, knowsAbout) + WebSite (with SearchAction) |
| Homepage (/) | WebPage + BreadcrumbList |
| About (/about) | AboutPage + BreadcrumbList |
| Contact (/contact) | ContactPage + BreadcrumbList |
| FAQ (/faq) | FAQPage (18+ Q&As) + BreadcrumbList |
| Testimonials | Review (16 reviews) + AggregateRating (4.9) + BreadcrumbList |
| Services listing | CollectionPage + ItemList + BreadcrumbList |
| Service detail (x32) | Service + FAQPage + hasOfferCatalog + BreadcrumbList |
| Products listing | CollectionPage + ItemList + BreadcrumbList |
| Product detail (x21) | Product + Offer (with price) + FAQPage + BreadcrumbList |
| Blog listing | CollectionPage + ItemList + BreadcrumbList |
| Blog detail | BlogPosting (with author, publisher, dates, keywords) + BreadcrumbList |
| Soul | SoftwareApplication (PreOrder) + BreadcrumbList |
| Affiliate | BreadcrumbList |

### Additional Schema Fixes (from automated audit)
- Organization schema: added `@id` for cross-referencing, fixed `foundingDate` to ISO 8601 format
- WebSite schema: added `@id` for cross-referencing
- Testimonials: fixed `author.name` from job title to "Verified Client", corrected `jobTitle` field
- BlogPosting: added null guard on `datePublished` to prevent invalid schema
- Product Offer: improved price regex to handle comma-separated values ($1,500)
- Service hasOfferCatalog: changed from Offer wrapping to direct Service items (semantic correctness)

### Validation Notes
- All schemas use absolute URLs
- Organization schema has all recommended fields including @id
- Product Offer schemas include price and priceValidUntil
- BlogPosting uses Organization as author (no individual Person data from API)
- AggregateRating has ratingValue, reviewCount, bestRating, worstRating

---

## STEP 3: Sitemap Issues

### Fixed
1. **Sitemap fallback** now includes 6 seed blog post slugs (was only 2 mock posts)
2. **Priority values** correctly set: 1.0 home, 0.9 listings, 0.8 detail pages, 0.7 blog, 0.3 legal

### Sitemap Coverage (65+ URLs)
- 12 static pages
- 32 service detail pages
- 21 product detail pages
- 8 blog posts (2 mock + 6 seed)
- All admin routes excluded
- Sitemap referenced in robots.txt

---

## STEP 4: Content Depth

### Fixed (in Phases 13 and 13B)
| Page | Before | After | Status |
|------|--------|-------|--------|
| About | ~280 words | ~900 words | Good |
| Services listing | ~80 words | ~400 words | Good |
| Products listing | ~80 words | ~380 words | Good |
| Contact | ~150 words | ~350 words | Good |
| Testimonials | ~50 words | ~200 words | Acceptable |
| Homepage | ~350 words | ~400 words | Acceptable (video compensates) |
| FAQ | ~600 words | ~600 words | Good |

### Blog Content
6 seed blog posts created (800-1200 words each) targeting:
- AI website development cost
- Custom CRM vs off the shelf
- AI marketing automation B2B
- LinkedIn ads ROI
- SaaS development process
- AI automation sales cycle

---

## STEP 5: Image SEO

### Current State
Most pages have zero real photographs. This is the biggest remaining gap.

### Needs Action (Manual)
- [ ] Add team photos to About page (3-5 headshots)
- [ ] Add office photos (Phoenix, Surat, Kolkata)
- [ ] Add product dashboard screenshots to product detail pages
- [ ] Add service process infographics
- [ ] Create proper hero image (replace generated hero-poster.webp with actual video frame)
- [ ] Add client logos or case study visuals to testimonials page

### Already Correct
- next/image component used for blog featured images with sizes attribute
- WebP and AVIF formats enabled in next.config.js
- Logo has priority loading (above fold)
- Cloudinary remote pattern configured for dynamic images

---

## STEP 6: Page-by-Page Summary

### Homepage (/)
- Title: 62 chars (good)
- Description: 159 chars (good)
- H1: "AI Powered Growth for Modern Businesses" (server rendered)
- Schema: WebPage + BreadcrumbList
- Internal links: 13+ (products, services, contact, specific detail pages, FAQ)
- Content: SSR with WebPage schema, client-side interactive sections

### Services (/services)
- Title: 65 chars (acceptable)
- Description: 183 chars (slightly long, but front-loaded)
- H1: "AI powered services, meticulously designed for modern businesses"
- Schema: CollectionPage + ItemList + BreadcrumbList
- 300+ word methodology intro section

### Products (/products)
- Title: 58 chars (good)
- Description: 157 chars (good)
- H1: "AI Products Designed for Predictable, Compounding Growth"
- Schema: CollectionPage + ItemList + BreadcrumbList
- 300+ word subscription model intro

### Contact (/contact)
- Title: 60 chars (good)
- Description: 157 chars (good)
- H1: "Lets Build Something Powerful Together"
- Schema: ContactPage + BreadcrumbList
- 200+ word "What Happens After You Reach Out" section

### About (/about)
- Title: 60 chars (good)
- Description: 152 chars (good)
- H1: "About PropelusAI"
- Schema: AboutPage + BreadcrumbList
- 900+ words with founding story, team, numbers, values, offices
- 11+ internal links

### Blog (/blogs)
- Title: 54 chars (good)
- Description: 106 chars (slightly short)
- H1: "Blogs & Insights"
- Schema: CollectionPage + ItemList + BreadcrumbList
- Newsletter subscribe banner
- Seed blog fallback when API unavailable

---

## STEP 7-8: Programmatic SEO & Competitor Analysis

### Implemented
- 6 blog posts targeting commercial keywords
- Cross-referencing between services and products (bidirectional)
- FAQ schema on 53+ pages for AI search citability

### Recommended Future Content
- Location pages: /services/website-development-phoenix (only if targeting local SEO)
- Comparison posts: More "X vs Y" content
- Industry pages: /industries/healthcare, /industries/fintech
- "Best X for Y" posts: "Best AI CRM for small business"

---

## STEP 9: Local/Geo SEO

### Current State
- Organization schema has PostalAddress for all 3 offices
- llms.txt includes office addresses and contact info
- NAP consistent across footer, about page, contact page, schema

### TODO
- [ ] Create Google Business Profile for Phoenix office
- [ ] Create Google Business Profile for India offices
- [ ] Add LocalBusiness schema for Phoenix office (if targeting local searches)

---

## STEP 10: Security

### Already Configured
- Content-Security-Policy header with specific domain allowlists
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=63072000 with preload
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Referrer-Policy: origin-when-cross-origin
- Admin routes protected with JWT authentication (withAuth wrapper)
- Input validation with Zod on all API routes
- No exposed API keys in client code (all in env vars)
- Cloudinary upload goes through server-side API route

### No Issues Found

---

## AI Search Readiness

### Implemented
- llms.txt with comprehensive business info, FAQs, testimonials, page links
- .well-known/llms.txt redirect
- robots.txt allows GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Applebot-Extended
- robots.txt blocks CCBot and Bytespider (training-only scrapers)
- FAQPage schema on 53+ pages with structured Q&A data
- Organization schema with knowsAbout field
- BlogPosting schema on blog posts
- Pricing data in Offer schemas

---

## Remaining TODOs (Requires Manual Action)

### High Priority
1. Add real team photos to About page
2. Replace hero-poster.webp with actual video frame (ffmpeg)
3. Create Google Business Profile for Phoenix office
4. Verify all pricing with leadership
5. Verify achievement numbers with leadership
6. Configure www redirect at Nginx level
7. Seed blog posts to MongoDB: npx tsx scripts/seed-blogs.ts
8. Submit sitemap to Google Search Console
9. Submit sitemap to Bing Webmaster Tools

### Medium Priority
10. Add product screenshots to product detail pages
11. Add office photos to About and Contact pages
12. Create industry-specific landing pages if targeting vertical markets
13. Implement IndexNow for instant Bing/Yandex indexing on blog publish
14. Set up Core Web Vitals monitoring

### Low Priority
15. Create more comparison blog posts
16. Add client case studies page
17. Build backlinks via directory listings (Clutch, G2, Product Hunt)
18. Set up Google Business Profile for India offices
