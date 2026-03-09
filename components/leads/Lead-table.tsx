// import React, { useState, ChangeEvent } from 'react';
// import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// // 1. Define the Lead Interface
// interface Lead {
//   id: string | number;
//   status: 'Qualified' | 'In Progress' | 'Not Started' | 'Closed' | 'Lost';
//   source: string;
//   notes?: string;
//   lead_creation_date: string | Date;
// }

// // 2. Define Props Interface
// interface ModernLeadTableProps {
//     lead: Lead[];
//   filteredLeads: Lead[];
//   searchTerm: string;
//   setSearchTerm: (value: string) => void;
//   statusFilter: string;
//   setStatusFilter: (value: string) => void;
//   sourceFilter: string;
//   setSourceFilter: (value: string) => void;
// }

// const ModernLeadTable: React.FC<ModernLeadTableProps> = ({
//   leads,
//   searchTerm,
//   setSearchTerm,
//   statusFilter,
//   setStatusFilter,
//   sourceFilter,
//   setSourceFilter,
// }) => {
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const leadsPerPage = 10;

//   // Type-safe status color mapping
//   const statusColors: Record<Lead['status'], string> = {
//     "Qualified": "bg-emerald-100 text-emerald-700 border-emerald-200",
//     "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
//     "Not Started": "bg-slate-100 text-slate-700 border-slate-200",
//     "Closed": "bg-purple-100 text-purple-700 border-purple-200",
//     "Lost": "bg-red-100 text-red-700 border-red-200",
//   };

//   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setStatusFilter(e.target.value);
//   };

//   const handleSourceChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setSourceFilter(e.target.value);
//   };

//   return (
//     <div className="space-y-6 p-4 bg-slate-50/50 min-h-screen font-sans">

//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-900">Lead Management</h1>
//           <p className="text-sm text-slate-500">Manage and track your incoming prospects.</p>
//         </div>
//         <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm font-medium">
//           <span>+ Add Lead</span>
//         </button>
//       </div>

//       {/* Filter Bar */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//         <div className="relative group">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//           <input
//             className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-sm"
//             placeholder="Search leads..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>

//         <select 
//           className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm appearance-none cursor-pointer"
//           value={statusFilter}
//           onChange={handleStatusChange}
//         >
//           <option value="">All Statuses</option>
//           <option value="Not Started">Not Started</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Qualified">Qualified</option>
//         </select>

//         <select 
//           className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm appearance-none cursor-pointer"
//           value={sourceFilter}
//           onChange={handleSourceChange}
//         >
//           <option value="">All Sources</option>
//           <option value="Website">Website</option>
//           <option value="Referral">Referral</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>

//       {/* Responsive Table Container */}
//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200"> 
//           <table className="w-full text-left border-collapse min-w-[700px]">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-200">
//                 <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Lead Info</th>
//                 <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
//                 <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Source</th>
//                 <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Created At</th>
//                 <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {leads.length > 0 ? (
//                 leads.map((lead) => (
//                   <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-slate-900 leading-tight">Lead #{lead.id}</span>
//                         <span className="text-xs text-slate-400 truncate max-w-[200px]">
//                           {lead.notes || 'No additional notes'}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
//                         {lead.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-600 font-medium">
//                       {lead.source}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-500">
//                       {new Date(lead.lead_creation_date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button 
//                         title="View Details"
//                         className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
//                     <div className="flex flex-col items-center gap-2">

//                       <p>No leads match your current filters.</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-sm text-slate-500">
//             Showing <span className="font-medium text-slate-700">1</span> to <span className="font-medium text-slate-700">
//               {Math.min(leadsPerPage, leads?.length)}
//             </span> of <span className="font-medium text-slate-700">{leads?.length}</span> results
//           </p>
//           <div className="flex items-center gap-2">
//             <button 
//               disabled={currentPage === 1}
//               className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft className="h-4 w-4 text-slate-600" />
//             </button>
//             <div className="flex gap-1">
//               {[1, 2, 3].map((page) => (
//                 <button
//                   key={page}
//                   className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
//                     currentPage === page 
//                     ? "bg-indigo-50 text-indigo-600 border border-indigo-200" 
//                     : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>
//             <button className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
//               <ChevronRight className="h-4 w-4 text-slate-600" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModernLeadTable;

"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useUpdateLead } from "@/hooks/use-leads";
import { LeadStatus } from "@/types/leads";
import { LeadView } from "@/types/leads";
import { LeadStatusCell } from "./lead-status-cell"; // Assuming this exists

interface LeadsTableProps {
  leads: LeadView[];
}

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const updateLeadMutation = useUpdateLead();
  const router = useRouter();

  const totalPages = Math.ceil(leads.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentLeads = leads.slice(startIndex, endIndex);

  const handleView = (id: string) => {
    router.push(`/leads/${id}`);
  };

  const handleChangeStatus = (id: string, status: LeadStatus) => {
    updateLeadMutation.mutate({
      id,
      data: { status },
    });
  };

  return (
    <Card className="shadow-sm border-border/60 overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[180px]">Status</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle Interest</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/50">

                  {/* Status */}
                  <TableCell>
                    <LeadStatusCell
                      value={lead.status}
                      onChange={(status: LeadStatus) =>
                        handleChangeStatus(lead.id, status)
                      }
                    />
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {lead.customer.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lead.customer.phone}
                      </span>
                    </div>
                  </TableCell>

                  {/* Vehicle */}
                  <TableCell>
                     {lead.interest_vehicle ? (
                         <div className="font-medium">
                            {lead.interest_vehicle.year} {lead.interest_vehicle.make} {lead.interest_vehicle.model}
                         </div>
                     ) : (
                         <span className="text-muted-foreground italic">General Inquiry</span>
                     )}
                  </TableCell>

                  {/* Source */}
                  <TableCell>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {lead.source}
                    </div>
                  </TableCell>

                  {/* Assigned */}
                  <TableCell>
                    {lead.assigned_to ? (
                      <span className="text-sm">
                        {lead.assigned_to.full_name}
                      </span>
                    ) : (
                      <span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded font-medium">
                        Unassigned
                      </span>
                    )}
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleView(lead.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No leads found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Pagination */}
      <CardFooter className="flex items-center justify-between py-4 bg-muted/20 border-t">
        <div className="text-xs text-muted-foreground">
          Showing <strong>{startIndex + 1}</strong> to{" "}
          <strong>{Math.min(endIndex, leads.length)}</strong> of{" "}
          <strong>{leads.length}</strong> entries
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-xs font-medium text-muted-foreground px-2">
            Page {page} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};