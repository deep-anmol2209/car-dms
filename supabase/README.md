# Adaptus DMS - Database Schema

This directory contains the PostgreSQL database schema for the Adaptus DMS.

## Schema Overview

The database consists of 11 core tables designed to support a comprehensive DMS:

### Core Tables

1. **users** - Staff and admin user accounts with role-based access control
2. **vehicles** - Vehicle inventory with pricing, status, and image galleries
3. **customers** - Customer database for CRM, test drives, and sales
4. **purchase_from_public** - Records for vehicles purchased from private sellers
5. **leads** - CRM lead tracking with source attribution and status
6. **test_drives** - Test drive records with license validation
7. **sales_deals** - Sales transactions with finance terms
8. **invoices** - Invoice management with tax calculations
9. **financial_transactions** - General ledger for income/expense tracking
10. **social_media_posts** - Social media posting tracking
11. **facebook_business_account** - Facebook API integration settings

## Setup Instructions

### For Supabase:

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Execute the SQL script
5. Verify all tables, indexes, and triggers were created successfully

### For Local Development:

If using Supabase CLI:
```bash
supabase db reset
# or
psql -h localhost -U postgres -d postgres -f schema.sql
```

## Key Features

### Constraints & Validations

- **VIN uniqueness** enforced on vehicles
- **Status enums** for vehicles, leads, deals, invoices
- **Check constraints** for pricing, dates, and business logic
- **Foreign key relationships** maintain data integrity

### Indexes

Optimized indexes for:
- Email/phone lookups (duplicate detection)
- Status filtering
- Date range queries
- Foreign key joins

### Calculated Fields

The following fields are calculated in the application layer:

- **vehicles.grand_total_value** = `purchase_price + extra_costs + taxes`
- **vehicles.estimated_income** = `retail_price - purchase_price - extra_costs - taxes`
- **invoices.tax_amount** = `payment_amount * tax_rate / 100`
- **invoices.total** = `payment_amount + tax_amount`

### Row Level Security (RLS)

RLS is enabled on all tables. Basic read policies are included for authenticated users. **Important**: You'll need to add proper Insert/Update/Delete policies based on your role-based access control requirements.

## Relationship Diagram

```
users
  ├── purchase_from_public (accepted_by)
  ├── leads (assigned_to)
  ├── test_drives (salesperson_id)
  ├── sales_deals (salesperson_id)
  └── financial_transactions (created_by)

vehicles
  ├── leads (interest_vehicle_id)
  ├── test_drives
  ├── sales_deals
  ├── financial_transactions
  └── social_media_posts

customers
  ├── leads
  ├── test_drives
  ├── sales_deals
  └── invoices
```

## Next Steps

After running the schema:

1. Set up Supabase Auth integration
2. Configure RLS policies for your specific access control needs
3. Create application-level computed fields/views
4. Set up database backups
5. Configure connection pooling for production

## Notes

- All tables include `created_at` and `updated_at` timestamps
- UUID v4 is used for all primary keys
- The `updated_at` column is automatically maintained via triggers
- Image URLs are stored as TEXT or TEXT[] arrays (consider Supabase Storage for actual files)
