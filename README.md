# MINDSync

Built for Hack4Good. MINDSync is a centralised multi-branch event and volunteer management web application designed for MINDS to replace scattered spreadsheets, dead links, and manual forms across branches.

## Problem Context

Managing volunteer and participant signups across multiple branches using separate Google Forms and spreadsheets creates three recurring bottlenecks:

- Fragmented administration: Staff spend hours reconciling separate sheets and forms for each event.
- Inconsistent calendar formats: Each branch publishes schedules differently, making it difficult for volunteers and caregivers to find available sessions.
- Limited coverage visibility: Staff lack a single real-time view of which upcoming events still need volunteers.

## Solution Overview

MINDSync consolidates multi-branch event discovery, role-based signup workflows, and real-time volunteer coverage tracking into a single web platform:

- Staff dashboard: View all branch events organised by month, track required versus confirmed volunteers in real time, inspect individual participant rosters, and export monthly coverage reports as CSV files.
- Volunteer, caregiver, and care recipient views: Browse events in card or calendar grid layouts, filter by activity type, and sign up or cancel with a single click.
- Role-based routing: Next.js middleware automatically routes authenticated users (`staff`, `volunteer`, `caregiver`, and `care-recipient`) to their respective workspaces.

## Technology Stack

- Frontend: Next.js 16 (App Router), React 19, and TypeScript (strict mode)
- Backend: Supabase (PostgreSQL, Authentication, Row Level Security, and Realtime subscriptions)
- Database logic: Centralised PostgreSQL RPC functions for atomic capacity checks and signup state transitions

## Project Structure

```text
care-app/
├── app/                        # Next.js App Router pages and layouts
│   ├── login/                  # Authentication routes
│   ├── signup/                 # Registration routes
│   ├── staff/[month]/          # Staff event list, coverage dashboard, calendar, and CSV export
│   ├── volunteer/              # Volunteer workspace
│   ├── caregiver/              # Caregiver workspace
│   ├── care-recipient/         # Care recipient workspace
│   └── unauthorized/           # Unauthorised access fallback
├── lib/                        # Supabase server/browser clients and date utilities
├── middleware.ts               # Role-based route protection
└── supabase/migrations/        # SQL schema, RLS policies, and RPC functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project

### Setup

1. Install dependencies:
   ```bash
   cd care-app
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .example.env .env
   ```
   Add your Supabase project URL and anonymous key to `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Apply database migrations:
   Run the SQL migration files in `care-app/supabase/migrations/` against your Supabase project to create the event tables, user profiles, RPC signup functions, and Row Level Security policies.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
