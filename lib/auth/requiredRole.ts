import { createClient } from "@/lib/supabase/server";

export async function requireRole(allowedRoles: string[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }


  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
// console.log(profile);

  if (!profile || !allowedRoles.includes(profile.role)) {
    throw new Error("Forbidden");
  }

  return user;
}