"use server";
import { patchTestDriveSchema } from "@/types/testDrive";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import {
  testDriveFormSchema,
  endTestDriveSchema,
} from "@/types/testDrive";

/* ============================================================================
   Queries
   ============================================================================ */
export async function getTestDrives(filters?: {
  search?: string;
  status?: string;
}) {
  try {
    const supabase = await createClient();

    const search =
      typeof filters?.search === "string"
        ? filters.search.trim()
        : "";

    const status = filters?.status ?? "";

    /* ---------------- BASE QUERY ---------------- */
    let query = supabase
      .from("test_drives_search")   // ✅ USE VIEW
      .select("*")
      .order("created_at", { ascending: false });

    /* ---------------- SEARCH ---------------- */
    if (search.length >= 2) {
      const safe = search.replace(/[%_]/g, "\\$&");

      query = query.or(
        `
        customer_name.ilike.%${safe}%,
        vehicle_make.ilike.%${safe}%,
        vehicle_model.ilike.%${safe}%,
        vehicle_vin.ilike.%${safe}%,
        notes.ilike.%${safe}%
        `.replace(/\s+/g, "") // 🔥 prevents PostgREST parse errors
      );
    }

    /* ---------------- STATUS ---------------- */
    if (status === "ongoing") {
      query = query.is("end_time", null);
    }

    if (status === "completed") {
      query = query.not("end_time", "is", null);
    }

    const { data, error } = await query;

    if (error) throw error;

    const mapped = data.map((row: any) => ({
  id: row.id,
  customer_id: row.customer_id,
  vehicle_id: row.vehicle_id,
  start_time: row.start_time,
  end_time: row.end_time,
  notes: row.notes,
  created_at: row.created_at,
  updated_at: row.updated_at,

  customer: {
    id: row.customer_id,
    name: row.customer_name,
    phone: row.customer_phone,
  },

  vehicle: {
    id: row.vehicle_id,
    make: row.vehicle_make,
    model: row.vehicle_model,
    vin: row.vehicle_vin,
  },

  salesperson: row.salesperson_id
    ? {
        id: row.salesperson_id,
        full_name: row.salesperson_name,
      }
    : null,
}));

    return { success: true, data: mapped };

  } catch (error) {
    console.error("Get test drives error:", error);
    return { success: false, error: "Failed to fetch test drives" };
  }
}

/**
 * Fetch single test drive with relations
 * Used in /test-drives/[id]
 */
export async function getTestDriveById(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Test drive ID is required" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("test_drives")
      .select(`
        *,
        customer:customers (
          id,
          name,
          phone
        ),
        vehicle:vehicles (
          id,
          make,
          model,
          vin
        ),
        salesperson:users (
          id,
          full_name
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Get test drive by id error:", error);
    return { success: false, error: "Failed to fetch test drive" };
  }
}

/* ============================================================================
   Mutations
   ============================================================================ */

export async function createTestDrive(formData: unknown) {
  try {
    const validated = testDriveFormSchema.parse(formData);

    // Business rule: license must be valid
    if (validated.driver_license_expiry <= new Date()) {
      return {
        success: false,
        error: "Driver license is expired",
      };
    }
  console.log("formdata: ", formData);
  
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("test_drives")
      .insert({
        ...validated,
        salesperson_id: validated.salesperson_id ?? null,
        driver_license_image_url:
          validated.driver_license_image_url ?? null,
        signature_image_url:
          validated.signature_image_url ?? null,
        notes: validated.notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/test-drives");
    return { success: true, data };
  } catch (error) {
    console.error("Create test drive error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return { success: false, error: "Failed to create test drive" };
  }
}

export async function updateTestDrive(
  id: string,
  formData: unknown
) {
  try {
    console.log("hello ji");
    
    if (!id) {
      return { success: false, error: "Test drive ID is required" };
    }

    const validated = endTestDriveSchema.parse(formData);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("test_drives")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/test-drives");
    revalidatePath(`/test-drives/${id}`);

    return { success: true, data };
  } catch (error) {
    console.error("Update test drive error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return { success: false, error: "Failed to update test drive" };
  }
}

export async function deleteTestDrive(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Test drive ID is required" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("test_drives")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/test-drives");
    return { success: true };
  } catch (error) {
    console.error("Delete test drive error:", error);
    return { success: false, error: "Failed to delete test drive" };
  }
}




/**
 * PATCH test drive (partial update)
 * Used for:
 * - updating images
 * - editing notes
 * - correcting license info
 * - assigning salesperson later
 */
export async function patchTestDrive(
  id: string,
  formData: unknown
) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Test drive ID is required",
      };
    }

    const validated = patchTestDriveSchema.parse(formData);
    const supabase = await createClient();

    /* ---------------------------------------------
       Fetch existing start_time for validation
    ---------------------------------------------- */
    const { data: existing, error: fetchError } =
      await supabase
        .from("test_drives")
        .select("start_time")
        .eq("id", id)
        .single();

    if (fetchError || !existing) {
      return {
        success: false,
        error: "Test drive not found",
      };
    }

    /* ---------------------------------------------
       Business rule: end_time >= start_time
    ---------------------------------------------- */
    if (
      validated.end_time &&
      new Date(validated.end_time) <
        new Date(existing.start_time)
    ) {
      return {
        success: false,
        error: "Cannot end test drive before it starts",
      };
    }

    /* ---------------------------------------------
       Optional: license expiry check
    ---------------------------------------------- */
    if (
      validated.driver_license_expiry &&
      validated.driver_license_expiry <= new Date()
    ) {
      return {
        success: false,
        error: "Driver license is expired",
      };
    }

    /* ---------------------------------------------
       Update
    ---------------------------------------------- */
    const { data, error } = await supabase
      .from("test_drives")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        customer:customers (
          id,
          name,
          phone
        ),
        vehicle:vehicles (
          id,
          make,
          model,
          vin
        ),
        salesperson:users (
          id,
          full_name
        )
      `)
      .single();

    if (error) throw error;

    revalidatePath("/test-drives");
    revalidatePath(`/test-drives/${id}`);

    return { success: true, data };
  } catch (error: any) {
    console.error("Patch test drive error:", error);

    // fallback safety (DB constraint)
    if (error.code === "23514") {
      return {
        success: false,
        error: "Cannot end test drive before it starts",
      };
    }

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error: "Failed to update test drive",
    };
  }
}
