import { z } from 'zod';

export const userSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.enum(['Admin', 'Staff', 'Manager']),
  start_date: z.date(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export type UserFormData = z.infer<typeof userSchema>;
