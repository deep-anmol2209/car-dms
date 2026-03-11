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



  // const filteredLeads = leads.filter((lead) => {
  //   const matchesSearch =
  //     filters.search === "" ||
  //     lead.notes?.toLowerCase().includes(filters.search.toLowerCase()) ||
  //     lead.customer?.name?.toLowerCase().includes(filters.search.toLowerCase()); // Assumed customer.name based on table

  //   const matchesStatus =
  //     filters.status === "all" || lead.status === filters.status;

  //   const matchesSource =
  //     filters.source === "all" || lead.source === filters.source;

  //   return matchesSearch && matchesStatus && matchesSource;
  // });

if (isLoading && leads.length === 0) {

    return (
      <div className="flex h-[50vh] items-center justify-center">
         <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading leads...</p>
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


// export function mapLeadToView(lead: Lead): LeadView {
//   return {
//     ...lead,
//     customer: lead.customer?.name ?? "Unknown",
//     interest_vehicle: lead.vehicle?.model ?? "N/A",
//   };
// }