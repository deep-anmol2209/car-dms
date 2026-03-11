import { z } from "zod";

/* ============================================================================
   Lead Constants
   ============================================================================ */

export const LEAD_SOURCES = [
  "Craigslist",
  "Kijiji",
  "Text Us",
  "Website",
  "Referral",
  "Other",
] as const;

export type LeadSource = typeof LEAD_SOURCES[number];

export const LEAD_STATUSES = [
  "Not Started",
  "In Progress",
  "Qualified",
  "Closed",
  "Lost",
] as const;

export type LeadStatus = typeof LEAD_STATUSES[number];

/* ============================================================================
   Form Schema (Create / Update Lead)
   ============================================================================
   👉 Used by React Hook Form
   👉 Uses ONLY IDs (correct)
*/

export const leadSchema = z.object({
  customer_id: z.string().uuid().min(1, "Customer is required"),

  source: z.enum(LEAD_SOURCES, {
    required_error: "Source is required",
  }),

  status: z.enum(LEAD_STATUSES).default("Not Started"),

  interest_vehicle_id: z.string().uuid().nullable().optional(),

  assigned_to: z.string().uuid().nullable().optional(),

  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

/* ============================================================================
   Database Model (EXACT table structure)
   ============================================================================
   👉 Matches Supabase `leads` table
   👉 NEVER contains joined data
*/

export type Lead = {
  id: string;

  customer_id: string;
  interest_vehicle_id: string | null;
  assigned_to: string | null;

  status: LeadStatus;
  source: LeadSource;
  notes: string | null;

  created_at: string;
  updated_at: string;
};

/* ============================================================================
   View Model (UI / Joined Data)
   ============================================================================
   👉 Used in tables, detail pages, dashboards
   👉 Returned by Supabase SELECT with joins
*/

export type LeadView = {
  id: string;

  status: LeadStatus;
  source: LeadSource;
  notes: string | null;

  created_at: string;
  updated_at: string;

  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };

  interest_vehicle: {
    id: string;
    make: string;
    model: string;
    year: string
  } | null;

  assigned_to: {
    id: string;
    full_name: string;
    email: string;
  } | null;
};
