// app/providers.tsx
"use client";

import { ImageKitProvider } from "@imagekit/next";


export function ImagekitProvider({ children }: { children: React.ReactNode }) {
  return (
  
      <ImageKitProvider
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
      >
        {children}
      </ImageKitProvider>
   
  );
}
