# PropelusAI - Master Technical PRD and Execution Guide

## How to Use This Document

This document is your single source of truth for the entire PropelusAI consolidation project. It captures every requirement you have shared across all conversations and organizes them into executable phases.

For each phase you will find a ready to use prompt that you can copy and paste directly into Claude in VS Code. Just open your project folder in VS Code, open Claude, and paste the prompt for the phase you want to execute.

Do the phases in order. Do not skip ahead. Each phase builds on the previous one.

---

## Project Overview

PropelusAI currently runs as three separate applications inside one repository. The goal is to merge everything into a single Next.js application that serves both the marketing website and admin panel from one deployment.

Current state:
- Next.js 14 marketing website on port 3000
- Express plus TypeScript backend in propelus-backend folder on port 3001
- Vite plus React admin panel in Admin folder on ports 5173 and 5001
- MongoDB Atlas database already connected
- Supabase remnants still present in admin panel code
- Three separate package.json files with duplicate dependencies
- Environment credentials exposed in Git

Target state:
- Single Next.js application
- All backend logic inside Next.js API routes with direct MongoDB connection
- Admin panel inside Next.js using hash based routing
- One package.json
- Proper environment file structure
- Design system with no hardcoded values
- Redux with RTK Query for state and API management
- Component to Custom Hook to API Service Layer pattern

---

## Architecture Rules (Apply to ALL Phases)

These rules must be followed in every file you create or modify.

### No Hardcoded Values
Never write colors, font sizes, spacing, or any design values directly in components. Everything goes through the design system defined in tailwind.config.ts.

Wrong: className="bg-[#1a1a2e] text-[14px]"
Right: className="bg-brand-primary text-body-sm"

### No Direct Fetch Calls
Never use fetch or axios directly inside components. All API communication goes through RTK Query endpoints.

Pattern: Component uses RTK Query hook -> RTK Query handles the request through centralized baseQuery config

### No Scattered State
All global state lives in Redux store. Local component state is fine for UI only concerns like form inputs or toggles.

### Admin Panel Routing
Admin panel lives at: domain/@propelusaiadminpanel279#/subroutes
It uses HashRouter inside Next.js. The marketing site Navbar and Footer do not appear on admin routes.

### SEO Content Rule
All existing marketing content in src/lib/data.ts must remain unchanged. The text is already SEO optimized. Only structural improvements like URL patterns and schema markup are allowed.

---

## Phase 1 - Security and Environment Setup

### What This Phase Does
Fixes the critical security issues and sets up proper environment file structure. This takes about 2 hours.

### Copy This Prompt Into Claude in VS Code

```
I need you to do Phase 1 of my project consolidation. This is the security and environment cleanup phase.

Here is what needs to happen:

1. Create .env.local with these variables (use placeholder values):

MONGODB_URI=your_mongodb_uri_here
MONGODB_DB_NAME=propelus
JWT_SECRET=generate_a_strong_random_secret_here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
GEMINI_API_KEY=your_gemini_key_here
RESEND_API_KEY=your_resend_key_here
EMAIL_FROM=noreply@propelusai.com
EMAIL_TO=contact@propelusai.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_ROUTE_SECRET=@propelusaiadminpanel279

2. Create .env.production with the same structure but production placeholder values where NEXT_PUBLIC_SITE_URL=https://www.propelusai.com

3. Update .env.example to match the same variable names with empty values

4. Update .gitignore to include:
.env
.env.local
.env.production
Admin/.env
propelus-backend/.env
*.json (for the GA4 key but be specific, do not ignore package.json)
Admin/dist/

Make sure .gitignore does NOT ignore .env.example

6. Remove Admin/dist/ folder from tracking

7. The existing .env file should remain for now but add it to .gitignore so it stops being tracked

Do NOT modify any source code in this phase. Only environment and git configuration files.
```

### After This Phase
- Manually go to MongoDB Atlas and change your database password
- Update the new .env.local with your real credentials
- Run git add and commit

---

## Phase 2 - Design System Setup

### What This Phase Does
Creates a centralized design system in tailwind.config.ts so that nothing is hardcoded in components going forward. This takes about 1 hour.

### Copy This Prompt Into Claude in VS Code

```
I need you to set up a proper design system in tailwind.config.ts for my Next.js project.

Requirements:
- This design system will be used by BOTH the marketing website and the admin panel
- No hardcoded color values, font sizes, spacing, shadows, or border radius should exist in components
- Everything should reference the design system tokens

Update tailwind.config.ts with the following structure:

Brand Colors (extract from current usage in the codebase, look at globals.css and components):
- brand-primary (the main brand color used across the site)
- brand-secondary
- brand-accent
- brand-dark (dark backgrounds)
- brand-light (light backgrounds)

Neutral Colors:
- neutral-50 through neutral-900

Status Colors:
- success, warning, error, info (each with light and dark variants)

Typography:
- Font families: heading font and body font
- Font sizes: display-lg, display-sm, heading-1 through heading-4, body-lg, body-md, body-sm, caption
- Line heights matching each font size
- Font weights: light, regular, medium, semibold, bold

Spacing:
- Use a consistent scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

Border Radius:
- none, sm, md, lg, xl, 2xl, full

Shadows:
- sm, md, lg, xl, inner, none

Breakpoints:
- mobile: 640px
- tablet: 768px
- laptop: 1024px
- desktop: 1280px

Container:
- Centered with padding
- Max widths for each breakpoint

Look at the existing components in src/components/ and src/app/ to extract the current colors and values being used. Map them to the new design system tokens.

Also update src/app/globals.css to define CSS custom properties that match the Tailwind tokens for cases where we need CSS variables directly.

Do NOT change any component code in this phase. Only update tailwind.config.ts and globals.css.
```

---

## Phase 3 - Redux Store and API Layer Setup

### What This Phase Does
Sets up the centralized state management and API communication layer. This takes about 2 to 3 hours.

### Copy This Prompt Into Claude in VS Code

```
I need you to set up a proper Redux store with RTK Query for my Next.js project.

Current state:
- There is already a basic RTK Query setup in src/store/api.ts
- There is a store in src/store/store.ts
- There is a provider in src/store/provider.tsx
- The current API calls in src/store/api.ts are proxy calls that forward to an Express backend

What I need:

1. Update src/store/store.ts to be the centralized Redux store with proper TypeScript types. Include:
- RTK Query API middleware
- Redux DevTools configuration for development only
- Proper RootState and AppDispatch types exported

2. Update src/store/api.ts to be the base API configuration using RTK Query createApi with:
- baseQuery pointing to /api/v1 (our Next.js API routes, not external backend)
- Proper error handling in baseQuery that checks for auth errors and handles them
- Tag types for cache invalidation: Blog, Contact, Testimonial, Affiliate, Newsletter, Chat, Analytics

3. Create these API slice files inside src/store/api/ folder:

src/store/api/contactApi.ts - endpoints for submitting contact form
src/store/api/blogApi.ts - endpoints for fetching blog list and single blog
src/store/api/testimonialApi.ts - endpoints for fetching and submitting testimonials
src/store/api/affiliateApi.ts - endpoints for submitting affiliate form
src/store/api/newsletterApi.ts - endpoints for subscribing to newsletter
src/store/api/chatbotApi.ts - endpoints for sending messages and getting history
src/store/api/adminApi.ts - endpoints for admin login, dashboard data, all CRUD operations

Each API slice should:
- Use injectEndpoints pattern to extend the base API
- Export auto generated hooks (useGetBlogsQuery, useSubmitContactMutation, etc)
- Include proper TypeScript types for request and response
- Use tag based cache invalidation

4. Create src/store/slices/ folder with:

src/store/slices/authSlice.ts - admin authentication state (token, user info, isAuthenticated)
src/store/slices/uiSlice.ts - UI state (sidebar open, theme, loading states)

5. Update src/store/hooks.ts with properly typed useAppDispatch and useAppSelector hooks

6. Update src/store/provider.tsx to wrap the app with the Redux Provider

7. Update src/store/index.ts to re-export everything cleanly

The pattern for components will be:
- Component imports the auto generated hook from the API slice
- Component calls the hook which handles loading, error, and data states
- No direct fetch calls anywhere
- No useEffect for data fetching (RTK Query handles this)

Do NOT modify any page or component files in this phase. Only set up the store infrastructure.
```

---

## Phase 4 - MongoDB Connection and API Routes Migration

### What This Phase Does
Moves all backend logic from propelus-backend folder into Next.js API routes with direct MongoDB connection. This is the biggest phase and takes about 3 to 4 days.

### Copy This Prompt Into Claude in VS Code

```
I need you to migrate the Express backend into Next.js API routes. The Express backend code is in propelus-backend/src/ for reference.

Step 1 - Create the shared library files:

src/lib/mongodb.ts
- Mongoose connection singleton that reuses connection in development (important for Next.js hot reload)
- Uses MONGODB_URI from environment variables
- Exports a connectDB function and the mongoose instance

src/lib/auth.ts
- JWT sign and verify helper functions
- Uses JWT_SECRET from environment
- Password hashing with bcrypt
- A withAuth middleware wrapper for API routes that checks the JWT token from Authorization header

src/lib/email.ts
- Resend email service
- Uses RESEND_API_KEY from environment
- Functions for sending contact notification, newsletter welcome, affiliate confirmation

src/lib/gemini.ts
- Gemini AI service for chatbot
- Uses GEMINI_API_KEY from environment
- Copy the knowledge base config from propelus-backend/src/config/knowledgeBase.ts

src/lib/validators.ts
- Zod validation schemas copied from propelus-backend/src/validators/
- Export validation functions for contact, newsletter, affiliate, testimonial, chatbot, auth

Step 2 - Create Mongoose models:

src/models/ folder with these files copied and adapted from propelus-backend/src/db/mongodb/models/:
- AdminUser.ts
- Blog.ts
- ContactSubmission.ts
- AffiliateRegistration.ts
- Testimonial.ts
- NewsletterSubscriber.ts
- NewsletterCampaign.ts
- ChatConversation.ts
- AnalyticsEvent.ts
- ActivityLog.ts
- Session.ts

Each model should:
- Import mongoose and the connectDB function
- Define proper TypeScript interfaces
- Export the model

Step 3 - Create API route handlers:

Replace all existing proxy routes in src/app/api/ with direct MongoDB implementations.

The new structure should be:

src/app/api/v1/health/route.ts - GET health check
src/app/api/v1/contact/submit/route.ts - POST contact form (validate, save to DB, send email)
src/app/api/v1/newsletter/subscribe/route.ts - POST newsletter signup
src/app/api/v1/affiliate/submit/route.ts - POST affiliate form
src/app/api/v1/testimonials/route.ts - GET list approved testimonials
src/app/api/v1/testimonials/submit/route.ts - POST submit testimonial
src/app/api/v1/blogs/route.ts - GET list published blogs
src/app/api/v1/blogs/[slug]/route.ts - GET single blog by slug
src/app/api/v1/chatbot/message/route.ts - POST send message to chatbot
src/app/api/v1/chatbot/history/[sessionId]/route.ts - GET chat history
src/app/api/v1/chatbot/subscribe-newsletter/route.ts - POST subscribe from chatbot

Admin API routes (all require JWT auth via withAuth wrapper):
src/app/api/v1/admin/login/route.ts - POST admin login
src/app/api/v1/admin/me/route.ts - GET current admin user
src/app/api/v1/admin/contacts/route.ts - GET all contacts, PATCH update status
src/app/api/v1/admin/contacts/[id]/route.ts - GET single contact, PATCH update, DELETE
src/app/api/v1/admin/blogs/route.ts - GET all blogs, POST create blog
src/app/api/v1/admin/blogs/[id]/route.ts - GET, PUT update, DELETE blog
src/app/api/v1/admin/testimonials/route.ts - GET all, PATCH update status
src/app/api/v1/admin/testimonials/[id]/route.ts - GET, PATCH, DELETE
src/app/api/v1/admin/affiliates/route.ts - GET all affiliates, PATCH update status
src/app/api/v1/admin/affiliates/[id]/route.ts - GET, PATCH, DELETE
src/app/api/v1/admin/newsletter/subscribers/route.ts - GET all subscribers
src/app/api/v1/admin/newsletter/campaigns/route.ts - GET all campaigns, POST create and send
src/app/api/v1/admin/chats/route.ts - GET all chat conversations
src/app/api/v1/admin/chats/[id]/route.ts - GET single conversation
src/app/api/v1/admin/dashboard/route.ts - GET dashboard stats (counts of each entity)

Each route handler should:
- Call connectDB at the start
- Validate input using the Zod schemas from lib/validators.ts
- Use try/catch with proper error responses
- Return NextResponse.json with appropriate status codes
- Use the withAuth wrapper for admin routes

Reference the existing Express controllers in propelus-backend/src/controllers/ for the exact business logic.

After creating all routes, also delete the old proxy routes that were in src/app/api/ (the ones that just forwarded to the Express backend).

Do NOT delete the propelus-backend folder yet. I will do that manually after testing.
Do NOT modify any frontend components in this phase.
```

---

## Phase 5 - Connect Frontend to New API Layer

### What This Phase Does
Updates all frontend components to use the RTK Query hooks instead of the old API calls. This takes about 1 to 2 days.

### Copy This Prompt Into Claude in VS Code

```
Now I need you to update all frontend components to use the RTK Query hooks from the store instead of direct API calls.

Look at every component and page in src/app/ and src/components/ that makes API calls. Replace them with the RTK Query hooks.

Specific files to update:

1. src/components/AIChatbot.tsx
- Replace any fetch calls with useSendChatMessageMutation and useGetChatHistoryQuery from chatbotApi
- Remove any useEffect that does manual fetching

2. src/app/contact/ContactClient.tsx
- Replace fetch call with useSubmitContactMutation from contactApi

3. src/app/testimonials/TestimonialsClient.tsx
- Replace fetch with useGetTestimonialsQuery from testimonialApi

4. src/app/blogs/page.tsx and src/app/blogs/[slug]/page.tsx
- For server components, these can still use fetch but should call /api/v1/blogs
- For client components, use useGetBlogsQuery and useGetBlogBySlugQuery

5. src/app/affiliate/AffiliateClient.tsx
- Replace with useSubmitAffiliateMutation

6. src/components/NewsletterSection.tsx
- Replace with useSubscribeNewsletterMutation

7. src/components/LeadPopup.tsx
- Replace with useSubmitContactMutation or useSubscribeNewsletterMutation as appropriate

8. Update src/store/api.ts base URL to point to /api/v1 instead of the external backend URL

Rules:
- No direct fetch calls in any client component
- No useEffect for data fetching when RTK Query hooks are available
- Loading and error states should be handled using the hook return values (isLoading, isError, error, data)
- Mutations should use the mutation hook pattern with proper loading/success/error handling
- Keep all existing UI exactly the same, only change the data fetching layer

Also update the RTK Query API slices in src/store/api/ if any endpoints are missing based on what the components actually need.

Do NOT change any visual design or layout.
```

---

## Phase 6 - Admin Panel Migration

### What This Phase Does
Moves the admin panel from the separate Vite React app into Next.js using hash based routing. This is a large phase taking 3 to 4 days.

### Copy This Prompt Into Claude in VS Code

```
I need you to migrate the admin panel from the Admin/ folder into the Next.js application.

The admin panel should be accessible at: /@propelusaiadminpanel279#/

Here is the implementation plan:

1. Create src/app/%40propelusaiadminpanel279/layout.tsx
- This is the admin layout
- It should NOT include the marketing site Navbar or Footer
- It should be a clean layout that wraps admin content
- Mark it as a client component

2. Create src/app/%40propelusaiadminpanel279/page.tsx
- This is the admin SPA entry point
- It should be a client component that renders the full admin React app
- It uses HashRouter from react-router-dom for all internal admin navigation
- Hash routes include: /dashboard, /contacts, /contacts/:id, /blogs, /blogs/new, /blogs/:id, /testimonials, /testimonials/:id, /affiliates, /affiliates/:id, /newsletter, /newsletter/compose, /chats, /chats/:id, /analytics, /login

3. Create src/components/admin/ folder and migrate these components from Admin/src/:

Layout components:
- AdminLayout.tsx (from Admin/src/components/layout/Layout.jsx)
- AdminSidebar.tsx (from Admin/src/components/layout/Sidebar.jsx)
- AdminHeader.tsx (from Admin/src/components/layout/Header.jsx)

Page components:
- AdminDashboard.tsx (from Admin/src/pages/Dashboard.jsx)
- AdminLogin.tsx (from Admin/src/pages/Login.jsx)
- ContactList.tsx (from Admin/src/pages/contacts/ContactList.jsx)
- ContactDetail.tsx (from Admin/src/pages/contacts/ContactDetail.jsx)
- ContactKanban.tsx (from Admin/src/pages/contacts/ContactKanban.jsx)
- BlogList.tsx (from Admin/src/pages/blogs/BlogList.jsx)
- BlogForm.tsx (from Admin/src/pages/blogs/BlogForm.jsx)
- BlogDetail.tsx (from Admin/src/pages/blogs/BlogDetail.jsx)
- TestimonialList.tsx (from Admin/src/pages/testimonials/TestimonialList.jsx)
- TestimonialDetail.tsx (from Admin/src/pages/testimonials/TestimonialDetail.jsx)
- TestimonialKanban.tsx (from Admin/src/pages/testimonials/TestimonialKanban.jsx)
- AffiliateList.tsx (from Admin/src/pages/affiliates/AffiliateList.jsx)
- AffiliateDetail.tsx (from Admin/src/pages/affiliates/AffiliateDetail.jsx)
- AffiliateKanban.tsx (from Admin/src/pages/affiliates/AffiliateKanban.jsx)
- ChatList.tsx (from Admin/src/pages/chats/ChatList.jsx)
- ChatDetail.tsx (from Admin/src/pages/chats/ChatDetail.jsx)
- NewsletterList.tsx (from Admin/src/pages/newsletter/NewsletterList.jsx)
- NewsletterCompose.tsx (from Admin/src/pages/newsletter/NewsletterCompose.jsx)
- AdminAnalytics.tsx (from Admin/src/pages/Analytics.jsx)
- ProtectedRoute.tsx (from Admin/src/components/ProtectedRoute.jsx)

4. For each migrated component:
- Convert from JSX to TSX with proper TypeScript types
- Replace all API calls with RTK Query hooks from src/store/api/adminApi.ts
- Replace Zustand auth store usage with Redux authSlice
- Replace any hardcoded colors/styles with Tailwind design system tokens
- Remove any Supabase references
- Use the design system classes instead of inline styles or hardcoded values

5. Admin authentication flow:
- Login page at hash route /login
- On successful login, store JWT token in Redux authSlice and localStorage
- ProtectedRoute component checks for valid token before rendering admin pages
- If no token or expired token, redirect to /login hash route
- Include token in Authorization header for all admin API calls (this is handled by RTK Query baseQuery)

6. Update the RTK Query baseQuery in src/store/api.ts to:
- Check if there is a token in the Redux store
- If yes, add it as Authorization Bearer header
- If an API call returns 401, clear the token and redirect to admin login

Do NOT delete the Admin/ folder. I will remove it manually after testing.
Do NOT modify any marketing website components.
```

---

## Phase 7 - Service and Product Detail Pages

### What This Phase Does
Creates individual detail pages for all 31 services and 21 products. This takes about 2 to 3 days.

### Copy This Prompt Into Claude in VS Code

```
I need you to create individual detail pages for each service and product listed in src/lib/data.ts.

Reference the structure at https://www.propelusai.com/services/saas-development for how a service detail page should look.

1. Create src/app/services/[slug]/page.tsx as a server component that:
- Imports service data from src/lib/data.ts
- Generates static params from all services
- Sets unique metadata (title, description, Open Graph) for each service
- Adds JSON-LD Service schema for SEO
- Adds BreadcrumbList schema
- Adds canonical URL

2. Create src/app/services/[slug]/ServiceDetailClient.tsx as the client component that:
- Receives service data as props
- Displays: hero section, full description, use cases, process steps, deliverables, related services, FAQ section, CTA section
- Uses the design system tokens for all styling
- Includes Framer Motion animations matching the rest of the site
- Links back to the services listing page
- Cross links to related services

3. Generate URL slugs using hyphens and lowercase from service names in data.ts. Examples:
- Website Development -> /services/website-development
- Mobile App Development -> /services/mobile-app-development
- Custom CRM Development -> /services/custom-crm-development
- SaaS Development -> /services/saas-development

4. Update the services listing page (src/app/services/ServicesClient.tsx) so that each service card links to its detail page.

5. Do the same for products:
- Create src/app/products/[slug]/page.tsx (server component with metadata)
- Create src/app/products/[slug]/ProductDetailClient.tsx (client component)
- Update src/app/products/ProductsClient.tsx to link each product card to its detail page

6. Update src/app/sitemap.ts to include all service and product detail pages with proper priority and changefreq values.

7. For the service detail page content, expand on what already exists in data.ts. Each service should have:
- A longer description (2 to 3 paragraphs)
- 4 to 6 use cases or industries served
- A step by step process (4 to 6 steps)
- Key deliverables list
- 3 to 4 FAQ items specific to that service
- 3 related services

Keep the content professional, natural, and focused on website development, SaaS development, CRM development, mobile app development, AI automation, marketing automation, and lead generation keywords.

Do NOT use special characters, emojis, or any AI generated looking patterns in the content.
Do NOT change the existing marketing content in data.ts. Add new content alongside it.
```

---

## Phase 8 - SEO Improvements

### What This Phase Does
Adds remaining SEO optimizations across the site. This takes about 1 day.

### Copy This Prompt Into Claude in VS Code

```
I need you to make SEO improvements across the entire Next.js application.

1. Add canonical URLs to every page. Each page.tsx server component should include a canonical URL in its metadata.

2. Update src/app/sitemap.ts to:
- Include all service detail pages
- Include all product detail pages
- Fetch blog slugs from the MongoDB API at /api/v1/blogs instead of using hardcoded data
- Set proper priority values (home 1.0, services 0.9, service details 0.8, products 0.8, blogs 0.7)
- Set proper changefreq values

3. Add BreadcrumbList JSON-LD schema to:
- Service detail pages
- Product detail pages
- Blog detail pages
- About, Contact, FAQ pages

4. Fix the favicon filename. The current files in public/ have a typo (propelus-faviocn). Rename them to propelus-favicon. Update any references in layout.tsx.

5. Make sure all URLs use:
- Lowercase letters
- Hyphens instead of underscores or spaces
- No special characters
- No trailing slashes

6. Add proper alt text to all images that currently lack them.

7. Check all meta descriptions are unique and contain target keywords:
- Website development
- SaaS development
- CRM development
- Mobile app development
- AI automation
- Marketing automation
- Lead generation
- Custom software development

8. Make sure the blog listing page fetches from the API instead of hardcoded blogPosts in data.ts. The admin CMS manages blogs in MongoDB, so the public blog pages should read from there.

Do NOT change any existing visible content text. Only add metadata and structural SEO improvements.
```

---

## Phase 9 - Cleanup

### What This Phase Does
Removes old code and finalizes the project structure. This takes about half a day.

### What You Do Manually (not Claude)

After you have tested everything from phases 1 through 8:

1. Delete the propelus-backend/ folder entirely
2. Delete the Admin/ folder entirely
3. Remove dependencies from package.json that were only needed by the old structure (check for any Express related packages that are no longer imported anywhere)
4. Run npm install to clean up package-lock.json
5. Run npm run build to make sure everything compiles
6. Test every page and API endpoint
7. Commit and push

---

## Quick Reference - File Structure After All Phases

```
PropelusAI-Marketting-New/
  .env.local
  .env.production
  .env.example
  .gitignore
  next.config.js
  package.json
  tailwind.config.ts (design system)
  tsconfig.json
  public/
    logo.png
    hero-video.mp4
    propelus-favicon.png (renamed)
  src/
    app/
      layout.tsx
      page.tsx (home)
      globals.css
      robots.ts
      sitemap.ts (dynamic)
      not-found.tsx
      about/
      affiliate/
      blogs/
        page.tsx
        [slug]/page.tsx
      contact/
      faq/
      privacy/
      products/
        page.tsx
        [slug]/
          page.tsx (NEW)
          ProductDetailClient.tsx (NEW)
      services/
        page.tsx
        [slug]/
          page.tsx (NEW)
          ServiceDetailClient.tsx (NEW)
      terms/
      testimonials/
      %40propelusaiadminpanel279/ (NEW - admin panel)
        layout.tsx
        page.tsx
      api/
        v1/ (NEW - direct MongoDB)
          health/route.ts
          contact/submit/route.ts
          newsletter/subscribe/route.ts
          affiliate/submit/route.ts
          testimonials/route.ts
          testimonials/submit/route.ts
          blogs/route.ts
          blogs/[slug]/route.ts
          chatbot/message/route.ts
          chatbot/history/[sessionId]/route.ts
          chatbot/subscribe-newsletter/route.ts
          admin/
            login/route.ts
            me/route.ts
            contacts/route.ts
            contacts/[id]/route.ts
            blogs/route.ts
            blogs/[id]/route.ts
            testimonials/route.ts
            testimonials/[id]/route.ts
            affiliates/route.ts
            affiliates/[id]/route.ts
            newsletter/subscribers/route.ts
            newsletter/campaigns/route.ts
            chats/route.ts
            chats/[id]/route.ts
            dashboard/route.ts
    components/
      AIChatbot.tsx
      AnimatedSection.tsx
      CTASection.tsx
      Footer.tsx
      Navbar.tsx
      (other marketing components)
      admin/ (NEW)
        AdminLayout.tsx
        AdminSidebar.tsx
        AdminHeader.tsx
        AdminDashboard.tsx
        AdminLogin.tsx
        (all admin page components)
    lib/
      data.ts (UNCHANGED)
      countries.ts
      mongodb.ts (NEW)
      auth.ts (NEW)
      email.ts (NEW)
      gemini.ts (NEW)
      validators.ts (NEW)
    models/ (NEW)
      AdminUser.ts
      Blog.ts
      ContactSubmission.ts
      (all Mongoose models)
    store/
      store.ts (updated)
      provider.tsx
      hooks.ts (updated)
      index.ts
      api/
        baseApi.ts (NEW)
        contactApi.ts (NEW)
        blogApi.ts (NEW)
        testimonialApi.ts (NEW)
        affiliateApi.ts (NEW)
        newsletterApi.ts (NEW)
        chatbotApi.ts (NEW)
        adminApi.ts (NEW)
      slices/
        authSlice.ts (NEW)
        uiSlice.ts (NEW)
```

---

## Timeline Summary

Phase 1 - Security and Environment: Day 1 (2 hours)
Phase 2 - Design System: Day 1 (1 hour)
Phase 3 - Redux Store and API Layer: Day 2 (3 hours)
Phase 4 - MongoDB and API Routes Migration: Days 3 to 6
Phase 5 - Connect Frontend to New API: Days 7 to 8
Phase 6 - Admin Panel Migration: Days 9 to 12
Phase 7 - Service and Product Detail Pages: Days 13 to 15
Phase 8 - SEO Improvements: Day 16
Phase 9 - Cleanup and Testing: Day 17

Total estimated time: 2 to 3 weeks working full time

---

## Important Notes

- Always test after completing each phase before moving to the next
- If Claude in VS Code makes a mistake, describe what went wrong and ask it to fix that specific thing
- Do not give Claude multiple phases at once. One phase at a time
- After Phase 4, manually test every API endpoint using a tool like Postman or Thunder Client before proceeding
- After Phase 6, manually test the entire admin panel before cleanup
- Keep the propelus-backend and Admin folders until you are 100% sure everything works in the new structure