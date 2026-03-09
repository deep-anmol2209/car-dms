import { z } from 'zod';

export const businessProfileSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(5, "ZIP code is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email format"),
  tax_id: z.string().optional(),
  business_number: z.string().optional(),
  license_number: z.string().optional(),
});

export const personalProfileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  language: z.enum(['en', 'es', 'fr']).default('en'),
  timezone: z.string().default('America/New_York'),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;
