// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useInventory } from "@/hooks/use-inventory";
// import type { Vehicle } from "@/types/inventory";

// // UI Components
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator"; // Optional, looks nice
// import { Badge } from "@/components/ui/badge"; // Used for status

// // Custom Components (assumed to exist based on your code)
// import { VehicleActionsMenu } from "@/components/inventory/vehicle-actions-menu";
// // Icons & Charts
// import { Plus, Search, Car, DollarSign, Filter, TrendingUp } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
// } from "recharts";

// // --- Constants & Config ---

// const statusColors: Record<string, string> = {
//   Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200",
//   Inactive: "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
//   Sold: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
//   "Coming Soon": "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200",
// };

// const statusData = [
//   { name: "Active", value: 15, color: "#10b981" }, // Emerald 500
//   { name: "Coming Soon", value: 5, color: "#f59e0b" }, // Amber 500
//   { name: "Sold", value: 30, color: "#3b82f6" }, // Blue 500
// ];
// interface InventoryPageProps {
//   vehicles: Vehicle[];
// }
// export default function InventoryPage() {

//   const router = useRouter();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [yearFilter, setYearFilter] = useState("all");
//   const [makeFilter, setMakeFilter] = useState("all");
//   const [modelFilter, setModelFilter] = useState("all");
//   const { data: fetchedVehicles=[] } = useInventory();
//   const vehicles = fetchedVehicles 
//   useEffect(() => {
//     router.prefetch("/inventory/new");
//   }, [router]);

//   // --- Calculations ---
//   const totalInventory = vehicles.length;

//   const totalPurchaseValue = vehicles.reduce(
//     (sum, v) => sum + (v.purchase_price || 0) + (v.extra_costs || 0) + (v.taxes || 0),
//     0
//   );

//   const totalRetailValue = vehicles.reduce(
//     (sum, v) => sum + (v.retail_price || 0),
//     0
//   );

//   return (
//     <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">


//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
//           <p className="text-muted-foreground">
//             Manage your fleet, track costs, and monitor sales performance.
//           </p>
//         </div>

//         <Button onClick={() => router.push("/inventory/new")} size="lg" className="shadow-sm">
//           <Plus className="mr-2 h-4 w-4" />
//           Add Vehicle
//         </Button>

//       </div>

//       <Separator />

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {/* Total Inventory */}
//         <Card className="shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
//             <Car className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalInventory}</div>
//             <p className="text-xs text-muted-foreground">
//               +2 from last month
//             </p>
//           </CardContent>
//         </Card>

//         {/* Purchase Value */}
//         <Card className="shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Purchase Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               ${totalPurchaseValue.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Total invested capital
//             </p>
//           </CardContent>
//         </Card>

//         {/* Retail Value */}
//         <Card className="shadow-sm hover:shadow-md transition-shadow">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Retail Value</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               ${totalRetailValue.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Potential revenue
//             </p>
//           </CardContent>
//         </Card>

//         {/* Status Chart */}
//         <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-1">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Distribution</CardTitle>
//           </CardHeader>
//           <CardContent className="h-[100px] flex items-center justify-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={statusData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={25}
//                   outerRadius={40}
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {statusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
//                   itemStyle={{ fontSize: "12px", fontWeight: 600 }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             {/* Simple Legend for cleaner UI */}
//             <div className="flex flex-col gap-1 text-[10px] text-muted-foreground ml-2">
//               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Active</div>
//               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Sold</div>
//               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> WIP</div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* --- Filters & Data Table --- */}
//       <Card className="shadow-sm">
//         <CardHeader>
//           <CardTitle>Fleet Management</CardTitle>
//           <CardDescription>
//             Filter, search, and manage your vehicle listings.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">

//           {/* Filters Bar */}
//           <div className="flex flex-col gap-4 md:flex-row md:items-center">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by VIN, Stock # or Model..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9"
//               />
//             </div>

//             <div className="flex gap-2">
//               <Select value={yearFilter} onValueChange={setYearFilter}>
//                 <SelectTrigger className="w-[130px]">
//                   <SelectValue placeholder="Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Years</SelectItem>
//                   <SelectItem value="2024">2024</SelectItem>
//                   <SelectItem value="2023">2023</SelectItem>
//                   <SelectItem value="2022">2022</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={makeFilter} onValueChange={setMakeFilter}>
//                 <SelectTrigger className="w-[130px]">
//                   <SelectValue placeholder="Make" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Makes</SelectItem>
//                   <SelectItem value="Honda">Honda</SelectItem>
//                   <SelectItem value="Toyota">Toyota</SelectItem>
//                   <SelectItem value="Ford">Ford</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={modelFilter} onValueChange={setModelFilter}>
//                 <SelectTrigger className="w-[130px]">
//                   <SelectValue placeholder="Model" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Models</SelectItem>
//                   <SelectItem value="Civic">Civic</SelectItem>
//                   <SelectItem value="Accord">Accord</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[80px]">Details</TableHead>
//                   <TableHead>Vehicle</TableHead>
//                   <TableHead>VIN / Stock</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead className="text-right">Total Cost</TableHead>
//                   <TableHead className="text-right">Retail</TableHead>
//                   <TableHead className="text-right">Est. Profit</TableHead>
//                   <TableHead className="text-center">Online</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {
//                   vehicles.map((vehicle: Vehicle) => {
//                     const grandTotal =
//                       (vehicle.purchase_price || 0) +
//                       (vehicle.extra_costs || 0) +
//                       (vehicle.taxes || 0);

//                     const grossProfit = (vehicle.retail_price || 0) - grandTotal;

//                     return (
//                       <TableRow key={vehicle.id} className="group">
//                         {/* Image / Icon Placeholder */}
//                         <TableCell>
//                           <div className="flex h-10 w-16 items-center justify-center rounded bg-muted/50 text-muted-foreground">
//                             <Car className="h-5 w-5 opacity-50" />
//                           </div>
//                         </TableCell>

//                         {/* Vehicle Name */}
//                         <TableCell>
//                           <div className="font-medium">
//                             {vehicle.year} {vehicle.make}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             {vehicle.model} {vehicle.trim}
//                           </div>
//                         </TableCell>

//                         {/* ID Info */}
//                         <TableCell>
//                           <div className="flex flex-col">
//                             <span className="font-mono text-xs">{vehicle.stock_number}</span>
//                             <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]" title={vehicle.vin}>
//                               {vehicle.vin}
//                             </span>
//                           </div>
//                         </TableCell>

//                         {/* Status Badge */}
//                         <TableCell>
//                           <Badge
//                             variant="outline"
//                             className={`font-normal ${statusColors[vehicle.status as keyof typeof statusColors] || statusColors.Inactive
//                               }`}
//                           >
//                             {vehicle.status}
//                           </Badge>
//                         </TableCell>

//                         {/* Financials */}
//                         <TableCell className="text-right font-mono text-sm">
//                           ${grandTotal.toLocaleString()}
//                         </TableCell>
//                         <TableCell className="text-right font-mono text-sm">
//                           ${vehicle.retail_price?.toLocaleString()}
//                         </TableCell>
//                         <TableCell className={`text-right font-mono text-sm font-medium ${grossProfit >= 0 ? "text-emerald-600" : "text-rose-600"
//                           }`}>
//                           ${grossProfit.toLocaleString()}
//                         </TableCell>

//                         {/* Active Switch */}
//                         <TableCell className="text-center">
//                           <Switch defaultChecked={vehicle.status === "Active"} />
//                         </TableCell>

//                         {/* Actions */}
//                         <TableCell className="text-right">
//                           <VehicleActionsMenu vehicleId={vehicle.id} />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 }
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/hooks/use-inventory";
import type { Vehicle } from "@/types/inventory";
import { useDebounce } from "@/hooks/use-debounce";
import { AppCard } from "@/components/shared/app-cards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VehicleActionsMenu } from "@/components/inventory/vehicle-actions-menu";

import { Plus, Search, Car, DollarSign, TrendingUp, PieChart as PieIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// --- Config ---
const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200",
  Sold: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200",
  "Coming Soon": "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200",
};

const statusData = [
  { name: "Active", value: 15, color: "#10b981" },
  { name: "Coming Soon", value: 5, color: "#f59e0b" },
  { name: "Sold", value: 30, color: "#3b82f6" },
];
type InventoryAnalytics = {
  totalInventory: number;
  totalPurchaseValue: number;
  totalRetailValue: number;
}

export default function InventoryPage({ analytics }: { analytics: InventoryAnalytics }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  // Simple filters for demo
  const [yearFilter, setYearFilter] = useState("all");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, isLoading } = useInventory({
    search: debouncedSearch,
    year: yearFilter !== "all" ? Number(yearFilter) : undefined,
    page: 1,
    limit: 10,
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);


  const vehicles = data?.data ?? [];
  const pagination = data?.pagination;
  console.log(vehicles);

  useEffect(() => {
    router.prefetch("/inventory/new");
  }, [router]);

  // Calculations
  const totalInventory = analytics.totalInventory || 0;
  const totalPurchaseValue = analytics.totalPurchaseValue || 0;
  const totalRetailValue = analytics.totalRetailValue || 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 animate-in fade-in duration-500">

      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your fleet, track costs, and monitor sales performance.
          </p>
        </div>
        <Button onClick={() => router.push("/inventory/new")} size="lg" className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <Separator />

      {/* --- Stats Cards --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <AppCard
          title="Total Vehicles"
          value={totalInventory}
          icon={Car}
          description="+2 from last month"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />



        <AppCard
          title="Purchase Value"
          value={`$${totalPurchaseValue?.toLocaleString()}`}
          icon={DollarSign}
          description="Total invested capital"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />



        <AppCard
          title="Retail Value"
          value={`$${totalRetailValue?.toLocaleString()}`}
          icon={TrendingUp}
          description="Potential revenue"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />


        <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Distribution
            </CardTitle>


            <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <PieIcon className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>

          <CardContent className="flex items-center justify-center h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>



      </div>

      {/* --- Main Content --- */}
      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>
            Filter, search, and manage your vehicle listings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Filter Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by VIN, Stock # or Model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Add more filters as needed */}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>VIN / Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Retail</TableHead>
                  <TableHead className="text-right">Est. Profit</TableHead>
                  <TableHead className="text-center">Online</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle: Vehicle) => {
                  const grandTotal = (vehicle.purchase_price || 0) + (vehicle.extra_costs || 0) + (vehicle.taxes || 0);
                  const grossProfit = (vehicle.retail_price || 0) - grandTotal;

                  return (
                    <TableRow key={vehicle.id} className="group hover:bg-muted/50">
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Car className="h-5 w-5 opacity-50" />
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">
                          {vehicle.year} {vehicle.make}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {vehicle.model} {vehicle.trim}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-foreground">{vehicle.stock_number}</span>
                          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[100px]" title={vehicle.vin}>
                            {vehicle.vin}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className={`font-normal ${statusColors[vehicle.status as keyof typeof statusColors] || statusColors.Inactive}`}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-mono text-sm">
                        ${grandTotal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${vehicle.retail_price?.toLocaleString()}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm font-medium ${grossProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        ${grossProfit.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-center">
                        <Switch defaultChecked={vehicle.status === "Active"} />
                      </TableCell>

                      <TableCell className="text-right">
                        <VehicleActionsMenu vehicleId={vehicle.id} />
                      </TableCell>
                    </TableRow>
                  );
                })
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Stat Card Component (Internal or move to separate file)
function DashboardStatCard({
  title,
  value,
  icon: Icon,
  description,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}: any) {
  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {/* Soft colored icon container like dashboard */}
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight">
          {value}
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
