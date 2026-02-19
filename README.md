# PropelusAI — Next.js Website

Production-grade, multi-page website built with Next.js 14 App Router, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11
- **Icons:** React Icons 5
- **Language:** TypeScript 5
- **Fonts:** DM Sans + DM Mono (via next/font)

## Pages (12 Routes)

| Route | Page |
|-------|------|
| `/` | Home — Hero video, stats, products/services pathways, testimonial |
| `/products` | AI Products — 6 subscription product cards |
| `/services` | AI Services — Categorized service catalog with expandable cards |
| `/testimonials` | Testimonials — 16 client testimonials + submission form |
| `/blogs` | Blog Listing — Featured articles grid |
| `/blogs/[slug]` | Blog Detail — Dynamic article pages |
| `/affiliate` | Affiliate Program — Perks + registration form |
| `/about` | About Us — Mission, vision, values, offices |
| `/faq` | FAQ — Categorized accordion (16 questions) |
| `/contact` | Contact — Project form + direct contact info |
| `/terms` | Terms of Service — Legal content |
| `/privacy` | Privacy Policy — Legal content |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + CSS variables
│   ├── sitemap.ts          # Dynamic sitemap generation
│   ├── robots.ts           # Robots.txt generation
│   ├── not-found.tsx       # 404 page
│   ├── products/           # Products page
│   ├── services/           # Services page
│   ├── testimonials/       # Testimonials page
│   ├── blogs/              # Blog listing + [slug] detail
│   ├── affiliate/          # Affiliate page
│   ├── about/              # About page
│   ├── faq/                # FAQ page
│   ├── contact/            # Contact page
│   ├── terms/              # Terms page
│   └── privacy/            # Privacy page
├── components/             # Shared components
│   ├── Navbar.tsx           # Navigation with scroll detection
│   ├── Footer.tsx           # Site footer
│   ├── AnimatedSection.tsx  # Scroll-triggered animations
│   ├── PageHero.tsx         # Page header component
│   ├── SectionHeader.tsx    # Section header component
│   └── CTASection.tsx       # Call-to-action section
└── lib/
    └── data.ts             # All site content & data
public/
├── logo.png               # PropelusAI logo
└── hero-video.mp4          # Hero section background video
```

## Design System

- **Colors:** Brand purple (#635bff) + light/dark surface alternation
- **Typography:** DM Sans (minimal, professional, business-grade)
- **Sections:** Alternating light (white/warm) and dark backgrounds
- **Animations:** Framer Motion scroll-triggered reveals
- **Responsive:** Mobile-first, breakpoints at 640px, 768px, 1024px

## SEO Features

- Per-page metadata with title templates
- Open Graph + Twitter card meta tags
- JSON-LD structured data (Organization schema)
- Dynamic sitemap.xml generation
- robots.txt configuration
- Canonical URLs on every page
- Semantic HTML5 structure
- Image alt text optimization

## Deployment

Optimized for Vercel deployment:

```bash
# Deploy to Vercel
npx vercel
```

Or build and deploy to any Node.js hosting:

```bash
npm run build
npm start
```
