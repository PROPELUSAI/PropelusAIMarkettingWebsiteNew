# PropelusAI Project Rules

## Project Overview
Single Next.js 14 application serving both marketing website and admin panel.
MongoDB Atlas database. Single deployment on one server.

## Architecture Rules - Follow These in Every File

### No Hardcoded Values
Never write colors, font sizes, spacing, shadows, or design values directly.
Always use Tailwind design system tokens defined in tailwind.config.ts.
Wrong: className="bg-[#1a1a2e] text-[14px] p-[20px]"
Right: className="bg-brand-primary text-body-sm p-5"

### No Direct Fetch Calls in Components
All API communication goes through RTK Query hooks.
Components never call fetch() or axios directly.
Pattern: Component imports hook from store/api/ and calls it.

### No Scattered State
Global state lives in Redux store (src/store/).
Local state (useState) only for UI concerns like form inputs or toggles.

### Admin Panel Routing
Admin lives at: /@propelusaiadminpanel279#/subroutes
Uses HashRouter inside Next.js.
Marketing Navbar and Footer do not appear on admin routes.

### SEO Content Rule
All existing text in src/lib/data.ts is SEO optimized and must NOT be changed.
Only structural improvements (URLs, schemas, metadata) are allowed.

### Code Style
TypeScript for all new files.
No special characters or emojis in any user facing content.
No AI generated looking patterns in content.
Use hyphens in URLs, all lowercase.

## File Structure

### API Routes
All backend logic in src/app/api/v1/ with direct MongoDB connection.
No proxy routes. No external Express server calls.

### Models
Mongoose models in src/models/

### Shared Libraries
src/lib/mongodb.ts - DB connection singleton
src/lib/auth.ts - JWT helpers and withAuth wrapper
src/lib/email.ts - Resend email service
src/lib/gemini.ts - Gemini AI for chatbot
src/lib/validators.ts - Zod validation schemas

### State Management
src/store/store.ts - Redux store
src/store/api/ - RTK Query API slices
src/store/slices/ - Redux slices for auth and UI
src/store/hooks.ts - Typed hooks

### Components
src/components/ - Marketing components
src/components/admin/ - Admin panel components

## Environment
Development: .env.local
Production: .env.production
Never commit .env files to git.

## Current Status
Check STATUS.md for what phase we are on and what is done.