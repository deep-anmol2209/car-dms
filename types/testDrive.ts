import { z } from "zod";

/* ============================================================================
   UI Form Schemas (Client-side)
   ============================================================================ */

/**
 * Schedule Test Drive (UI Form)
 */
export const testDriveFormSchema = z.object({
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  salesperson_id: z.string().uuid().optional(),

  driver_license_number: z.string().min(5),
status: z.string().optional(),
driver_license_expiry: z.coerce.date(), 
  driver_license_image_url: z.string().optional(),
signature_image_url: z.string().optional(),

  start_time: z.string(), // datetime-local
  notes: z.string().optional(),
  end_time: z.string().optional(),
});

/**
 * End Test Drive (separate action)
 */
export const endTestDriveSchema = z.object({
  end_time: z.string(),
  notes: z.string().optional(),
});

/* ============================================================================
   Inferred Types
   ============================================================================ */

export type TestDriveFormValues = z.infer<typeof testDriveFormSchema>;
export type EndTestDriveValues = z.infer<typeof endTestDriveSchema>;

/* ============================================================================
   Database Model (matches table exactly)
   ============================================================================ */

export interface TestDrive {
  id: string;

  customer_id: string;
  vehicle_id: string;
  salesperson_id: string | null;

  driver_license_number: string;
  driver_license_expiry: string;

  driver_license_image_url: string | null;
  signature_image_url: string | null;
status: string;
  start_time: string;
  end_time: string | null;

  notes: string | null;

  created_at: string;
  updated_at: string;
}

/* ============================================================================
   Joined / UI View Model
   ============================================================================ */

export interface TestDriveWithRelations extends TestDrive {
  customer: {
    id: string;
    name: string;
    phone: string | null;
  };

  vehicle: {
    id: string;
    make: string;
    model: string;
    vin: string;
  };

  salesperson?: {
    id: string;
    full_name: string;
  } | null;
}

/* ============================================================================
   Helpers
   ============================================================================ */

export type TestDriveStatus = "Ongoing" | "Completed";

export function getTestDriveStatus(
  testDrive: TestDrive
): TestDriveStatus {
  return testDrive?.end_time ? "Completed" : "Ongoing";
}
/**
 * Patch Test Drive (partial update)
 * Used for editing details, images, notes, etc.
 */
export const patchTestDriveSchema = z.object({
  customer_id: z.string().uuid().optional(),
  vehicle_id: z.string().uuid().optional(),
  salesperson_id: z.string().uuid().nullable().optional(),

  driver_license_number: z.string().min(5).optional(),
  driver_license_expiry: z.coerce.date().optional(),

  driver_license_image_url: z.string().nullable().optional(),
  signature_image_url: z.string().nullable().optional(),
status: z.string().optional(),
  start_time: z.string().optional(),
  notes: z.string().nullable().optional(),
  end_time: z.string().optional(),
});
