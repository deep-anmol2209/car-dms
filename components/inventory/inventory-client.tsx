
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
  const [page, setPage] = useState(1);
  const [yearFilter, setYearFilter] = useState("all");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, isLoading } = useInventory({
    search: debouncedSearch,
    year: yearFilter !== "all" ? Number(yearFilter) : undefined,
    page: page,
    limit: 5,
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
      <div className="p-6">
      <div className="mb-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Search and Filters Skeleton */}
      <div className="mb-4 flex gap-4">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-16 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    );
  }

  return (
    <div className="flex-1 space-y-1  md:space-y-4 md:p-4 p-x-[1.5rem] animate-in fade-in duration-500">

      {/* --- Header --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your fleet, track costs, and monitor sales performance.
          </p>
        </div>
        <Button onClick={() => router.push("/inventory/new")} size="lg" className="shadow-sm w-full md:w-auto">
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
      <Card className="shadow-sm border-border/60 overflow-hidden">
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>
            Filter, search, and manage your vehicle listings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-3 py-4 md:px-6 md:space-y-6">

          {/* Filter Toolbar (Remains the same) */}
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
                <SelectTrigger className="w-full sm:w-[130px]">
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
            </div>
          </div>

          {/* --- Desktop Table View --- */}
          <div className="hidden md:block rounded-md border">
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
                        <div className="font-medium">{vehicle.year} {vehicle.make}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.model} {vehicle.trim}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-foreground">{vehicle.stock_number}</span>
                          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[100px]">{vehicle.vin}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-normal ${statusColors[vehicle.status as keyof typeof statusColors] || statusColors.Inactive}`}>
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">${grandTotal.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono text-sm">${vehicle.retail_price?.toLocaleString()}</TableCell>
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
                })}
              </TableBody>
            </Table>
          </div>

          {/* --- Mobile Card View --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {vehicles.map((vehicle: Vehicle) => {
              const grandTotal = (vehicle.purchase_price || 0) + (vehicle.extra_costs || 0) + (vehicle.taxes || 0);
              const grossProfit = (vehicle.retail_price || 0) - grandTotal;

              return (
                <div key={vehicle.id} className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-3 shadow-sm active:scale-[0.98] transition-transform">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base leading-tight truncate">
                          {vehicle.year} {vehicle.make}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {vehicle.model} • {vehicle.stock_number}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      <VehicleActionsMenu vehicleId={vehicle.id} />
                    </div>
                  </div>

                  {/* Status + Online toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="outline" className={`text-xs ${statusColors[vehicle.status as keyof typeof statusColors] || statusColors.Inactive}`}>
                      {vehicle.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Online</span>
                      <Switch defaultChecked={vehicle.status === "Active"} className="scale-75 origin-right" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2  gap-1.5 rounded-lg  bg-muted/30 p-2.5">
                  <div className="flex flex-col sm:flex-row sm:gap-2">
<div className="flex flex-col">
                      <span className="text-[9px] uppercase text-muted-foreground font-semibold tracking-tighter">Cost</span>
                      <span className="font-mono text-xs font-bold leading-tight">${grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase text-muted-foreground font-semibold tracking-tighter">Retail</span>
                      <span className="font-mono text-xs font-bold leading-tight">${vehicle.retail_price?.toLocaleString()}</span>
                    </div>
                  </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] uppercase text-muted-foreground font-semibold tracking-tighter">Profit</span>
                      <span className={`font-mono text-xs font-bold leading-tight ${grossProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        ${grossProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* VIN */}
                  <div className="mt-2.5 flex items-center gap-1 min-w-0">
                    <span className="text-[9px] font-semibold uppercase text-muted-foreground shrink-0">VIN:</span>
                    <span className="text-[9px] font-mono text-muted-foreground truncate">{vehicle.vin}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- Pagination (Refined for Mobile) --- */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Page <span className="font-medium text-foreground">{page}</span> of {pagination?.totalPages || 1}
            </div>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="h-9 w-9 p-0"
              >
                ←
              </Button>
              {/* Only show page numbers on bigger screens, keep it simple on mobile */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(pagination?.totalPages || 1, 5) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? "default" : "ghost"}
                    onClick={() => setPage(p)}
                    className="w-9 h-9 p-0"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination?.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="h-9 w-9 p-0"
              >
                →
              </Button>
            </div>
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
