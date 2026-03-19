// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useFinancialReport, useInventoryReport, useLeadsReport, useSalesReport } from '@/hooks/useReports';
// import { FileText, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

// export default function ReportsPageComponent() {


//     const { data: salesData, isLoading: salesLoading } = useSalesReport();
// const { data: inventoryData, isLoading: inventoryLoading } = useInventoryReport();
// const { data: leadsData, isLoading: leadsLoading } = useLeadsReport();
// const { data: financialData, isLoading: financialLoading } = useFinancialReport();
//   return (
//     <div className="p-6">
//       <div className="space-y-2 mb-6">
//         <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//           Reports
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           View detailed business reports and analytics
//         </p>
//       </div>

//       <Tabs defaultValue="sales" className="mt-6">
//         <TabsList>
//           <TabsTrigger value="sales">
//             <DollarSign className="w-4 h-4 mr-2" />
//             Sales Reports
//           </TabsTrigger>

//           <TabsTrigger value="inventory">
//             <BarChart3 className="w-4 h-4 mr-2" />
//             Inventory Reports
//           </TabsTrigger>

//           <TabsTrigger value="leads">
//             <TrendingUp className="w-4 h-4 mr-2" />
//             Lead Reports
//           </TabsTrigger>

//           <TabsTrigger value="financial">
//             <FileText className="w-4 h-4 mr-2" />
//             Financial Reports
//           </TabsTrigger>
//         </TabsList>

//         {/* Sales */}
//         <TabsContent value="sales" className="mt-6">
//   <Card>
//     <CardHeader>
//       <CardTitle>Sales Reports</CardTitle>
//     </CardHeader>

//     <CardContent>

//       {salesLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-6">

//           <div>
//             <p className="text-muted-foreground text-sm">Total Revenue</p>
//             <p className="text-2xl font-bold">
//               ₹{salesData?.data?.totalRevenue}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Total Deals</p>
//             <p className="text-2xl font-bold">
//               {salesData?.data?.totalDeals}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Avg Deal Value</p>
//             <p className="text-2xl font-bold">
//               ₹{salesData?.data?.avgDealValue}
//             </p>
//           </div>

//         </div>
//       )}

//     </CardContent>
//   </Card>
// </TabsContent>
//         {/* Inventory */}
//         <TabsContent value="inventory" className="mt-6">
//   <Card>
//     <CardHeader>
//       <CardTitle>Inventory Reports</CardTitle>
//     </CardHeader>

//     <CardContent>
//       {inventoryLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-6">

//           <div>
//             <p className="text-muted-foreground text-sm">Total Stock</p>
//             <p className="text-2xl font-bold">
//               {inventoryData?.data?.totalStock}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Sold Vehicles</p>
//             <p className="text-2xl font-bold">
//               {inventoryData?.data?.soldVehicles}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Unsold Vehicles</p>
//             <p className="text-2xl font-bold">
//               {inventoryData?.data?.unsoldVehicles}
//             </p>
//           </div>

//         </div>
//       )}
//     </CardContent>
//   </Card>
// </TabsContent>

//         {/* Leads */}
//         <TabsContent value="leads" className="mt-6">
//   <Card>
//     <CardHeader>
//       <CardTitle>Lead Reports</CardTitle>
//     </CardHeader>

//     <CardContent>
//       {leadsLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-6">

//           <div>
//             <p className="text-muted-foreground text-sm">Total Leads</p>
//             <p className="text-2xl font-bold">
//               {leadsData?.data?.totalLeads}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Converted</p>
//             <p className="text-2xl font-bold">
//               {leadsData?.data?.converted}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Conversion Rate</p>
//             <p className="text-2xl font-bold">
//               {leadsData?.data?.conversionRate}%
//             </p>
//           </div>

//         </div>
//       )}
//     </CardContent>
//   </Card>
// </TabsContent>

//         {/* Financial */}
//         <TabsContent value="financial" className="mt-6">
//   <Card>
//     <CardHeader>
//       <CardTitle>Financial Reports</CardTitle>
//     </CardHeader>

//     <CardContent>
//       {financialLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-2 gap-6">

//           <div>
//             <p className="text-muted-foreground text-sm">Total Revenue</p>
//             <p className="text-2xl font-bold">
//               ₹{financialData?.data?.revenue}
//             </p>
//           </div>

//           <div>
//             <p className="text-muted-foreground text-sm">Total Invoices</p>
//             <p className="text-2xl font-bold">
//               {financialData?.data?.invoices?.length}
//             </p>
//           </div>

//         </div>
//       )}
//     </CardContent>
//   </Card>
// </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


'use client';

import React, { useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Calendar
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useSalesReport,
  useInventoryReport,
  useLeadsReport,
  useFinancialReport
} from "@/hooks/useReports";

/* -------------------- STATS CARD -------------------- */

const StatsCard = ({ title, value, change, icon: Icon, loading, trend }: any) => (
  <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>

        {trend && (
          <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up'
              ? <ArrowUpRight className="w-3 h-3 mr-1" />
              : <ArrowDownRight className="w-3 h-3 mr-1" />
            }
            {change}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>

        {loading
          ? <Skeleton className="h-8 w-24 mt-1" />
          : <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
        }
      </div>
    </CardContent>
  </Card>
);

/* -------------------- CHART CARD -------------------- */

const ChartCard = ({ title, description, children, loading }: any) => (
  <Card className="col-span-full lg:col-span-3 border-slate-200/60 dark:border-slate-800/60 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
      <div className="space-y-1">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>

      <Badge variant="outline" className="font-normal">
        Last 30 days
      </Badge>
    </CardHeader>

    <CardContent>
      <div className="h-[350px] w-full">
        {loading
          ? <Skeleton className="h-full w-full rounded-xl" />
          : children
        }
      </div>
    </CardContent>
  </Card>
);

/* -------------------- MAIN COMPONENT -------------------- */

export default function ReportsPageComponent() {

  const sales = useSalesReport();
  const inventory = useInventoryReport();
  const leads = useLeadsReport();
  const financial = useFinancialReport();

  const isLoading =
    sales.isLoading ||
    inventory.isLoading ||
    leads.isLoading ||
    financial.isLoading;

  /* -------- SALES CHART DATA -------- */

  const salesChartData = useMemo(() => {

    if (!sales.data?.data?.deals) return [];

    const grouped: Record<string, number> = {};

    sales.data.data.deals.forEach((deal: any) => {

      const month = new Date(deal.created_at)
        .toLocaleString("default", { month: "short" });

      grouped[month] =
        (grouped[month] || 0) + (deal.deal_amount || 0);
    });

    return Object.entries(grouped).map(([name, revenue]) => ({
      name,
      revenue
    }));

  }, [sales.data]);

  /* -------- RECENT DEALS -------- */

  const recentDeals = useMemo(() => {

    if (!sales.data?.data?.deals) return [];

    return sales.data.data.deals
      .slice(0, 5)
      .map((deal: any) => ({
        client: deal.customer_name || "Customer",
        date: new Date(deal.created_at).toLocaleDateString(),
        amount: `₹${deal.deal_amount}`
      }));

  }, [sales.data]);

  /* -------------------- UI -------------------- */

  return (

    <div className="min-h-screen bg-slate-50/50 dark:bg-[#09090b] p-4 md:p-8 lg:p-10 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analytics
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time performance metrics across your organization.
          </p>
        </div>

        
      </div>

      {/* TABS */}

      <Tabs defaultValue="sales" className="space-y-8">

        <TabsList className="bg-transparent h-auto p-0 gap-8 border-b border-slate-200 dark:border-slate-800 pb-1">

          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>

        </TabsList>

        {/* SALES TAB */}

        <TabsContent value="sales" className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatsCard
              title="Total Revenue"
              value={`₹${sales.data?.data?.totalRevenue ?? 0}`}
              icon={DollarSign}
              trend="up"
              change="+12%"
              loading={isLoading}
            />

            <StatsCard
              title="Closed Deals"
              value={sales.data?.data?.totalDeals ?? 0}
              icon={TrendingUp}
              loading={isLoading}
            />

            <StatsCard
              title="Avg Deal Value"
              value={`₹${sales.data?.data?.avgDealValue ?? 0}`}
              icon={ArrowUpRight}
              loading={isLoading}
            />

            <StatsCard
              title="Active Leads"
              value={leads.data?.data?.totalLeads ?? 0}
              icon={Users}
              loading={isLoading}
            />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <ChartCard
              title="Sales Growth"
              description="Monthly revenue"
              loading={isLoading}
            >

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={salesChartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f172a"
                    fillOpacity={0.1}
                    fill="#0f172a"
                  />

                </AreaChart>

              </ResponsiveContainer>

            </ChartCard>

            <Card className="lg:col-span-2">

              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                {recentDeals.map((deal: any, i: number) => (

                  <div key={i} className="flex justify-between items-center">

                    <div>

                      <p className="text-sm font-medium">{deal.client}</p>

                      <p className="text-xs text-slate-500">
                        {deal.date}
                      </p>

                    </div>

                    <p className="text-sm font-semibold">
                      {deal.amount}
                    </p>

                  </div>

                ))}

              </CardContent>

            </Card>

          </div>

        </TabsContent>

        {/* INVENTORY */}

        <TabsContent value="inventory">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <StatsCard
              title="Total Stock"
              value={inventory.data?.data?.totalStock ?? 0}
              icon={Package}
              loading={isLoading}
            />

            <StatsCard
              title="Sold Vehicles"
              value={inventory.data?.data?.soldVehicles ?? 0}
              icon={TrendingUp}
              loading={isLoading}
            />

            <StatsCard
              title="Unsold Vehicles"
              value={inventory.data?.data?.unsoldVehicles ?? 0}
              icon={Users}
              loading={isLoading}
            />

          </div>

        </TabsContent>

        {/* LEADS */}

        <TabsContent value="leads">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <StatsCard
              title="Total Leads"
              value={leads.data?.data?.totalLeads ?? 0}
              icon={Users}
              loading={isLoading}
            />

            <StatsCard
              title="Converted"
              value={leads.data?.data?.converted ?? 0}
              icon={TrendingUp}
              loading={isLoading}
            />

            <StatsCard
              title="Conversion Rate"
              value={`${leads.data?.data?.conversionRate ?? 0}%`}
              icon={ArrowUpRight}
              loading={isLoading}
            />

          </div>

        </TabsContent>

        {/* FINANCIAL */}

        <TabsContent value="financial">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatsCard
              title="Total Revenue"
              value={`₹${financial.data?.data?.revenue ?? 0}`}
              icon={DollarSign}
              loading={isLoading}
            />

            <StatsCard
              title="Invoices"
              value={financial.data?.data?.invoices?.length ?? 0}
              icon={FileText}
              loading={isLoading}
            />

          </div>

        </TabsContent>

      </Tabs>

    </div>
  );
}