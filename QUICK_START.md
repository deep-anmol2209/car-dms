# Quick Start Guide

## ⚠️ IMPORTANT: Environment Setup Required

The app requires Supabase credentials to run. Follow these steps:

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the project root (same folder as `package.json`).

### Step 2: Add Supabase Credentials

Copy this template into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Restart Dev Server

After creating `.env.local`, restart the server:
- Stop current server (Ctrl+C)
- Run `npm run dev` again

## That's It! 🎉

The app should now load without errors. See `SETUP_ENV.md` for more details.
