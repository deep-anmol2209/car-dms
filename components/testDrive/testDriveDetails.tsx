
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Car,
  User,
  CreditCard,
  Clock,
  FileText,
  Phone,
  CheckCircle2,
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
    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
    : "bg-green-50 text-green-700 border-green-200 hover:bg-green-50";
  const Icon = isOngoing ? Clock : CheckCircle2;

  return (
    <Badge
      variant="outline"
      className={`px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 rounded ${styles}`}
    >
      <Icon className="w-3 h-3" />
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-screen bg-muted/30 animate-pulse">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 bg-background border-b gap-4">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-3 w-60 bg-muted rounded" />
          </div>
          <div className="h-8 w-24 bg-muted rounded sm:ml-auto" />
        </div>

        <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">

          {/* Left */}
          <div className="flex-1 lg:overflow-y-auto p-4 sm:p-6 space-y-5">

            {/* Vehicle */}
            <div className="border rounded-md p-5 space-y-3 bg-background">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-3 w-52 bg-muted rounded" />
            </div>

            {/* Driver Card */}
            <div className="border rounded-md bg-background overflow-hidden">

              {/* Header */}
              <div className="px-5 py-3 border-b">
                <div className="h-3 w-24 bg-muted rounded" />
              </div>

              <div className="flex flex-col md:flex-row md:divide-x divide-y md:divide-y-0">

                {/* Left side */}
                <div className="flex-1 p-5 space-y-4">

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="space-y-2">
                      <div className="h-3 w-28 bg-muted rounded" />
                      <div className="h-3 w-36 bg-muted rounded" />
                    </div>
                  </div>

                  <div className="h-px bg-muted" />

                  <div className="space-y-3">
                    <div>
                      <div className="h-3 w-24 bg-muted rounded mb-1" />
                      <div className="h-4 w-40 bg-muted rounded" />
                    </div>

                    <div className="h-8 w-full bg-muted rounded" />
                  </div>
                </div>

                {/* Right side (image) */}
                <div className="flex-1 p-5 space-y-2">
                  <div className="h-3 w-28 bg-muted rounded" />
                  <div className="w-full h-[140px] bg-muted rounded-md" />
                </div>

              </div>
            </div>

            {/* Notes */}
            <div className="border rounded-md bg-background p-5 space-y-3">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-12 w-full bg-muted rounded" />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l bg-background p-5 space-y-6">

            {/* Timeline */}
            <div className="space-y-4">
              <div className="h-3 w-24 bg-muted rounded" />

              <div className="flex gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-muted mt-1" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-3 w-28 bg-muted rounded" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-muted mt-1" />
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
            </div>

            {/* Sales */}
            <div className="space-y-3">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-3">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-16 w-full bg-muted rounded" />
              <div className="h-3 w-40 bg-muted rounded mx-auto" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  const handleEndDrive = () => {
    if (!id) return;
    patchTestDrive.mutate(
      { id, data: { end_time: new Date().toISOString() } },
      {
        onSuccess: () => toast.success("Test drive ended successfully"),
        onError: (error) => toast.error(error.message),
      }
    );
  };

  if (isError || !testDrive) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Card className="border-destructive/30 bg-destructive/5 max-w-sm w-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              Error loading data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t retrieve test drive information. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="flex flex-col h-full min-h-screen bg-muted/30">

      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 bg-background border-b shrink-0 gap-4 sm:gap-2">
        <div>
          <h1 className="text-base font-semibold tracking-tight">
            Test Drive #{testDrive.id.slice(-6).toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created {formatDate(testDrive.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-2">
          <StatusBadge status={status} />
          {isOngoing && (
            <>
              <Separator orientation="vertical" className="h-5 hidden sm:block" />
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50 text-xs h-8 ml-auto sm:ml-0"
                disabled={patchTestDrive.isPending}
                onClick={handleEndDrive}
              >
                <StopCircle className="mr-1.5 h-3.5 w-3.5" />
                {patchTestDrive.isPending ? "Ending..." : "End drive"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">

        {/* Left: scrollable main content */}
        <div className="flex-1 lg:overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* Vehicle */}
          <Card className="shadow-none border">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Vehicle
                </span>
              </div>
              <h2 className="text-base font-semibold">
                {testDrive.vehicle.make} {testDrive.vehicle.model}
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                VIN: {testDrive.vehicle.vin}
              </p>
            </div>
          </Card>

          {/* ── Unified Customer + License Card ── */}
          <Card className="shadow-none border overflow-hidden">

            {/* Section label */}
            <div className="px-5 pt-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Driver
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:divide-x divide-y md:divide-y-0">

              {/* Left half: Customer info */}
              <div className="flex-1 px-5 py-4 space-y-4">
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-50 text-blue-700 text-sm font-semibold">
                      {customerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {testDrive.customer.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {testDrive.customer.phone}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* License meta */}
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                      License number
                    </p>
                    <p className="font-mono text-sm font-medium">
                      {testDrive.driver_license_number}
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-muted/40 border px-3 py-2 text-xs">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-medium">
                      {formatDate(testDrive.driver_license_expiry)}
                    </span>
                  </div>

                </div>
              </div>

              {/* Right half: License image */}
              <div className="flex-1 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    License image
                  </span>
                </div>
                {testDrive.driver_license?.imageUrl ? (
                  <div className="relative w-full rounded-md overflow-hidden border" style={{ aspectRatio: "16/10" }}>
                    <Image
                      src={testDrive.driver_license.imageUrl}
                      alt="Driver License"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-muted/20 text-xs text-muted-foreground min-h-[120px]">
                    No license image
                  </div>
                )}
              </div>

            </div>
          </Card>

          {/* Notes */}
          <Card className="shadow-none border">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {testDrive.notes ? (
                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-md px-3 py-2.5 border">
                  {testDrive.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes added.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: fixed sidebar */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l bg-background lg:overflow-y-auto pb-10 lg:pb-0">

          {/* Timeline */}
          <div className="px-5 py-5 border-b">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Timeline
              </span>
            </div>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-green-500 bg-green-100 mt-0.5 shrink-0" />
                  <div className="flex-1 w-px bg-border mt-1 min-h-[32px]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                    Started
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDate(testDrive.start_time, "h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(testDrive.start_time, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full border-2 mt-0.5 shrink-0 ${isOngoing
                      ? "border-amber-400 bg-amber-100"
                      : "border-green-500 bg-green-100"
                      }`}
                  />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                    {isOngoing ? "In progress" : "Completed"}
                  </p>
                  {isOngoing ? (
                    <p className="text-sm text-amber-600 font-medium">Recording…</p>
                  ) : (
                    <p className="text-sm font-semibold">Drive ended</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Representative */}
          {testDrive.salesperson && (
            <div className="px-5 py-5 border-b">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Sales representative
              </p>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {salespersonInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    {testDrive.salesperson.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">Employee</p>
                </div>
              </div>
            </div>
          )}

          {/* Signature */}
          <div className="px-5 py-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Customer acceptance
            </p>
            {testDrive.signature?.imageUrl ? (
              <div className="flex items-center justify-center rounded-md border bg-white px-4 py-3">
                <div className="relative w-full h-16">
                  <Image
                    src={testDrive.signature.imageUrl}
                    alt="Customer Signature"
                    fill
                    className="object-contain mix-blend-multiply"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-16 items-center justify-center rounded-md border border-dashed bg-muted/20 text-xs text-muted-foreground">
                No signature recorded
              </div>
            )}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-green-500" />
              Digitally signed &amp; verified
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}