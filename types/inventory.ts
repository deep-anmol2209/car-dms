import { z } from "zod";

export const vehicleSchema = z.object({
  vin: z.string().min(17).max(17, "VIN must be exactly 17 characters"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  odometer: z.number().int().min(0).default(0),
  stock_number: z.string().optional(),
  condition: z.enum(["New", "Used", "Certified Pre-Owned"]),
  status: z.enum(["Active", "Inactive", "Sold", "Coming Soon"]).default("Active"),
  purchase_price: z.number().min(0),
  retail_price: z.number().min(0),
  extra_costs: z.number().min(0).default(0),
  taxes: z.number().min(0).default(0),
 image_gallery: z.array(
  z.object({
    fileId: z.string(),
    url: z.string(),
    thumbnailUrl: z.string(),
    name: z.string(),
    size: z.number(),
    filePath: z.string(),
  })
).optional(),

});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

export interface Vehicle extends VehicleFormData {
  id: string;
  created_at: string;
  updated_at: string;
}

// Calculated fields (computed in application layer)
export interface VehicleCalculations {
  grand_total_value: number; // purchase_price + extra_costs + taxes
  estimated_income: number; // retail_price - grand_total_value
  gross_profit: number; // retail_price - (purchase_price + extra_costs + taxes)
}
