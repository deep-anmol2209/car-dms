import { z } from "zod";

export const personalProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),

    avatar: z
    .union([
      z.string(),
      z.object({
        fileId: z.string(),
        imageUrl: z.string(),
      }),
    ])
    .optional(),

});

export type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;

export interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  
    avatar?: {
      fileId: string;
      imageUrl: string;
    };
  
   
  
    role: "Admin" | "Manager" | "Staff";
  
    created_at?: string;
    updated_at?: string;
  }