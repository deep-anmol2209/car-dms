// app/providers.tsx
"use client";

import { QueryProvider } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";
import { ImageKitProvider } from "@imagekit/next";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ImageKitProvider
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
        >
          {children}
        </ImageKitProvider>
      </AuthProvider>
      <Toaster position="top-right" />
    </QueryProvider>
  );
}
