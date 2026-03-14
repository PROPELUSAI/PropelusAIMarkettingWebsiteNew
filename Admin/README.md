# 🚀 PropelusAI Admin Panel

A full-stack admin dashboard for **PropelusAI** built with **React 19 + Vite** (frontend) and **Express 5 + MongoDB** (backend).  
Manage contacts, testimonials, affiliate partners, blog posts, newsletters, and AI chatbot conversations — all from one place.

---

## ✨ Features

| Module | Capabilities |
|--------|-------------|
| **Auth** | Username / password login, JWT access + refresh tokens, protected routes |
| **Dashboard** | At-a-glance stats for every module |
| **Contacts** | List, Detail, Kanban board · search, status/priority filters |
| **Testimonials** | List, Detail, Kanban board · approve / deny workflow |
| **Affiliates** | List, Detail, Kanban pipeline · commission & payout tracking |
| **Blogs** | List, Detail, Create/Edit form · SEO, categories, tags, version history |
| **Newsletter** | Subscriber management, Dual-mode composer (Normal + HTML), file attachments, live preview, scheduling, Resend integration |
| **Chat Conversations** | Read-only view of AI chatbot transcripts from the customer website |
| **Analytics** | GA4 dashboards — real-time, traffic, pages, acquisition, events, conversions |
| **Theme** | Dark / Light mode with persistent toggle |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, React Router 7, Zustand, React Hook Form, Zod, Recharts, date-fns, react-hot-toast, @dnd-kit |
| Backend | Express 5, Mongoose 9, MongoDB Atlas |
| Email | Resend SDK |
| Auth | bcryptjs + jsonwebtoken |
| File Uploads | multer 2 |
| Analytics proxy | Supabase Edge Functions → Google Analytics Data API |
| Dev tooling | concurrently, ESLint 9 |

---

## � Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9
- A **MongoDB** database (Atlas free tier works fine)
- *(Optional)* A **Resend** API key for newsletter emails
- *(Optional)* A **Supabase** project + GA4 property for the Analytics page

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/PROPELUSAI/PropelusAI-Admin-panel-for-customers.git
cd PropelusAI-Admin-panel-for-customers
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `MONGODB_DB_NAME` | ✅ | Database name (default: `propelus`) |
| `SERVER_PORT` | – | Express port (default: `5001`) |
| `JWT_SECRET` | ✅ | Secret for signing JWTs |
| `RESEND_API_KEY` | – | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | – | Newsletter sender address |
| `RESEND_FROM_NAME` | – | Newsletter sender display name |
| `VITE_SUPABASE_URL` | – | Supabase project URL (for analytics) |
| `VITE_SUPABASE_ANON_KEY` | – | Supabase anon key |
| `VITE_GA4_PROPERTY_ID` | – | GA4 property ID |
| `VITE_GA4_API_ENDPOINT` | – | URL of the analytics Edge Function |

### 4. Seed the admin user (first-time only)

```bash
npm run seed
```

This creates the default admin account.

### 5. Start development

```bash
npm run dev:all
```

This runs **both** the Express API (port 5001) and the Vite dev server (port 5173) concurrently.

### 6. Login

Open **http://localhost:5173** and sign in:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend only |
| `npm run server` | Start Express backend only |
| `npm run dev:all` | Start both (frontend + backend) |
| `npm run seed` | Seed the default admin user |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📁 Project Structure

```
├── server/                  # Express API server
│   ├── index.js             # Entry point — MongoDB connection, route mounts
│   ├── seed.js              # One-time admin user seeder
│   ├── models/              # Mongoose schemas (Contact, Testimonial, Affiliate, Blog, Chat, Newsletter, User)
│   ├── routes/              # Express routers — one per module (auth, contacts, testimonials, affiliates, blogs, newsletter, chats)
│   └── utils/
│       └── normalize.js     # camelCase ↔ snake_case field mapping utility (buildDualUpdate, normalizeDoc, etc.)
│
├── src/                     # React frontend (Vite)
│   ├── main.jsx             # ReactDOM root
│   ├── App.jsx              # Router + layout + all routes
│   ├── components/
│   │   ├── layout/          # Layout shell — Header, Sidebar, Footer
│   │   ├── analytics/       # GA4 chart widgets (recharts)
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Auth provider (wraps Zustand store)
│   ├── lib/
│   │   ├── api.js           # Fetch wrapper with JWT auto-refresh
│   │   └── supabase.js      # Supabase client (deprecated — kept for analytics)
│   ├── pages/               # Route-level pages per module
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   ├── Login.jsx
│   │   ├── contacts/        # ContactList, ContactDetail, ContactKanban
│   │   ├── testimonials/    # TestimonialList, TestimonialDetail, TestimonialKanban
│   │   ├── affiliates/      # AffiliateList, AffiliateDetail, AffiliateKanban, AffiliateDebug
│   │   ├── blogs/           # BlogList, BlogDetail, BlogForm
│   │   ├── newsletter/      # NewsletterList, NewsletterCompose
│   │   └── chats/           # ChatList, ChatDetail
│   ├── services/            # API service layers (one per module)
│   ├── store/               # Zustand stores (auth, theme)
│   ├── styles/              # Module-specific CSS
│   └── utils/
│       └── permissions.js   # Role-based access helpers for blogs
│
├── public/                  # Static assets served by Vite
├── supabase/functions/      # Supabase Edge Function for GA4 proxy
├── .env.example             # Environment variable template
├── vite.config.js           # Vite config with API proxy to Express
└── package.json
```

---

## � Architecture Notes

### Field Name Duality (camelCase ↔ snake_case)
The customer-facing website writes to MongoDB with **camelCase** field names, while the admin panel historically used **snake_case**. To ensure updates persist correctly, all PUT routes use `buildDualUpdate()` from `server/utils/normalize.js` — this writes **both** field-name variants in every `$set` operation so data stays consistent regardless of which app reads it.

### Authentication Flow
1. `POST /api/auth/login` → returns `accessToken` (1 hr) + `refreshToken` (24 hr)
2. Every API call in `src/lib/api.js` attaches the access token as `Authorization: Bearer <token>`
3. On 401, the wrapper automatically calls `POST /api/auth/refresh` and retries once
4. Tokens and user info are persisted via Zustand's `localStorage` middleware

### Newsletter Dual Mode
The compose page supports two editing modes:
- **Normal** — structured fields (greeting, body paragraphs, CTA button, footer)
- **HTML** — raw HTML with syntax highlighting and live preview pane

File attachments are uploaded via `multipart/form-data` to `POST /api/newsletter/upload`, stored in `uploads/newsletter/`, and attached to emails via Resend.

---

## 🔒 Security Notes

> ⚠️ The default `JWT_SECRET` and admin credentials are for **development only**.

For production:
1. Set a strong, random `JWT_SECRET`
2. Change the default admin password after first login
3. Serve over HTTPS
4. Add rate-limiting middleware to Express
5. Restrict CORS origins in `server/index.js`

---

## 📄 License

MIT
