"use server";

import { createClient } from "@/lib/supabase/server";
import { businessProfileSchema } from "@/types/businessProfile";
import type {
  BusinessProfile,
  BusinessProfileInput,
} from "@/types/businessProfile";

/**
 * Create Business Profile (usually only once)
 */
export async function createBusinessProfile(
  data: BusinessProfileInput
): Promise<{ profile?: BusinessProfile }> {
  const parsed = businessProfileSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid business profile data");
  }

  const supabase = await createClient();

  const {
    business_name,
    street_address,
    city,
    state,
    zip,
    phone,
    email,
    tax_id,
    dealer_license,
  } = parsed.data;

  const { data: insertedProfile, error } = await supabase
    .from("business_profile")
    .insert({
      business_name,
      street_address: street_address || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
      phone: phone || null,
      email: email || null,
      tax_id: tax_id || null,
      dealer_license: dealer_license || null,
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    throw new Error("Failed to create business profile");
  }

  return {
    profile: insertedProfile as BusinessProfile,
  };
}

/**
 * Get business profile
 */
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("business_profile")
      .select("*")
      .limit(1)
      .single();
  
    if (error) {
      console.log(error);
      return null;
    }
  
    return data as BusinessProfile;
  }

  /**
 * Update business profile
 */
export async function updateBusinessProfile(
    id: string,
    payload: BusinessProfileInput
  ): Promise<{ success: boolean; data?: BusinessProfile; error?: string }> {
  
    const parsed = businessProfileSchema.safeParse(payload);
  
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid business profile data",
      };
    }
  
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from("business_profile")
      .update({
        ...parsed.data,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();
  
    if (error || !data) {
      return {
        success: false,
        error: "Business profile update failed",
      };
    }
  
    return {
      success: true,
      data: data as BusinessProfile,
    };
  }

  /**
 * Delete business profile
 */
export async function deleteBusinessProfile(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
  
    const supabase = await createClient();
  
    const { error } = await supabase
      .from("business_profile")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error("Delete business profile error:", error);
  
      return {
        success: false,
        error: "Failed to delete business profile",
      };
    }
  
    return {
      success: true,
    };
  }