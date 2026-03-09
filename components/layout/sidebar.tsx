"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { useAuth } from "@/contexts/authContext";
import { useLogout } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  TestTube,
  Receipt,
  BarChart3,
  Share2,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// const navigationSections = [
//   {
//     title: "Main",
//     items: [
//       { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//       { name: "Inventory", href: "/inventory", icon: Car },
//       { name: "Leads", href: "/leads", icon: Users },
//     ],
//   },
//   {
//     title: "Management",
//     items: [
//       { name: "Test Drives", href: "/testdrives", icon: TestTube },
//       { name: "Customers", href: "/customers", icon: Users },
//       { name: "Invoices", href: "/invoices", icon: Receipt },
//       { name: "Reports", href: "/reports", icon: BarChart3 },
//     ],
//   },
//   {
//     title: "System",
//     items: [
//       { name: "Social Posting", href: "/social", icon: Share2 },
//       { name: "API Testing", href: "/api-testing", icon: FlaskConical },
//       { name: "Users", href: "/users", icon: UserCog },
//       { name: "Settings", href: "/settings", icon: Settings },
//     ],
//   },
// ];
const navigationSections = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Inventory", href: "/inventory", icon: Car },
      { name: "Leads", href: "/leads", icon: Users },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Test Drives", href: "/testdrives", icon: TestTube },
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Invoices", href: "/invoices", icon: Receipt },
      { name: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Social Posting", href: "/social", icon: Share2 },
      { name: "API Testing", href: "/api-testing", icon: FlaskConical },

      { name: "Users", href: "/users", icon: UserCog, roles: ["Admin"] },
      { name: "Settings", href: "/settings", icon: Settings, roles: ["Admin"] },
    ],
  },
];
export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuth();
  const role = user?.role
  const router = useRouter();
const logout = useLogout();
  return (
    <div
      className={cn(
        "flex h-full flex-col bg-gradient-to-b from-card via-card to-card/95 border-r border-border/50 shadow-elevated transition-all-smooth relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo/Branding */}
      {/* Logo/Branding */}
      <div className="flex h-16 items-center border-b border-border/50 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />

        {/* Brand */}
        <div className={cn("flex items-center gap-2 relative z-10 transition-all duration-300 w-full", isCollapsed ? "justify-center" : "")}>
          <Logo showText={!isCollapsed} />
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in duration-300 delay-100 overflow-hidden whitespace-nowrap">
              <span className="text-sm font-bold gradient-text">Adaptus</span>
              <span className="text-xs text-muted-foreground">DMS</span>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full",
          "bg-gradient-primary text-primary-foreground shadow-glow",
          "hover:scale-110 transition-all-smooth hover:shadow-glow",
          "border border-primary-foreground/20"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-6 overflow-y-auto overflow-x-hidden">
        {navigationSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            {section.items.filter((item) => !item.roles || item.roles.includes(role || "")).map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all-smooth relative group overflow-hidden",
                    isCollapsed ? "justify-center" : "",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Hover gradient effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full animate-in slide-in-from-left" />
                  )}

                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200 relative z-10",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="relative z-10 truncate">{item.name}</span>
                  )}

                  {/* Glow effect on hover */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      {/* Footer: User Profile & Theme Toggle */}
      <div
        className={cn(
          "border-t border-border/50 p-4 bg-gradient-to-t from-primary/5 to-transparent flex flex-col gap-3",
          isCollapsed && "px-2 items-center"
        )}
      >
   <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 hover:bg-accent/10 transition-all-smooth cursor-pointer group w-full",
        isCollapsed && "justify-center p-0"
      )}
    >
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-glow shrink-0">
       {user?.full_name?.charAt(0)}
      </div>

      {!isCollapsed && (
        <div className="flex-1 min-w-0 animate-in fade-in duration-300">
          <p className="text-sm font-medium truncate">{user?.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">
           {user?.email}
          </p>
        </div>
      )}
    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuItem
    >
      Profile
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      className="text-red-600 focus:text-red-600 focus:bg-red-50"
    onClick={() => {
       logout.mutate();
      
    }}>
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between px-2")}>
          {!isCollapsed && <span className="text-xs font-medium text-muted-foreground animate-in fade-in">Theme</span>}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
