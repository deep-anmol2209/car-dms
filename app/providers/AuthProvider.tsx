// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useQueryClient } from "@tanstack/react-query";

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const supabase = createClient();
//     const { data: subscription } =
//       supabase.auth.onAuthStateChange((_event, session) => {
//         if (!session) {
//           // 🔥 clear all cached protected data
//           queryClient.clear();

//           // 🚪 redirect to login
//           router.replace("/login");
//         }
//       });

//     return () => {
//       subscription.subscription.unsubscribe();
//     };
//   }, [queryClient, router]);

//   return <>{children}</>;
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, AuthUser } from "@/contexts/authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }
    

      const { data } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", session.user.id)
        .single();

      setUser({
        role: data?.role,
        full_name: data?.full_name,
        email: session.user.email,
      });

      setLoading(false)
    };

    getSession();

    const { data: subscription } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          queryClient.clear();
          // router.replace("/login");
        }
      });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [queryClient, router]);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}