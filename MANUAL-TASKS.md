# Manual Tasks Required

These tasks cannot be done from code. They require manual action from the team.

---

## Immediate (This Week)

### 1. Seed Blog Posts to MongoDB
```bash
npx tsx scripts/seed-blogs.ts
```
This inserts 6 blog posts into the database. Without this, blog detail pages return 404.

### 2. Submit Sitemap to Google Search Console
- Go to https://search.google.com/search-console
- Add property: https://www.propelusai.com
- Verify ownership (Google site verification tag is already in the code)
- Submit sitemap: https://www.propelusai.com/sitemap.xml
- Request indexing for the homepage

### 3. Submit Sitemap to Bing Webmaster Tools
- Go to https://www.bing.com/webmasters
- Add site: https://www.propelusai.com
- Submit sitemap: https://www.propelusai.com/sitemap.xml

### 4. Configure Nginx www Redirect (on Hetzner server)
Add to Nginx config:
```nginx
server {
    listen 80;
    server_name propelusai.com;
    return 301 https://www.propelusai.com$request_uri;
}
server {
    listen 443 ssl;
    server_name propelusai.com;
    return 301 https://www.propelusai.com$request_uri;
}
```

### 5. Verify All Pricing
Search the codebase for "TODO: verify pricing" and confirm all numbers:
- Service starting prices in src/lib/serviceDetails.ts
- Product monthly prices in src/lib/productDetails.ts
- These prices are displayed on the live site

### 6. Verify Achievement Numbers
Search for "TODO: verify all numbers" in src/app/about/AboutClient.tsx:
- 150+ projects delivered
- 42% faster sales cycles
- 3.1x pipeline growth
- 8 countries served
- 4x organic traffic growth

### 7. Replace Hero Video Poster
Extract first frame from hero-video.mp4:
```bash
ffmpeg -i public/hero-video.mp4 -vframes 1 -q:v 2 public/hero-poster.webp
```
The current poster is a dark placeholder.

---

## This Month

### 8. Add Real Team Photos
- Take or collect professional headshots of key team members
- Add to the About page (src/app/about/AboutClient.tsx)
- Use Next.js Image component with alt text like: alt="John Smith, CTO at PropelusAI"
- Minimum 3 photos: founder, technical lead, account manager

### 9. Add Product Screenshots
- Capture screenshots of actual CRM dashboards, analytics views, campaign reports
- Add to relevant product detail pages
- Use descriptive alt text: alt="PropelusAI CRM dashboard showing lead scoring pipeline"

### 10. Add Office Photos
- Phoenix office photo for the About page
- India office photo for the About page
- Contact page could show office exterior or workspace

### 11. Replace Placeholder Case Studies
- The 3 case studies at /case-studies are placeholder content
- Replace with real client project data in src/app/case-studies/page.tsx
- Each case study needs: real metrics, actual project description, specific technologies used

### 12. Create Google Business Profile
- Go to https://business.google.com
- Create profile for: PropelusAI, Phoenix, Arizona
- Add business category: Software Company / IT Services
- Add phone, email, address, hours, photos
- This is critical for local search visibility

---

## Backlink Building (Month 2-3)

### 13. Create Directory Profiles
Create profiles on these platforms (all free):
- Clutch.co - https://clutch.co
- G2.com - https://www.g2.com
- GoodFirms - https://www.goodfirms.co
- DesignRush - https://www.designrush.com
- TopDevelopers - https://www.topdevelopers.co
- AppFutura - https://www.appfutura.com

### 14. Launch Soul on Product Hunt
- Prepare a Product Hunt launch page
- This generates 10+ high-quality backlinks
- Schedule for a Tuesday or Wednesday (highest traffic days)

### 15. Guest Post Outreach
Pitch 3-5 publications with article ideas:
- Target: SaaS blogs, AI industry publications, startup media
- Topics: AI development trends, CRM selection guides, marketing automation ROI
- Include a link back to propelusai.com in author bio

### 16. Quora and LinkedIn Content
- Answer 20 relevant Quora questions about AI development, CRM, SaaS
- Include links to relevant blog posts or service pages
- Publish 2 LinkedIn articles per month linking to the site

---

## Ongoing

### 17. Publish 2 Blog Posts Per Month
Target these keyword clusters:
- AI website development (cost, process, comparison)
- CRM development (custom vs off-the-shelf, best practices)
- SaaS development (MVP guide, scaling, architecture)
- Marketing automation (B2B guide, ROI, tools)
- LinkedIn advertising (ROI, best practices, benchmarks)

### 18. Monitor Search Console Weekly
- Check for crawl errors
- Monitor indexing status
- Track keyword positions
- Request re-indexing after content updates

### 19. Verify Social Media Profile URLs
Check that these profiles exist and link back to www.propelusai.com:
- LinkedIn: https://www.linkedin.com/company/propelusai
- Twitter: https://twitter.com/propelusai
- Instagram: https://www.instagram.com/propelusai
- Facebook: https://www.facebook.com/propelusai
- YouTube: https://www.youtube.com/@PropelusAI
- Pinterest: https://www.pinterest.com/PropelusAI
- Bluesky: https://bsky.app/profile/propelusai.bsky.social
