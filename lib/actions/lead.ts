"use server";

import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadFormData } from "@/types/leads";

/* -------------------------------------------------------------------------- */
/*                                   FETCH                                    */
/* -------------------------------------------------------------------------- */

interface GetLeadsParams {
  search?: string;
  status?: string;
  source?: string;
}

type LeadFilters = {
  search?: string;
  status?: string;
  source?: string;
};

// export async function getLeads(filters: LeadFilters = {}) {
//   const supabase = await createClient();

//   const {
//     search = "",
//     status = "",
//     source = "",
//   } = filters;

//   let query = supabase
//     .from("leads")
//     .select(`
//       id,
//       status,
//       source,
//       notes,
//       updated_at,
//       created_at,

//       customer:customers!inner (
//         id,
//         name,
//         phone,
//         email
//       ),

//       interest_vehicle:vehicles (
//         id,
//         model,
//         make,
//         year
//       ),

//       assigned_to:users (
//         id,
//         full_name,
//         email
//       )
//     `)
//     .order("created_at", { ascending: false });

//   /* ---------------- SEARCH ---------------- */
//   let query = supabase
//     .from("leads_search")   // ✅ use the view
//     .select("*")
//     .order("created_at", { ascending: false });

//   /* ---------------- SEARCH ---------------- */
//   if (typeof search === "string" && search.trim().length > 0) {
//     const safe = search.trim().replace(/[%_]/g, "\\$&");

//     query = query.or(
//       `
//       notes.ilike.%${safe}%,
//       customer_name.ilike.%${safe}%,
//       vehicle_make.ilike.%${safe}%
//       `.replace(/\s+/g, "") // remove newlines/spaces
//     );
//   }

//   /* ---------------- STATUS ---------------- */
//   if (status && status !== "all") {
//     query = query.eq("status", status);
//   }

//   /* ---------------- SOURCE ---------------- */
//   if (source && source !== "all") {
//     query = query.eq("source", source);
//   }

//   const { data, error } = await query;

//   if (error) throw new Error(error.message);

//   return data;
// }
export async function getLeads(filters: LeadFilters = {}) {
  const supabase = await createClient();

  const { search = "", status = "", source = "" } = filters;

  let query = supabase
    .from("leads_search")
    .select("*")
    .order("created_at", { ascending: false });

  if (typeof search === "string" && search.trim().length > 0) {
    const safe = search.trim().replace(/[%_]/g, "\\$&");

    query = query.or(
      `notes.ilike.%${safe}%,customer_name.ilike.%${safe}%,vehicle_make.ilike.%${safe}%`
    );
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (source && source !== "all") {
    query = query.eq("source", source);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // 🔥 Transform flat view into LeadView structure
  const transformed = data.map((row) => ({
    id: row.id,
    status: row.status,
    source: row.source,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,

    customer: {
      id: row.customer_id,
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
    },

    interest_vehicle: row.vehicle_make
      ? {
          id: row.interest_vehicle_id,
          make: row.vehicle_make,
          model: row.vehicle_model,
        }
      : null,

    assigned_to: row.assigned_to
      ? {
          id: row.assigned_to,
          full_name: row.assigned_name,
          email: row.assigned_email,
        }
      : null,
  }));

  return transformed;
}


/* -------------------------------------------------------------------------- */
/*                                  CREATE                                    */
/* -------------------------------------------------------------------------- */

export async function addLead(
  body: LeadFormData
): Promise<Lead> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      customer_id: body.customer_id ?? null,
      source: body.source,
      status: body.status,
      interest_vehicle_id: body.interest_vehicle_id ?? null,
      assigned_to: body.assigned_to ?? null,
      notes: body.notes ?? null,
      lead_creation_date: new Date().toISOString(),
      last_engagement: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Lead;
}

/* -------------------------------------------------------------------------- */
/*                                  UPDATE                                    */
/* -------------------------------------------------------------------------- */

export async function updateLeadAction(
  id: string,
  data: Partial<LeadFormData>
): Promise<Lead> {
  const supabase = await createClient();

  const { data: updated, error } = await supabase
    .from("leads")
    .update({
      ...data,
      last_engagement: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updated as Lead;
}

/* -------------------------------------------------------------------------- */
/*                                  DELETE                                    */
/* -------------------------------------------------------------------------- */

export async function deleteLeadAction(
  id: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}


export async function getLeadById(
  id: string
) {
  if (!id) {
    throw new Error("Lead id is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      status,
      source,
      notes,
      updated_at,
      created_at,

      customer:customers (
        id,
        name,
        phone,
        email
      ),

      interest_vehicle:vehicles (
        id,
        model,
        make
      ),

      assigned_to:users (
        id,
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
