

"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Car,
  Clock,
  User,
  CalendarCheck,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTestDrives } from "@/hooks/useTestDrive";
import TestDrivesTable from "./testDriveTable"; // Assuming this exists
import { AppCard } from "../shared/app-cards";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemo, useState } from "react";
import { TestDrive } from "@/types/testDrive";

export default function TestDrivesClient() {



  const router = useRouter();

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryFilters = useMemo(() => ({
    search: debouncedSearch,
    status: filters.status,
  }), [debouncedSearch, filters.status]);

  const { data: testDrives = [], isLoading, isFetching } =
    useTestDrives(queryFilters);

  const ongoingDrives = testDrives.filter((d: TestDrive) => !d.end_time);
  const completedDrives = testDrives.length - ongoingDrives.length;
  const activeStaff = new Set(testDrives.map((d: TestDrive) => d.salesperson_id).filter(Boolean)).size;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading test drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 animate-in fade-in duration-500">

      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Test Drives
          </h1>
          <p className="text-muted-foreground">
            Monitor active drives, schedule appointments, and manage fleet usage.
          </p>
        </div>
        <Button onClick={() => router.push("/testdrives/new")} size="lg" className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Drive
        </Button>
      </div>

      <Separator />

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <AppCard
          title='Total Drives'
          icon={Car}
          value={testDrives.length}
          description='Lifetime records'
        />
        <AppCard
          title='Ongoing Now'
          icon={Clock}
          value={ongoingDrives.length}
          description='Currently active'
        />
        <AppCard
          title='Completed'
          icon={CalendarCheck}
          value={completedDrives}
          description='Successfully finished'
        />
        <AppCard
          title='Active Staff'
          icon={User}
          value={activeStaff}
          description='Involved in drives'
        />

      </div>

      {/* --- Main Content --- */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Manage your test drive logs and status.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customer, vehicle..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isFetching && !isLoading && (
            <div className="text-xs text-muted-foreground text-centre">
              Updating results...
            </div>
          )}


          {/* Table Component */}
          <div className="rounded-md border">
            <TestDrivesTable data={testDrives} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

