"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { LEAD_STATUSES, LeadStatus } from "@/types/leads";

const STATUS_COLORS: Record<LeadStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-700 border-slate-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Qualified: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Closed: "bg-violet-100 text-violet-700 border-violet-200",
  Lost: "bg-rose-100 text-rose-700 border-rose-200",
};

interface Props {
  value: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

export function LeadStatusCell({ value, onChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-auto hover:bg-transparent"
        >
          <Badge
            variant="outline"
            className={`cursor-pointer rounded-full transition hover:opacity-80 ${STATUS_COLORS[value]}`}
          >
            {value}
          </Badge>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-44">
        {LEAD_STATUSES.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onChange(status)}
            className="flex items-center gap-2"
          >
            {status === value && (
              <Check className="h-4 w-4 text-green-600" />
            )}
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
