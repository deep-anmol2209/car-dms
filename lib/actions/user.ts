'use server';

import { revalidatePath } from 'next/cache';
import { userFormSchema, UserFormData, updateUserSchema } from '@/types/user';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import z from 'zod';
import { deleteFile, updateFile } from '@/helper/deleteImage';
import { requireRole } from '../auth/requiredRole';
import { PersonalProfileFormData } from "@/types/personalProfile";
import { getCurrentUser, getCurrentUserProfile } from './auth';

export async function getUsers({
  page = 1,
  limit = 10,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const supabase = await createClient();
    await requireRole(["Admin", "Manager"]);
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    console.log(
      "page:", safePage,
      "limit:", safeLimit,
      "search:", search,
      "from:", from,
      "to:", to
    );

    // 1️⃣ Start base query (NO order / NO range yet)
    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    // 2️⃣ Apply filtering FIRST
    if (search?.trim()) {
      const s = search.trim();

      query = query.or(
        `full_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`
      );
    }

    // 3️⃣ Apply ordering
    query = query.order("created_at", { ascending: false });

    // 4️⃣ Apply pagination LAST
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }

    return {
      success: true,
      data: data ?? [],
      pagination: {
        total: count ?? 0,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil((count ?? 0) / safeLimit),
      },
    };
  } catch (error) {
    console.error("Get users error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch users",
    };
  }
}

export async function getAssignableUsers() {
  try {
    const supabase = await createClient();

    // ensure user is logged in
    await requireRole(["Admin", "Manager", "Staff"]);

    const user = await getCurrentUserProfile();

    if (!user) {
      throw new Error("User not found");
    }

    let query = supabase
      .from("users")
      .select("id, full_name, email, role")
      .order("full_name", { ascending: true });

    // Role-based filtering
    if (user.role === "Staff") {
      query = query.eq("role", "Staff");
    }

    if (user.role === "Manager") {
      query = query.in("role", ["Staff", "Manager"]);
    }

    // Admin → no filter (gets all)

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching assignable users:", error);
      throw new Error("Failed to fetch users");
    }

    return {
      success: true,
      data: data ?? [],
    };
  } catch (error) {
    console.error("Get assignable users error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch assignable users",
    };
  }
}
export async function getUserById(id: string) {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  console.log("getuser: ",data);
  
    return { success: true, data };
  } catch (error) {
    console.error('Get user error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user' 
    };
  }
}

export async function createUser(formData: UserFormData) {
  try {
    // Validate input
    const validatedData = userFormSchema.parse(formData);
    
    const supabase = await createClient();
const adminClient = await supabaseAdmin;
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single();

    if (existingUser) {
      return { 
        success: false, 
        error: 'A user with this email already exists' 
      };
    }
    // 1️⃣ Invite user (AUTH)
const { data: inviteData, error: inviteError } =
  await adminClient.auth.admin.inviteUserByEmail(validatedData.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_UR}/confirm`,
    data: {full_name: validatedData.full_name, role: validatedData.role}});

if (inviteError || !inviteData.user) {
  console.log("inviteError: ",inviteError);
  
  throw new Error('Failed to invite user');
}
console.log("inviteUser: ",inviteData);

    // Create user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: inviteData?.user?.id,
        full_name: validatedData.full_name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        role: validatedData.role,
        avatar: validatedData.avatar ?? null,

        start_date: validatedData.start_date,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }

    revalidatePath('/users');
    return { success: true, data };
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0].message 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create user' 
    };
  }
}

export async function updateUser(
  id: string,
  formData: Partial<UserFormData>
) {
  try {
    if (!id) throw new Error("User ID is required");

    const validatedData = updateUserSchema.parse(formData);
    const supabase = await createClient();

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingUser) {
      return { success: false, error: "User not found" };
    }

    // Email uniqueness check
    if (validatedData.email) {
      const { data: existingEmail } = await supabase
        .from("users")
        .select("id")
        .eq("email", validatedData.email)
        .neq("id", id)
        .maybeSingle();

      if (existingEmail) {
        return {
          success: false,
          error: "A user with this email already exists",
        };
      }
    }

    const oldAvatar = existingUser.avatar;

    // -----------------------
    // 1️⃣ Update DB FIRST
    // -----------------------
    const { data, error } = await supabase
      .from("users")
      .update({
        ...(validatedData.full_name !== undefined && {
          full_name: validatedData.full_name,
        }),
        ...(validatedData.email !== undefined && {
          email: validatedData.email,
        }),
        ...(validatedData.phone !== undefined && {
          phone: validatedData.phone || null,
        }),
        ...(validatedData.role !== undefined && {
          role: validatedData.role,
        }),
        ...(validatedData.avatar !== undefined && {
          avatar: validatedData.avatar ?? null,
        }),
        ...(validatedData.start_date !== undefined && {
          start_date: validatedData.start_date,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // -----------------------
    // 2️⃣ AFTER DB SUCCESS → Handle Image Deletion
    // -----------------------

    // Case A: Avatar replaced
    if (
      validatedData.avatar &&
      oldAvatar?.fileId &&
      validatedData.avatar.fileId !== oldAvatar.fileId
    ) {
      await deleteFile(oldAvatar.fileId);
    }

    // Case B: Avatar removed
    if (
      validatedData.avatar === null &&
      oldAvatar?.fileId
    ) {
      await deleteFile(oldAvatar.fileId);
    }

    revalidatePath("/users");

    return { success: true, data };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update user",
    };
  }
}


export async function deleteUser(id: string) {
  try {
    if (!id) {
      throw new Error('User ID is required');
    }

    const supabase = await createClient();
 const { data: avatar, error: fetchError } = await supabase
      .from("users")
      .select("avatar")
      .eq("id", id)
      .single();
      if (fetchError) {
      console.error("[DELETE_USER_FETCH]", fetchError);
      return { success: false, error: "User not found" };
    }
if(avatar){
  console.log(avatar);
  
  const fileId :string = JSON.parse(avatar.avatar.fileId);
   if (fileId) {
    const deleteResult = await deleteFile(fileId);
  
    if (!deleteResult.success) {
      return {
        success: false,
        error: deleteResult.error ?? "Failed to delete images",
      };
    }
  }

}
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete user' 
    };
  }
}





export async function updateCurrentUserProfile(data: PersonalProfileFormData) {

  const supabase = await createClient();

  /* Get logged in user */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  /* Update user table */
  const { data: updatedUser, error } = await supabase
    .from("users")
    .update({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
     
      avatar: data.avatar || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.log(error);
    
    throw new Error(error.message);
  }
console.log(data);

  return updatedUser;
}