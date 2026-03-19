"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";

type Props = {
  allowed: string[];
  children: React.ReactNode;
};

export function RoleGuard({ allowed, children }: Props) {
  const router = useRouter();
  const user = useAuth();
  const role = user?.role;

  useEffect(() => {
    if (role && !allowed.includes(role)) {
      router.replace("/unauthorized");
    }
  }, [role, allowed, router]);

  // Loading state
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
       
      </div>
    );
  }

  // Unauthorized
  if (!allowed.includes(role ?? "")) return null;

  return <>{children}</>;
}