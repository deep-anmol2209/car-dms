"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Car,
  User,
  CreditCard,
  Clock,
  FileText,
  Phone,
  CheckCircle2,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  StopCircle,
} from "lucide-react";
import { formatDate } from "@/helper/date";
import { getTestDriveStatus } from "@/types/testDrive";
import { useParams } from "next/navigation";
import { usePatchTestDrive, useTestDrive } from "@/hooks/useTestDrive";
import toast from "react-hot-toast";

/* ============================================================================
   Helpers
   ============================================================================ */

const StatusBadge = ({ status }: { status: string }) => {
  const isOngoing = status === "Ongoing";
  const styles = isOngoing
    ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"
    : "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100";

  const Icon = isOngoing ? Clock : CheckCircle2;

  return (
    <Badge
      variant="outline"
      className={`px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </Badge>
  );
};

/* ============================================================================
   Component
   ============================================================================ */

export default function TestDriveDetails() {
  const params = useParams();
  const id = params?.id as string;
const patchTestDrive = usePatchTestDrive();

  const { data: testDrive, isLoading, isError } = useTestDrive(id);

  /* --- Loading State --- */
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading details...</p>
        </div>
      </div>
    );
  }
const handleEndDrive = () => {
  if (!id) return;

  patchTestDrive.mutate({
    id,
    data: {
      end_time: new Date().toISOString(),
    
    },
     
  },{
    onSuccess: () => {
      toast.success("Test drive ended successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

  /* --- Error State --- */
  if (isError || !testDrive) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Card className="border-destructive/50 bg-destructive/5 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t retrieve the test drive information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* --- Data Processing --- */
  const status = getTestDriveStatus(testDrive);
  const isOngoing = status === "Ongoing";

  const customerInitials = testDrive.customer.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const salespersonInitials =
    testDrive.salesperson?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("") ?? "SP";

  /* --- Render --- */
  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500">
        
        {/* ================= Header Section ================= */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Test Drive #{testDrive.id.slice(-6).toUpperCase()}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created on {formatDate(testDrive.created_at)}</span>
              <span>•</span>
              <span>ID: {testDrive.id}</span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3 bg-background p-2 rounded-lg border shadow-sm">
            <StatusBadge status={status} />
            {isOngoing && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <Button
  variant="destructive"
  size="sm"
  className="shadow-sm"
  disabled={patchTestDrive.isPending}
  onClick={handleEndDrive}
>
  <StopCircle className="mr-2 h-4 w-4" />
  {patchTestDrive.isPending ? "Ending..." : "End Drive"}
</Button>
              </>
            )}
          </div>
        </div>

        {/* ================= Main Dashboard Grid ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* LEFT COLUMN (2/3 width) */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* 1. Hero Vehicle Card */}
            <Card className="overflow-hidden border-none shadow-md ring-1 ring-slate-900/5">
              <div className="relative overflow-hidden bg-slate-900 p-8 text-white">
                {/* Abstract decorative background */}
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-slate-800 opacity-50 blur-3xl" />
                
                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Car className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase tracking-wider">
                        Vehicle Details
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold">
                      {testDrive.vehicle.make} {testDrive.vehicle.model}
                    </h2>
                    <p className="mt-1 font-mono text-sm text-slate-400 opacity-80">
                      VIN: {testDrive.vehicle.vin}
                    </p>
                  </div>
                  {/* Placeholder for Vehicle Image if you had one, otherwise stylized icon */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. Customer & License Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Customer Card */}
              <Card className="h-full shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <User className="h-4 w-4" />
                    Customer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                        {customerInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-bold text-lg leading-none">
                        {testDrive.customer.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {testDrive.customer.phone}
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs font-normal">
                        Verified Customer
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* License Card */}
              <Card className="h-full shadow-sm transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    License Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Number</p>
                    <p className="font-mono text-base font-semibold tracking-wide">
                      {testDrive.driver_license_number}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-md bg-muted/40 p-2 text-sm">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">
                      {formatDate(testDrive.driver_license_expiry)}
                    </span>
                  </div>

                  {testDrive.driver_license_image_url && (
                    <div className="group relative mt-2 overflow-hidden rounded-md border shadow-sm">
                      <Image
                        src={testDrive.driver_license_image_url}
                        alt="License Preview"
                        className="h-24 w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">View Full</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 3. Notes Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Session Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testDrive.notes ? (
                  <div className="rounded-lg bg-amber-50/50 p-4 text-sm leading-relaxed text-amber-900 border border-amber-100">
                    {testDrive.notes}
                  </div>
                ) : (
                  <p className="text-sm italic text-muted-foreground">No notes added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN (1/3 width) - Sticky Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Timeline Widget */}
            <Card className="shadow-md border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Start Step */}
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                  <div className="absolute left-[5px] top-4 h-full w-[2px] bg-muted" />
                  <p className="text-xs font-medium uppercase text-muted-foreground">Started</p>
                  <p className="text-sm font-medium">
                    {formatDate(testDrive.start_time, "h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(testDrive.start_time, "MMM d, yyyy")}
                  </p>
                </div>

                {/* End Step */}
                <div className="relative pl-6">
                  <div className={`absolute left-0 top-1 h-3 w-3 rounded-full border-2 ${isOngoing ? 'border-amber-400 bg-amber-400 animate-pulse' : 'border-primary bg-primary'}`} />
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {isOngoing ? "In Progress" : "Completed"}
                  </p>
                  {!isOngoing ? (
                    <div className="space-y-0.5">
                       <p className="text-sm font-medium">Completed</p>
                       <p className="text-xs text-muted-foreground">Drive Ended</p>
                    </div>
                  ) : (
                    <p className="text-sm text-amber-600 font-medium italic">Recording...</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Salesperson & Signature Widget */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {/* Salesperson */}
                {testDrive.salesperson && (
                  <div className="p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sales Representative
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-100 text-xs">
                          {salespersonInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {testDrive.salesperson.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">Employee</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Signature */}
                <div className="bg-muted/10 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer Acceptance
                  </p>
                  {testDrive.signature_image_url ? (
                    <div className="flex items-center justify-center rounded border bg-white p-3">
                      <Image
                        src={testDrive.signature_image_url}
                        alt="Signature"
                        className="max-h-12 w-auto opacity-80 mix-blend-multiply"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 items-center justify-center rounded border border-dashed bg-muted/20 text-xs text-muted-foreground">
                      No signature recorded
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                     <ShieldCheck className="h-3 w-3 text-emerald-500" />
                     <span>Digitally Signed & Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}