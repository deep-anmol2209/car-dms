import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  vin: z.string().length(17, "VIN must be 17 characters").regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Invalid VIN format"),
  year: z.number().min(1900).max(currentYear + 1),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  odometer: z.number().min(0).optional(),
  stock_number: z.string().optional(),
  condition: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Sold', 'Coming Soon']),
  purchase_price: z.number().min(0, "Must be positive"),
  retail_price: z.number().min(0, "Must be positive"),
  extra_costs: z.number().min(0).default(0),
  taxes: z.number().min(0).default(0),
  image_gallery: z.array(z.string().url()).optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
