"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { customerSchema } from "@/types/customers";
import type { Customer, CustomerFormData } from "@/types/customers";
import { error } from "console";

/**
 * Create a new customer with basic duplicate detection
 */
export async function addCustomer(
  data: CustomerFormData
): Promise<{ customer?: Customer; duplicates?: Customer[] }> {
  // 1. Validate input again on server (VERY IMPORTANT)
  const parsed = customerSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid customer data");
  }

  const supabase = await createClient();

  const { name, phone, email, address, city, province, postal_code, notes } =
    parsed.data;

  // 2. Check for potential duplicates
  const { data: duplicateCandidates, error: duplicateError } = await supabase
    .from("customers")
    .select("*")
    .or(
      [
        phone ? `phone.eq.${phone}` : null,
        email ? `email.eq.${email}` : null,
        `name.ilike.%${name}%`,
      ]
        .filter(Boolean)
        .join(",")
    );

  if (duplicateError) {
    throw new Error("Failed to check duplicate customers");
  }

  const hasDuplicates = duplicateCandidates && duplicateCandidates.length > 0;

  // 3. Insert customer
  const { data: insertedCustomer, error: insertError } = await supabase
    .from("customers")
    .insert({
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
      province: province || null,
      postal_code: postal_code || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (insertError) {
    console.log(insertError);
    
    throw new Error("Failed to create customer");
  }

  return {
    customer: insertedCustomer as Customer,
    duplicates: hasDuplicates ? (duplicateCandidates as Customer[]) : [],
  };
}

/**
 * Fetch all customers (used for listing & search)
 */
export async function getCustomers({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error("Failed to fetch customers");
  }

  return {
    data,
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}


export async function getCustomerById(id: string): Promise<Customer> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Customer;
}


export async function updateCustomer(
  id: string,
  customer: CustomerFormData
): Promise<{ success: boolean; data?: any; error?: string }> {

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .update({
      name: customer.name,
      phone: customer.phone || null,
      email: customer.email || null,
      address: customer.address || null,
      city: customer.city || null,
      province: customer.province || null,
      postal_code: customer.postal_code || null,
      notes: customer.notes || null,
      updated_at: new Date()
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: "Customer not found or update failed"
    };
  }

  return {
    success: true,
    data
  };
}

export async function deleteCustomerById(
  id: string
): Promise<{ success: boolean; error?: string }> {

  const supabase = await createClient();

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete customer error:", error);

    return {
      success: false,
      error: "Failed to delete customer",
    };
  }

  return {
    success: true,
  };
}