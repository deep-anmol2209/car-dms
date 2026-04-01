
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

      {/* ─── MOBILE CARD VIEW (≤700px) ─── */}
      <div className="flex flex-col divide-y divide-border min-[701px]:hidden">
        {currentLeads.length > 0 ? (
          currentLeads.map((lead) => (
            <div key={lead.id} className="p-4 space-y-3 hover:bg-muted/30 transition-colors">

              {/* Top row: customer + action */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{lead.customer.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{lead.customer.phone}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 shrink-0">
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
              </div>

              {/* Status */}
              <div>
                <LeadStatusCell
                  value={lead.status}
                  onChange={(status: LeadStatus) => handleChangeStatus(lead.id, status)}
                />
              </div>

              {/* Vehicle */}
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground shrink-0">Vehicle</span>
                {lead.interest_vehicle ? (
                  <span className="font-medium text-right truncate">
                    {lead.interest_vehicle.year} {lead.interest_vehicle.make} {lead.interest_vehicle.model}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">General Inquiry</span>
                )}
              </div>

              {/* Source + Assigned row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {lead.source}
                </div>
                {lead.assigned_to ? (
                  <span className="text-xs text-muted-foreground">{lead.assigned_to.full_name}</span>
                ) : (
                  <span className="text-amber-600 text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded font-medium">
                    Unassigned
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Calendar className="h-3 w-3" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No leads found matching your criteria.
          </div>
        )}
      </div>

      {/* ─── DESKTOP TABLE VIEW (>700px) ─── */}
      <CardContent className="p-0 max-[700px]:hidden">
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