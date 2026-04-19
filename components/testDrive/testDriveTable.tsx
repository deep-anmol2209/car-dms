"use client";

import { TestDriveWithRelations } from "@/types/testDrive";
import { formatDate } from "@/helper/date";
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
  Car,
  User,
  MoreHorizontal,
  Eye,
  Pencil,
  Download,
  Trash2,
  StopCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useDeleteTestDrive } from "@/hooks/useTestDrive";

interface TestDrivesTableProps {
  data: TestDriveWithRelations[];
}

function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function TestDrivesTable({ data }: TestDrivesTableProps) {
  const deleteDrive = useDeleteTestDrive();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedDriveId) return;
    setIsDeleting(true);
    try {
      deleteDrive.mutate(selectedDriveId, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          toast.success("Test drive deleted successfully");
          // router.back() // Removed because this is a table view, not a detail page
        },
        onError: (error: any) => {
          setShowDeleteDialog(false);
          toast.error(error.message || "Error in deletion");
        }
      })
    } catch (error) {
      toast.error("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };
  // --- Empty State ---
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted rounded-xl bg-muted/5 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-background p-4 rounded-full shadow-sm mb-4 ring-1 ring-muted">
          <Car className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No test drives found</h3>
        <p className="text-muted-foreground max-w-sm mt-2 text-sm">
          We couldn&apos;t find any records matching your criteria.
          Try adjusting filters or schedule a new drive.
        </p>
      </div>
    );
  }

  // --- Mobile Cards & Desktop Table Wrapper ---
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-3 animate-in fade-in duration-500 p-1">
          {data.map((drive) => {
            const isOngoing = !drive.end_time;
            const initials = drive?.customer?.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={drive.id}
                className="rounded-xl border bg-card shadow-sm p-4 flex flex-col gap-3 transition-shadow hover:shadow-md"
              >
                {/* Row 1: avatar + name/phone + actions */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-foreground leading-tight truncate">
                        {drive?.customer?.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono leading-tight">
                        {drive?.customer?.phone}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] p-1">
                      <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                        Manage Drive
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push(`/testdrives/view/${drive.id}`)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        View Details
                      </DropdownMenuItem>
                      {isOngoing && (
                        <DropdownMenuItem onClick={() => router.push(`/testdrives/${drive.id}`)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                          Edit Notes
                        </DropdownMenuItem>
                      )}
                   
                      <DropdownMenuSeparator className="my-1" />
                      {isOngoing && (
                        <DropdownMenuItem className="cursor-pointer text-amber-700 focus:text-amber-800" onClick={() => console.log("End", drive.id)}>
                          <StopCircle className="mr-2 h-4 w-4" />
                          End Session
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-700"
                        onClick={() => {
                          setSelectedDriveId(drive.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Row 2: Status Badge */}
                <div className="flex items-center gap-2">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${isOngoing ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOngoing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                    {isOngoing ? "Ongoing" : "Completed"}
                  </div>
                </div>

                <div className="border-t border-border/40" />

                {/* Row 3: Vehicle details */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-0.5">Vehicle</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-foreground">
                      {drive?.vehicle?.make} {drive?.vehicle?.model}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {drive?.vehicle?.vin}
                    </span>
                  </div>
                </div>

                {/* Row 4: Grid for Salesperson & Start Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Staff</span>
                    <span className="text-[12px] text-foreground truncate pl-0.5">
                      {drive?.salesperson?.full_name || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Scheduled</span>
                    <span className="text-[12px] text-foreground truncate pl-0.5">
                      {formatDate(drive?.start_time)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in duration-500">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[280px] pl-6">Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Salesperson</TableHead>
                <TableHead className="hidden lg:table-cell">Start Time</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((drive) => {
                const isOngoing = !drive.end_time;

                // Generate initials
                const initials = drive?.customer?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <TableRow
                    key={drive.id}
                    className="group hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    {/* 1. Customer Column */}
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                            {drive?.customer?.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {drive?.customer?.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 2. Vehicle Column */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {drive?.vehicle?.make} {drive?.vehicle?.model}
                        </span>
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-mono">
                          {drive?.vehicle?.vin}
                        </span>
                      </div>
                    </TableCell>

                    {/* 3. Status Column */}
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isOngoing
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOngoing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                          }`} />
                        {isOngoing ? "Ongoing" : "Completed"}
                      </div>
                    </TableCell>

                    {/* 4. Salesperson Column (Hidden on Mobile) */}
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5 opacity-70" />
                        {drive?.salesperson?.full_name || (
                          <span className="italic text-muted-foreground/50">Unassigned</span>
                        )}
                      </div>
                    </TableCell>

                    {/* 5. Start Time Column (Hidden on Tablet) */}
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(drive?.start_time)}
                    </TableCell>

                    {/* 6. Actions Column */}
                    <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] p-1">
                          <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                            Manage Drive
                          </DropdownMenuLabel>

                          {/* Option 1: View */}
                          <DropdownMenuItem onClick={() => router.push(`/testdrives/view/${drive.id}`)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                            View Details
                          </DropdownMenuItem>

                          {/* Option 2: Edit */}
                          {drive.end_time === null && (
                            <DropdownMenuItem onClick={() => {
                              router.push(`/testdrives/${drive.id}`);
                            }} className="cursor-pointer">
                              <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                              Edit Notes
                            </DropdownMenuItem>
                          )}



                          <DropdownMenuSeparator className="my-1" />

                          {/* Option 4: End Drive (Conditional) */}
                          {isOngoing && (
                            <DropdownMenuItem
                              className="cursor-pointer text-amber-700 focus:text-amber-800 focus:bg-amber-50"
                              onClick={() => console.log("End", drive.id)}
                            >
                              <StopCircle className="mr-2 h-4 w-4" />
                              End Session
                            </DropdownMenuItem>
                          )}

                          {/* Option 5: Delete */}
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={() => {
                              setSelectedDriveId(drive.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- DELETE DIALOG --- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle>Delete Test Drive Record?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 ml-1">
              This action cannot be undone. This will permanently delete the test drive
              and remove all associated data, tasks, and history from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isDeleting} className="border-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}