"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  value?: string | number;
  footer?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function AppCard({
  title,
  description,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
  value,
  footer,
  action,
  children,
  className = "",
}: AppCardProps) {
  return (
    <Card className={`border border-border/50 shadow-sm hover:shadow-md transition-all ${className}`}>
      
      {(title || Icon || action) && (
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          
          {/* LEFT SIDE → Title */}
          {title && (
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          )}

          {/* RIGHT SIDE → Icon or Action */}
          {Icon ? (
            <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          ) : (
            action
          )}
        </CardHeader>
      )}

      <CardContent>
        {value !== undefined && (
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
        )}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}

        {children}
      </CardContent>

      {footer && <div className="px-6 pb-4">{footer}</div>}
    </Card>
  );
}
