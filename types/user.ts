import { z } from 'zod';

// Base schema with common fields
const baseSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const userFormSchema = z.object({
    full_name: z.string().min(2).max(100).trim(),
  
    email: z.string().email().toLowerCase().trim(),
  
    phone: z
      .string()
      .regex(/^[0-9+\-\s()]+$/)
      .optional()
      .or(z.literal('')),
  
    role: z.enum(['Admin', 'Staff', 'Manager']),

   avatar: z
  .object({
    fileId: z.string(),
    imageUrl: z.string().url("Invalid avatar URL"),
  })
  .nullable()
  .optional(),

  
    start_date: z
      .union([z.date(), z.string()])
      .transform(v => new Date(v)),
  });
  

export type UserFormData = z.infer<typeof userFormSchema>;

// Schema for updating user (all fields optional except id)
export const updateUserSchema = userFormSchema.partial();

// Database user type
export interface User extends z.infer<typeof baseSchema> {
  id: string;
  avatar?: {
  fileId: string;
  imageUrl: string;
} | null;

  full_name: string;
  role: 'Admin' | 'Staff' | 'Manager';
  email: string;
  phone: string | null;
  start_date: Date;
}

// Alternative approach using extend
export const userSchema = baseSchema.extend({
  id: z.string().uuid(),
  avatar: z.object({fileId: z.string(), imageUrl: z.string().url()}).nullable(),
  full_name: z.string(),
  role: z.enum(['Admin', 'Staff', 'Manager']),
  email: z.string().email(),
  phone: z.string().nullable(),
  start_date:  z.union([z.date(), z.string()])
  .transform((value) => new Date(value)),
});

export type UserSchemaType = z.infer<typeof userSchema>;