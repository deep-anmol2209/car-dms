// "use client";

// import { Search } from "lucide-react";

// interface LeadsFiltersProps {
//   searchTerm: string;
//   onSearchChange: (value: string) => void;
//   statusFilter: string;
//   onStatusChange: (value: string) => void;
//   sourceFilter: string;
//   onSourceChange: (value: string) => void;
// }

// export function LeadsFilters({
//   searchTerm,
//   onSearchChange,
//   statusFilter,
//   onStatusChange,
//   sourceFilter,
//   onSourceChange,
// }: LeadsFiltersProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//       {/* Search */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//         <input
//           className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
//           placeholder="Search notes..."
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>

//       {/* Status */}
//       <select
//         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
//         value={statusFilter}
//         onChange={(e) => onStatusChange(e.target.value)}
//       >
//         <option value="">All Statuses</option>
//         <option value="Not Started">Not Started</option>
//         <option value="In Progress">In Progress</option>
//         <option value="Qualified">Qualified</option>
//         <option value="Closed">Closed</option>
//         <option value="Lost">Lost</option>
//       </select>

//       {/* Source */}
//       <select
//         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
//         value={sourceFilter}
//         onChange={(e) => onSourceChange(e.target.value)}
//       >
//         <option value="">All Sources</option>
//         <option value="Craigslist">Craigslist</option>
//         <option value="Kijiji">Kijiji</option>
//         <option value="Website">Website</option>
//         <option value="Text Us">Text Us</option>
//         <option value="Referral">Referral</option>
//         <option value="Other">Other</option>
//       </select>
//     </div>
//   );
// }
"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Filters {
  search: string;
  status: string;
  source: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function LeadsFilter({ filters, onChange }: Props) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <CardTitle>Filter Leads</CardTitle>
        <CardDescription>Search and narrow down your lead list.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              placeholder="Search customer name or notes..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Status Select */}
          <Select
            value={filters.status}
            onValueChange={(value) => onChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          {/* Source Select */}
          <Select
            value={filters.source}
            onValueChange={(value) => onChange({ ...filters, source: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="Craigslist">Craigslist</SelectItem>
              <SelectItem value="Kijiji">Kijiji</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Walk-in">Walk-in</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}