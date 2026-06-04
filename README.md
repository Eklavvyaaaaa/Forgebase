# College Discovery and Decision-Making Platform MVP

A modern, production-grade MVP for a college discovery platform, designed to help students find, compare, and predict their chances at top institutions across India. Built with Next.js 14, Prisma, Supabase, and Tailwind CSS.

## Features

1. **College Listing & Search**: Browse colleges with debounced search, state/course/fees filters, and pagination.
2. **College Details**: View comprehensive information including overview, courses, fees, placements, and student reviews.
3. **Compare Colleges**: Add up to 3 colleges side-by-side to compare NIRF ranks, placements, ratings, and courses. State is persisted in URL parameters for easy sharing.
4. **Rank Predictor**: Enter your JEE/NEET/CAT rank and category to find colleges where you have a "Good Match", "Possible", or "Reach" chance based on historical cutoffs.
5. **User Reviews & Saves**: Logged-in users can write reviews and save colleges to their profile.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form, Zod
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Auth**: Supabase Auth

## Local Setup

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and copy the contents from `.env.example`. You will need to create a free project on [Supabase](https://supabase.com/) to get these credentials.

```env
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase Auth Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 3. Setup Database Schema

Push the Prisma schema to your Supabase Postgres database:

```bash
npx prisma db push
```
*(Alternatively, use `npx prisma migrate dev` if you prefer migration files)*

### 4. Seed the Database

Run the provided seed script to populate the database with real-world Indian colleges, courses, placements, cutoffs, and a test user:

```bash
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

All API routes return JSON and handle errors gracefully.

- `GET /api/colleges`
  - Fetches paginated colleges with search and filter parameters (`q`, `state`, `course`, `minFees`, `maxFees`, `page`).
- `GET /api/colleges/[id]`
  - Fetches full details for a single college (by ID or Slug).
- `GET /api/colleges/compare?ids=1,2,3`
  - Fetches full data for multiple colleges in a single query for side-by-side comparison.
- `GET /api/colleges/[id]/reviews`
  - Fetches reviews for a specific college.
- `POST /api/colleges/[id]/reviews`
  - Submits a new review (Auth required).
- `POST /api/colleges/[id]/save`
  - Toggles the saved status of a college for the current user (Auth required).
- `GET /api/user/saved`
  - Fetches all colleges saved by the authenticated user (Auth required).
- `POST /api/predictor`
  - Returns college matches based on rank, exam, and category by querying historical cutoffs.
- `GET /api/search/autocomplete?q=`
  - Fast, lightweight endpoint returning college names for the compare dropdown.

## Next Steps for Deployment

1. Create a project on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Add the environment variables (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy!
