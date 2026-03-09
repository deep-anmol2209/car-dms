# Adaptus DMS - Dealer Management System

A comprehensive, production-ready Dealer Management System built with Next.js 14, TypeScript, and Supabase.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (for vehicle images)
- **API:** Next.js Server Actions

### Development Tools
- **Testing:** Playwright (E2E)
- **Linting:** ESLint
- **Type Checking:** TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: App URL (for metadata)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Configuration (OpenAI)
OPENAI_API_KEY=your_openai_api_key

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cron Job Security
CRON_SECRET=your_random_secret_string_for_cron_protection
```

### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd adaptusdms
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   - Open your Supabase project SQL Editor
   - Run `supabase/schema.sql` to create all tables
   - Run `supabase/migrations/20240101_production_security.sql` to set up RLS policies

4. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
adaptusdms/
├── app/                      # Next.js App Router pages
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── dashboard/       # Main dashboard
│   │   ├── inventory/      # Vehicle inventory
│   │   ├── leads/          # CRM & leads
│   │   ├── invoices/       # Invoicing system
│   │   ├── financials/     # Financial ledger
│   │   ├── users/          # User management
│   │   └── settings/       # Settings & system health
│   ├── layout.tsx          # Root layout
│   ├── global-error.tsx    # Error boundary
│   └── not-found.tsx       # 404 page
├── components/              # React components
│   ├── ui/                 # Shadcn/UI components
│   ├── dashboard/          # Dashboard components
│   ├── inventory/         # Inventory components
│   ├── crm/                # CRM components
│   └── invoices/          # Invoice components
├── lib/                    # Utilities & configurations
│   ├── actions/           # Server actions
│   ├── validations/       # Zod schemas
│   └── supabase/          # Supabase clients
├── hooks/                  # Custom React hooks
├── supabase/              # Database files
│   ├── schema.sql         # Database schema
│   ├── migrations/        # Database migrations
│   └── policies.sql       # RLS policies documentation
├── e2e/                   # Playwright E2E tests
└── public/                # Static assets
```

## 🚢 Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub/GitLab repository with your code

### Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In Vercel project settings, go to **Environment Variables**
   - Add all variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (optional, for server actions)
     - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `your-project.vercel.app`

5. **Update Supabase Settings:**
   - In Supabase Dashboard → **Settings** → **API**
   - Add your Vercel URL to **Allowed Redirect URLs**
   - Format: `https://your-project.vercel.app/**`

### Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test database connectivity
- [ ] Verify RLS policies are active
- [ ] Test authentication flow
- [ ] Check that images load from Supabase Storage
- [ ] Run E2E tests against production URL
- [ ] Set up custom domain (optional)

## 🧪 Testing

### Run E2E Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui
```

### Test Coverage

- Navigation smoke tests
- Critical user flows (Add Vehicle, Create Invoice)
- Database connectivity
- Error handling
- 404 pages

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Authenticated Users:** Full access to all data (view, insert, update, delete)
- **Anonymous Users:** Can only view vehicles with status = 'Active'
- **User Roles:** Only Admins can modify user roles

See `supabase/migrations/20240101_production_security.sql` for complete policy definitions.

### Best Practices

- Never commit `.env.local` to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-side only)
- Regularly review and update RLS policies
- Use environment-specific configurations

## 📚 Key Features

### Inventory Management
- Vehicle CRUD operations
- Real-time profit calculator
- Image upload and gallery
- Advanced filtering and search
- CSV import/export

### CRM & Leads
- Lead tracking and management
- Real-time duplicate detection
- Status workflow (Not Started → In Progress → Qualified → Won/Lost)
- Vehicle interest tracking

### Financial Dashboard
- KPI cards with real-time metrics
- Interactive charts (Recharts)
- Revenue trends
- Financial ledger with net profit

### Invoicing System
- Professional invoice builder
- Real-time tax calculations (GST/PST or HST)
- Print-ready Bill of Sale
- Payment tracking

### User Management
- Staff CRUD operations
- Role-based access (Admin, Manager, Staff)
- Avatar support

### System Health
- Database connectivity monitoring
- Orphan data detection
- Performance metrics
- Error reporting

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Run build
npm run build
```

### Database Connection Issues

1. Verify environment variables are correct
2. Check Supabase project is active
3. Verify RLS policies allow your operations
4. Check System Health page (`/settings/system-health`)

### TypeScript Errors

```bash
# Check for type errors
npm run build

# Fix common issues:
# - Add type annotations where needed
# - Use `as` assertions sparingly
# - Check import paths
```

## 📖 Documentation

- **Help Center:** `/help` - Staff documentation
- **System Health:** `/settings/system-health` - System monitoring
- **API Documentation:** See `lib/actions/` for server actions

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test:e2e`
4. Build check: `npm run build`
5. Submit a pull request

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For technical support or questions:
- Check the Help Center (`/help`)
- Review System Health (`/settings/system-health`)
- Contact your IT administrator

---

**Built with ❤️ for automotive dealerships**
