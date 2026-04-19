"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LeadStats } from "@/components/leads/Lead-stats";
import { LeadSource } from "@/components/leads/Lead-source";
import { LeadsTable } from "@/components/leads/Lead-table";
import { LeadsFilter } from "@/components/leads/Leads-filter";
import { useLeads } from "@/hooks/use-leads";
import { useDebounce } from "@/hooks/use-debounce";
import { Lead, LeadView } from "@/types/leads";



export default function LeadsPageClient() {
  const router = useRouter();


const [filters, setFilters] = useState({
  search: "",
  status: "all",
  source: "all",
});
 const debouncedSearch = useDebounce(filters.search, 400);

 const queryFilters = useMemo(() => ({
  search: debouncedSearch,
  status: filters.status,
  source: filters.source,
}), [debouncedSearch, filters.status, filters.source]);

const { data: leads = [], isFetching,  isLoading } = useLeads(queryFilters);





if (isLoading && leads.length === 0) {

    return (
      <div className="flex-1 space-y-8 p-8 animate-pulse">

      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded-md" />
          <div className="h-4 w-96 bg-muted rounded-md" />
        </div>

        <div className="h-10 w-40 bg-muted rounded-md" />
      </div>

      {/* Separator */}
      <div className="h-[1px] w-full bg-muted" />

      {/* --- Stats + Chart --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats skeleton */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted"
            />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="h-64 rounded-xl bg-muted" />
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-10 w-full md:w-64 bg-muted rounded-md" />
        <div className="h-10 w-full md:w-40 bg-muted rounded-md" />
        <div className="h-10 w-full md:w-40 bg-muted rounded-md" />
      </div>

      {/* --- Table --- */}
      <div className="border rounded-xl overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded-md" />
          ))}
        </div>

        {/* Table Rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 p-4 border-b last:border-none"
          >
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 bg-muted rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">
        {/* --- Header --- */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your sales pipeline and customer inquiries.
            </p>
          </div>

          <Button
            onClick={() => router.push("/leads/new")}
            size="lg"
            className="shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        </div>

        <Separator />

        {/* --- Stats & Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats take up 2/3 on large screens */}
            <div className="lg:col-span-2 space-y-8">
                <LeadStats leads={leads} />
            </div>
            
            {/* Chart takes up 1/3 */}
            <div className="lg:col-span-1">
                <LeadSource leads={leads} />
            </div>
        </div>

        {/* --- Main Table Section --- */}
        <div className="space-y-4">
         <LeadsFilter
  filters={filters}
  onChange={setFilters}
/>
{/* 👇 Background refetch indicator */}
  {isFetching && !isLoading && (
    <div className="text-xs text-muted-foreground animate-pulse">
      Updating results...
    </div>
  )}
            <LeadsTable leads={leads} />
        </div>
    </div>
  );
}


