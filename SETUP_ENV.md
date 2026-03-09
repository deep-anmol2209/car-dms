# Environment Setup Guide

## Quick Start

The application requires Supabase environment variables to run. Follow these steps:

### 1. Create `.env.local` file

Copy the example file:
```bash
cp .env.local.example .env.local
```

Or create `.env.local` manually in the project root.

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Update `.env.local`

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart the Dev Server

After updating `.env.local`, restart your development server:
- Stop the current server (Ctrl+C)
- Run `npm run dev` again

## Required Variables

### Minimum Required (to run the app)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Optional (for full functionality)
- `SUPABASE_SERVICE_ROLE_KEY` - For server-side operations
- `OPENAI_API_KEY` - For AI chat feature (currently disabled)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - For SMS feature
- `CRON_SECRET` - For automated cron jobs
- `NEXT_PUBLIC_APP_URL` - Your app URL (for metadata)

## Database Setup

After setting up environment variables, you need to set up your database:

1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` to create all tables
3. Run `supabase/migrations/20240101_production_security.sql` for RLS policies
4. Run `supabase/migrations/20240102_interactions_table.sql` for SMS logging

## Troubleshooting

### Error: "Your project's URL and Key are required"
- Make sure `.env.local` exists in the project root
- Verify the variable names are correct (no typos)
- Restart the dev server after creating/updating `.env.local`
- Check that values are not wrapped in quotes

### Error: "Invalid API key"
- Verify you copied the correct key from Supabase dashboard
- Make sure there are no extra spaces or line breaks
- The anon key should start with `eyJ...`

### Still having issues?
- Check that `.env.local` is in the project root (same level as `package.json`)
- Verify file is not named `.env.local.txt` (Windows sometimes adds .txt)
- Restart your terminal/IDE after creating the file
