import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import {Providers} from "@/app/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Adaptus DMS",
    default: "Adaptus DMS - Dealer Management System",
  },
  description: "Comprehensive Dealer Management System for vehicle inventory, sales, CRM, and financials",
  keywords: ["DMS", "Dealer Management", "Vehicle Inventory", "CRM", "Automotive"],
  authors: [{ name: "Adaptus DMS" }],
  creator: "Adaptus DMS",
  publisher: "Adaptus DMS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Adaptus DMS",
    title: "Adaptus DMS - Dealer Management System",
    description: "Comprehensive DMS for vehicle inventory, sales, CRM, and financials",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
     <body className={`${inter.className} h-screen overflow-hidden`}>
        <Providers>

      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
         
          {children}
        
        </ThemeProvider>

        </Providers>
  
      </body>
    </html>
  );
}
