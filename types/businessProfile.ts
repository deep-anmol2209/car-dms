

import { z } from "zod";

export const businessProfileSchema = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),

  street_address: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),

  zip: z
  .string()
  .regex(/^[0-9]{4,10}$/, "Invalid ZIP code")
  .optional()
  .or(z.literal("")),

  phone: z
  .string()
  .regex(/^[0-9]{7,15}$/, "Invalid phone")
  .optional()
  .or(z.literal("")),

  email: z
    .string()
    .email("Invalid email address")
    .optional(),

  tax_id: z.string().optional(),

  dealer_license: z.string().optional(),
});

export interface BusinessProfile {
    id: string;
    business_name: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email?: string;
    tax_id?: string;
    dealer_license?: string;
    created_at?: string;
    updated_at?: string;
  }
  export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;