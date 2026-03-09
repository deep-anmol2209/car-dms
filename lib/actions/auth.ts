'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { getUserById } from './user';

/* ============================================================================
   VALIDATION
============================================================================ */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginPayload = z.infer<typeof loginSchema>;

/* ============================================================================
   LOGIN
============================================================================ */
export async function login(payload: LoginPayload) {
  loginSchema.parse(payload);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  
const user =await getUserById(data.user.id);

  return {data,user};
}

/* ============================================================================
   SIGN UP (STAFF / ADMIN CREATION)
============================================================================ */
export async function signup(
  payload: LoginPayload & {
    full_name: string;
    role: 'Admin' | 'Manager' | 'Staff';
  }
) {
  const supabase = await createClient();

  // 1️⃣ Create auth user
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? 'Signup failed');
  }

  // 2️⃣ Create profile in users table
  const { error: profileError } = await supabase
    .from('users')
    .insert({
      id: data.user.id,
      email: payload.email,
      full_name: payload.full_name,
      role: payload.role,
      start_date: new Date().toISOString(),
    });

  if (profileError) {
    throw new Error('Failed to create user profile');
  }

  return data.user;
}

/* ============================================================================
   CURRENT USER
============================================================================ */
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

/* ============================================================================
   USER PROFILE
============================================================================ */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return data ?? null;
}

/* ============================================================================
   LOGOUT
============================================================================ */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function confirmInvite(password: string) {
const supabase = await createClient();

const {data,error} = await supabase.auth.updateUser({
  password,
});

if(error){
  throw new Error(error.message);
}

return {data,error};
}
  