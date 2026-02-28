# PropelusAI — Full Stack AI Marketing Website

Production-grade, multi-page marketing website with a full Express backend. Built with Next.js 14 App Router, Tailwind CSS, Framer Motion, MongoDB Atlas, Gemini AI chatbot, and Resend transactional emails.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14.2.35 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11
- **State:** Redux Toolkit + RTK Query
- **Icons:** React Icons 5, Heroicons
- **Fonts:** DM Sans + DM Mono (via next/font)
- **Forms:** react-phone-number-input, embedded calendar picker

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5 (TypeScript)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **AI:** Google Gemini 2.0 Flash (chatbot)
- **Email:** Resend (transactional + campaign emails)
- **Auth:** JWT (admin panel)
- **Validation:** Zod
- **Security:** Helmet, HPP, CORS, rate limiting

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB Atlas** account (or local MongoDB instance)
- **Gemini API key** (optional — for AI chatbot)
- **Resend API key** (optional — for transactional emails)

---

## Environment Variables

### Frontend (.env.local in project root)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env in propelus-backend/)

```env
# Server
NODE_ENV=development
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://www.propelusai.com

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=propelus

# JWT (generate a random 32+ char string)
JWT_SECRET=your-jwt-secret-minimum-32-characters-long
JWT_EXPIRES_IN=24h

# Google Gemini AI (optional)
GEMINI_API_KEY=your-gemini-api-key

# Resend Email (optional)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=PropelusAI <noreply@propelusai.com>
EMAIL_TO=support@propelusai.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Installation & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/PROPELUSAI/PropelusAIMarkettingWebsiteNew.git
cd PropelusAIMarkettingWebsiteNew
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd propelus-backend
npm install
cd ..
```

### 4. Set up environment variables

```bash
# Frontend
cp .env.example .env.local   # or create manually with NEXT_PUBLIC_API_URL

# Backend
cp propelus-backend/.env.example propelus-backend/.env   # or create manually
```

### 5. Start the backend server

```bash
cd propelus-backend
npm run dev
```

The backend will start on **http://localhost:3001**. You should see:
```
🔌 Connecting to MongoDB...
✅ Database connection established
🚀 Server running on http://localhost:3001
```

### 6. Start the frontend (in a separate terminal)

```bash
npm run dev
```

The frontend will start on **http://localhost:3000**.

### 7. Verify everything is working

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health: [http://localhost:3001/health](http://localhost:3001/health)
- API root: [http://localhost:3001](http://localhost:3001)

---

## Build for Production

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

---

## Deployment

### Vercel (Frontend)

The frontend is deployed to Vercel. The `vercel.json` file is preconfigured to proxy API routes to the backend.

```bash
npx vercel --prod
```

### Backend (Render / Railway / Any Node.js Host)

Deploy the `propelus-backend/` folder as a Node.js service:

```bash
cd propelus-backend
npm run build
npm start
```

Set all environment variables in your hosting platform's dashboard.

---

## Pages (12 Routes)

| Route | Page |
|-------|------|
| `/` | Home — Hero video, stats, products/services pathways, testimonials |
| `/products` | AI Products — 21 subscription-based product cards |
| `/services` | AI Services — 31 services across 5 categories with tabbed navigation |
| `/testimonials` | Testimonials — Client testimonials grid + submission form |
| `/blogs` | Blog Listing — Dynamic blog cards from MongoDB |
| `/blogs/[slug]` | Blog Detail — Individual blog post with CTA |
| `/affiliate` | Affiliate Program — Perks + registration form |
| `/about` | About Us — Story, mission, vision, values, offices |
| `/faq` | FAQ — Categorized accordion sections |
| `/contact` | Contact — Multi-field form with calendar picker |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Health check with MongoDB status |
| POST | `/api/v1/contact/submit` | Public | Submit contact form |
| GET | `/api/v1/testimonials` | Public | Get approved testimonials |
| POST | `/api/v1/testimonials/submit` | Public | Submit a testimonial |
| POST | `/api/v1/affiliate/submit` | Public | Register as affiliate |
| POST | `/api/v1/newsletter/subscribe` | Public | Subscribe to newsletter |
| POST | `/api/v1/chatbot/message` | Public | Send chatbot message |
| POST | `/api/v1/chatbot/subscribe-newsletter` | Public | Chatbot lead capture |
| GET | `/api/v1/blogs` | Public | Get all published blogs |
| GET | `/api/v1/blogs/:slug` | Public | Get single blog by slug |
| POST | `/api/v1/admin/login` | Public | Admin login (JWT) |
| GET | `/api/v1/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/api/v1/analytics/metrics` | Admin | Analytics dashboard |

---

## Project Structure

```
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── layout.tsx               # Root layout (fonts, SEO, providers, analytics)
│   │   ├── page.tsx                 # Home page (hero, stats, pathways, testimonials)
│   │   ├── globals.css              # Global styles + CSS variables
│   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   ├── robots.ts              # Robots.txt
│   │   ├── not-found.tsx          # 404 page
│   │   ├── products/              # Products page (21 AI products)
│   │   ├── services/              # Services page (31 services, 5 categories)
│   │   ├── testimonials/          # Testimonials page + submission form
│   │   ├── blogs/                 # Blog listing + [slug] detail
│   │   ├── affiliate/            # Affiliate program page
│   │   ├── about/                # About page
│   │   ├── faq/                  # FAQ page
│   │   ├── contact/              # Contact form page
│   │   ├── terms/                # Terms of Service
│   │   ├── privacy/              # Privacy Policy
│   │   └── api/                  # Next.js API proxy routes
│   ├── components/               # Shared UI components
│   │   ├── AIChatbot.tsx         # Floating AI chatbot with lead capture
│   │   ├── LeadPopup.tsx         # First-visit lead capture popup
│   │   ├── EmbeddedCalendar.tsx  # Date & time picker widget
│   │   ├── Navbar.tsx            # Fixed navigation bar
│   │   ├── Footer.tsx            # Site footer with newsletter
│   │   ├── AnimatedSection.tsx   # Scroll-triggered animation wrappers
│   │   ├── CTASection.tsx        # Reusable call-to-action section
│   │   ├── NewsletterSection.tsx # Newsletter subscription form
│   │   └── PageHero.tsx          # Page header component
│   ├── lib/
│   │   ├── data.ts               # All site content (products, services, FAQs, etc.)
│   │   └── countries.ts          # Country list for dropdowns
│   └── store/
│       ├── api.ts                # RTK Query API slice (all endpoints)
│       ├── store.ts              # Redux store configuration
│       ├── hooks.ts              # Typed useDispatch/useSelector hooks
│       ├── provider.tsx          # Redux Provider wrapper
│       └── index.ts              # Barrel exports
├── propelus-backend/
│   └── src/
│       ├── app.ts                # Express app setup (middleware + routes)
│       ├── server.ts             # Server entry point + graceful shutdown
│       ├── config/               # env, MongoDB, Gemini, Resend config
│       ├── controllers/          # Route handlers (admin, contact, chatbot, etc.)
│       ├── services/             # Business logic (chatbot, email, analytics, Gemini)
│       ├── middleware/           # Auth, CORS, rate limiting, validation, security
│       ├── routes/               # Express route definitions
│       ├── db/mongodb/           # Mongoose models and schemas
│       ├── types/                # Shared TypeScript types
│       ├── utils/                # ApiError, ApiResponse, asyncHandler, logger
│       └── validators/           # Zod validation schemas
├── public/                       # Static assets (logo, images, video)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── vercel.json                  # Vercel deployment config (API proxy)
└── package.json                 # Frontend dependencies
```

---

## Design System

- **Brand Color:** Purple (#635BFF) with light/dark surface alternation
- **Typography:** DM Sans (professional, business-grade)
- **Sections:** Alternating light (white/warm) and dark backgrounds
- **Animations:** Framer Motion scroll-triggered viewport reveals
- **Responsive:** Mobile-first, breakpoints at 640px, 768px, 1024px

## SEO Features

- Per-page metadata with title templates
- Open Graph + Twitter card meta tags
- JSON-LD structured data (Organization, WebSite, Logo schemas)
- Dynamic sitemap.xml generation
- robots.txt configuration
- Canonical URLs on every page
- Google Tag Manager, Meta Pixel, Zoho PageSense analytics

---

## License

Proprietary — © PropelusAI. All rights reserved.
