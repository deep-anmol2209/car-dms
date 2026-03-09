import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.phone || data.email, {
  message: "Either phone or email is required",
  path: ["phone"],
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Duplicate detection flags (computed in application)
  duplicate_name?: boolean;
  duplicate_phone?: boolean;
}
