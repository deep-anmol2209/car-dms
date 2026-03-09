// "use client";
// import TestDrivesTable from "./testDriveTable";
// import {
//   Plus,
//   Car,
//   Clock,
//   User,
//   Calendar,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Eye,
//   Pencil,
//   Download,
//   Trash2,
//   StopCircle,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";


// import { useTestDrives } from "@/hooks/useTestDrive";



// /* ============================================================================
//    Component: Test Drives Table (Separate Component)
//    ============================================================================ */



// /* ============================================================================
//    Component: Main Client Page
//    ============================================================================ */

// export default function TestDrivesClient() {
//   const { data: testDrives = [], isLoading } = useTestDrives();
//   const router = useRouter();

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//          <div className="flex flex-col items-center gap-2">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//             <p className="text-muted-foreground">Loading test drives...</p>
//          </div>
//       </div>
//     );
//   }

//   const ongoingDrives = testDrives.filter((d) => !d.end_time);

//   return (
//     <div className="flex flex-col min-h-screen bg-muted/10 p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
//       {/* --- Header --- */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Test Drive Management
//           </h1>
//           <p className="text-muted-foreground text-lg max-w-2xl">
//             Monitor active drives, schedule appointments, and manage fleet usage.
//           </p>
//         </div>
//         <Button onClick={() => router.push("/testdrives/new")} size="lg" className="shadow-md">
//           <Plus className="w-5 h-5 mr-2" />
//           Schedule Drive
//         </Button>
//       </div>

//       <Separator />

//       {/* --- Stats Cards --- */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatsCard
//           title="Total Test Drives"
//           value={testDrives.length}
//           icon={<Car className="h-5 w-5 text-white" />}
//           description="Lifetime records"
//           gradient="bg-gradient-to-br from-blue-500 to-blue-600"
//         />
//         <StatsCard
//           title="Ongoing Now"
//           value={ongoingDrives.length}
//           icon={<Clock className="h-5 w-5 text-white" />}
//           description="Currently active"
//           gradient="bg-gradient-to-br from-amber-500 to-amber-600"
//         />
//         <StatsCard
//           title="Completed"
//           value={testDrives.length - ongoingDrives.length}
//           icon={<Calendar className="h-5 w-5 text-white" />}
//           description="Successfully finished"
//           gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
//         />
//         <StatsCard
//           title="Active Staff"
//           value={new Set(testDrives.map((d) => d.salesperson_id).filter(Boolean)).size}
//           icon={<User className="h-5 w-5 text-white" />}
//           description="Involved in drives"
//           gradient="bg-gradient-to-br from-purple-500 to-purple-600"
//         />
//       </div>

//       {/* --- Main Table Section --- */}
//       <Card className="border-none shadow-lg ring-1 ring-slate-200">
//         <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
//           <div>
//             <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
//             <CardDescription>
//               Manage your test drive logs and status.
//             </CardDescription>
//           </div>

//           <div className="flex gap-3 w-full md:w-auto">
//             <div className="relative w-full md:w-72">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//               <Input
//                 placeholder="Search by customer, vehicle or VIN..."
//                 className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
//               />
//             </div>
//             <Button variant="outline" size="icon" className="shrink-0">
//               <Filter className="h-4 w-4" />
//             </Button>
//             <Button variant="outline" size="icon" className="shrink-0">
//               <Download className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//            {/* Rendering the separate Table Component */}
//            <TestDrivesTable data={testDrives} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// /* ============================================================================
//    Helper: Stats Card
//    ============================================================================ */

// function StatsCard({
//   title,
//   value,
//   icon,
//   description,
//   gradient,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   description: string;
//   gradient: string;
// }) {
//   return (
//     <Card className="border-none shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow">
//       <div className={`absolute inset-0 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity ${gradient}`} />
//       <CardContent className="p-6 flex justify-between items-start relative z-10">
//         <div>
//           <p className="text-sm font-medium text-muted-foreground">{title}</p>
//           <h3 className="text-3xl font-bold mt-2">{value}</h3>
//           <p className="text-xs text-muted-foreground mt-1">{description}</p>
//         </div>
//         <div className={`p-3 rounded-xl shadow-sm ${gradient}`}>
//           {icon}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


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
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">
      
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

