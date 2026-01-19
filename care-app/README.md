## Quickstart

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Setup

1. **Install dependencies**
   ```bash
   cd care-app
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.example.env` to `.env`:
   ```bash
   cp .example.env .env
   ```
   Then, add the credentials and secrets into .env.

3. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

- `app/` - Next.js App Router pages and routes
  - `login/`, `signup/` - Authentication pages
  - `staff/`, `volunteer/`, `caregiver/`, `recipient/` - Protected role-based routes
- `lib/supabase/` - Supabase client configuration (browser & server)
- `components/` - Reusable React components
- `middleware.ts` - Route protection and authentication middleware

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth, Database)
- **Package Manager**: npm

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Protected Routes

Routes prefixed with `/staff`, `/volunteer`, `/caregiver`, `/recipient`, or `/app` require authentication. Unauthenticated users are redirected to `/login`.
