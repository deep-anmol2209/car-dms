import { z } from 'zod';

const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const leadSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  source: z.enum(['craigslist', 'kijiji', 'text_us', 'website', 'walk_in']),
  status: z.enum(['not_started', 'in_progress', 'qualified', 'lost', 'won']).default('not_started'),
  vehicle_interest_id: z.string().uuid("Invalid vehicle ID").optional(),
  assigned_to: z.string().uuid("Invalid user ID").optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
