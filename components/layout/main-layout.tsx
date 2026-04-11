"use client";

import { Sidebar } from "./sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // <div className="flex h-screen overflow-hidden bg-background">
    <div className="flex h-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-in fade-in slide-in-from-bottom">
          {children}
        </div>
      </main>
    </div>
  );
}
