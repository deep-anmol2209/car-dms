"use server";

import { deleteFiles } from "@/helper/deleteImage";
import { createClient } from "@/lib/supabase/server";
import { vehicleSchema } from "@/types/inventory";
import type { VehicleFormData, Vehicle } from "@/types/inventory";
import { revalidatePath } from "next/cache";

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */
interface GetVehiclesParams {
  search?: string;
  status?: string;
  make?: string;
  year?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface GetVehiclesResponse {
  data: Vehicle[];
  total: number;
}

export async function getVehicles(
  params: GetVehiclesParams
): Promise<GetVehiclesResponse> {
  const supabase = await createClient();

  const {
    search = "",
    status,
    year,
    make,
    page = 1,
    limit = 10,
    sort = "created_at_desc",
  } = params;

  try {
    let query = supabase
      .from("vehicles")
      .select("*", { count: "exact" });

    /* ------------------------------------------------------------------ */
    /* SEARCH (Global search across multiple fields)                      */
    /* ------------------------------------------------------------------ */
    if (search?.trim()) {
      const safeSearch = search.trim();

      query = query.or(
        [
          `vin.ilike.%${safeSearch}%`,
          `stock_number.ilike.%${safeSearch}%`,
          `make.ilike.%${safeSearch}%`,
          `model.ilike.%${safeSearch}%`,
          `trim.ilike.%${safeSearch}%`,
          `status.ilike.%${safeSearch}%`,
          `year.ilike.%${safeSearch}%`
        ].join(",")
      );
    }

    /* ------------------------------------------------------------------ */
    /* STATUS FILTER (Skip if "all")                                      */
    /* ------------------------------------------------------------------ */
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    /* ------------------------------------------------------------------ */
    /* MAKE FILTER                                                        */
    /* ------------------------------------------------------------------ */
    if (make && make !== "all") {
      query = query.eq("make", make);
    }
/* --------------------------- YEAR FILTER --------------------------- */
if (year) {
  query = query.eq("year", year);
}

    /* ------------------------------------------------------------------ */
    /* SORTING                                                            */
    /* ------------------------------------------------------------------ */
    let sortField = "created_at";
    let ascending = false;

    if (sort.includes("_")) {
      const lastUnderscoreIndex = sort.lastIndexOf("_");
      sortField = sort.substring(0, lastUnderscoreIndex);
      const sortDirection = sort.substring(lastUnderscoreIndex + 1);
      ascending = sortDirection === "asc";
    }

    query = query.order(sortField, { ascending });

    /* ------------------------------------------------------------------ */
    /* PAGINATION                                                         */
    /* ------------------------------------------------------------------ */
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message || "Failed to fetch vehicles");
    }

    return {
      data: (data as Vehicle[]) || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("getVehicles error:", error);
    return { data: [], total: 0 };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   GET BY ID                                */
/* -------------------------------------------------------------------------- */

export async function getVehicleById(id: string) {
  const supabase = await createClient();
  try {
    if (!id) {
      return { success: false, error: "Vehicle ID is required" };
    }
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { success: false, error: "Vehicle not found" };
    }

    return { success: true, data: data as Vehicle };
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return { success: false, error: "Failed to fetch vehicle" };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export async function createVehicle(
  data: VehicleFormData
): Promise<Vehicle> {
  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid vehicle data");
  }

  const supabase = await createClient();

  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .insert({
      vin: parsed.data.vin,
      year: parsed.data.year,
      make: parsed.data.make,
      model: parsed.data.model,
      trim: parsed.data.trim ?? null,
      odometer: parsed.data.odometer ?? null,
      stock_number: parsed.data.stock_number ?? null,
      condition: parsed.data.condition,
      status: parsed.data.status,
      purchase_price: parsed.data.purchase_price,
      retail_price: parsed.data.retail_price,
      extra_costs: parsed.data.extra_costs,
      taxes: parsed.data.taxes,
      image_gallery: parsed.data.image_gallery ?? [],
    })
    .select()
    .single();

  if (error || !vehicle) {
    console.log(error);

    throw new Error("Failed to create vehicle");
  }

  return vehicle as Vehicle;
}

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export async function updateVehicle(
  id: string,
  data: Partial<VehicleFormData>
) {
  try {
    if (!id) throw new Error("Vehicle ID is required");

    const parsed = vehicleSchema.partial().safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid vehicle data" };
    }

    const validatedData = parsed.data;
    const supabase = await createClient();

    // -----------------------
    // 1️⃣ Fetch existing vehicle
    // -----------------------
    const { data: existingVehicle, error: fetchError } =
      await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

    if (fetchError || !existingVehicle) {
      return { success: false, error: "Vehicle not found" };
    }

    const oldImages = existingVehicle.image_gallery || [];
    const newImages = validatedData.image_gallery ?? oldImages;

    // -----------------------
    // 2️⃣ Update DB FIRST
    // -----------------------
    const { data: updatedVehicle, error } = await supabase
      .from("vehicles")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // -----------------------
    // 3️⃣ AFTER DB SUCCESS → Delete removed images
    // -----------------------

    const oldFileIds = oldImages.map((img: any) => img.fileId);
    const newFileIds = newImages.map((img: any) => img.fileId);

    // Find removed images
    const removedFileIds = oldFileIds.filter(
      (fileId: string) => !newFileIds.includes(fileId)
    );

    if (removedFileIds.length > 0) {
      await deleteFiles(removedFileIds);
    }

    revalidatePath("/inventory");

    return { success: true, data: updatedVehicle };

  } catch (error) {
    console.error("Error updating vehicle:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update vehicle",
    };
  }
}
/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function deleteVehicle(
  id: string
): Promise<{ success: true | false; error?: string }> {
  const supabase = await createClient();

  try {
    /* ------------------------------------------------------------
       1. Fetch Image Gallery
    ------------------------------------------------------------- */
    const { data: vehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("image_gallery")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("[DELETE_VEHICLE_FETCH]", fetchError);
      return { success: false, error: "Vehicle not found" };
    }

    /* ------------------------------------------------------------
       2. Extract File IDs (image_gallery is TEXT[])
    ------------------------------------------------------------- */
    const fileIds: string[] =
      vehicle?.image_gallery
        ?.map((img: string) => {
          try {
            const parsed = JSON.parse(img);
            return parsed.fileId;
          } catch {
            return null;
          }
        })
        .filter((id: any): id is string => !!id) ?? [];

    /* ------------------------------------------------------------
       3. Delete Files from ImageKit (if any)
    ------------------------------------------------------------- */
 if (fileIds.length > 0) {
  const deleteResult = await deleteFiles(fileIds);

  if (!deleteResult.success) {
    return {
      success: false,
      error: deleteResult.error ?? "Failed to delete images",
    };
  }
}
    /* ------------------------------------------------------------
       4. Delete Vehicle Record
    ------------------------------------------------------------- */
    const { error: deleteError } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[DELETE_VEHICLE_DB]", deleteError);
      return {
        success: false,
        error: deleteError.message || "Failed to delete vehicle",
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[DELETE_VEHICLE_FATAL]", err);
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
}

export async function getInventoryAnalytics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("inventory_analytics");

  if (error) throw error;

  return data;
}
