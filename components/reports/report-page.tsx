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
  BarChart3,
  ShoppingCart,
  Activity,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

import {
  useSalesReport,
  useInventoryReport,
  useLeadsReport,
  useFinancialReport,
} from '@/hooks/useReports';

/* ─────────────────────────────────────────
   STATS CARD
───────────────────────────────────────── */

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  loading?: boolean;
  trend?: 'up' | 'down';
  subtitle?: string;
}

const StatsCard = ({ title, value, change, icon: Icon, loading, trend, subtitle }: StatsCardProps) => (
  <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-28 mt-1" />
          ) : (
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          )}
          {subtitle && !loading && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && change && (
            <div
              className={`flex items-center gap-0.5 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {change}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */

const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold">{title}</h2>
    {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
  </div>
);

/* ─────────────────────────────────────────
   CUSTOM TOOLTIP FOR CHART
───────────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-semibold" style={{ color: entry.color }}>
          {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
        </p>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

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

  /* ── Sales chart data ── */
  console.log(sales.data);

  const salesChartData = useMemo(() => {
    if (!sales.data?.data?.deals) return [];

    const grouped: Record<string, number> = {};

    sales.data.data.deals.forEach((deal: any) => {
      const month = new Date(deal.created_at).toLocaleString('default', { month: 'short' });
      grouped[month] = (grouped[month] || 0) + (deal.deal_amount || 0);
    });

    return Object.entries(grouped).map(([name, revenue]) => ({ name, revenue }));
  }, [sales.data]);

  /* ── Recent deals ── */
  const recentDeals = useMemo(() => {
    if (!sales.data?.data?.deals) return [];

    return sales.data.data.deals.slice(0, 5).map((deal: any) => ({
      client: deal.customer_name || 'Customer',
      date: new Date(deal.created_at).toLocaleDateString(),
      amount: `₹${deal.sale_price}`,
    }));
  }, [sales.data]);

  /* ── Inventory utilization ── */
  const stockUtilization = useMemo(() => {
    const total = inventory.data?.data?.totalStock ?? 0;
    const sold = inventory.data?.data?.soldVehicles ?? 0;
    return total > 0 ? Math.round((sold / total) * 100) : 0;
  }, [inventory.data]);

  /* ── Lead funnel data for bar chart ── */
  const leadFunnelData = useMemo(() => {
    const d = leads.data?.data;
    if (!d) return [];
    return [
      { name: 'Total', value: d.totalLeads ?? 0 },
      { name: 'Converted', value: d.converted ?? 0 },
    ];
  }, [leads.data]);

  /* ────────────────────────────────────────── */

  return (
    <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-[#09090b]">
      {/* ── Page header ── */}
      <div className="border-b bg-background px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time performance metrics across your organisation.
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 text-xs">
            <Activity className="h-3 w-3" />
            Live
          </Badge>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="sales">
          {/* Tab navigation */}
          <TabsList className="h-9 rounded-md bg-muted p-1 w-full sm:w-auto">
            <TabsTrigger value="sales" className="gap-2 text-sm">
              <DollarSign className="h-3.5 w-3.5" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2 text-sm">
              <Package className="h-3.5 w-3.5" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2 text-sm">
              <Users className="h-3.5 w-3.5" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2 text-sm">
              <FileText className="h-3.5 w-3.5" />
              Financial
            </TabsTrigger>
          </TabsList>

          {/* ══════════ SALES TAB ══════════ */}
          <TabsContent value="sales" className="mt-6 space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatsCard
                title="Total Revenue"
                value={`₹${(sales.data?.data?.totalRevenue ?? 0).toLocaleString()}`}
                icon={DollarSign}
                trend="up"
                change="+12%"
                subtitle="All time"
                loading={isLoading}
              />
              <StatsCard
                title="Closed Deals"
                value={sales.data?.data?.totalDeals ?? 0}
                icon={ShoppingCart}
                subtitle="Total closed"
                loading={isLoading}
              />
              <StatsCard
                title="Avg Deal Value"
                value={`₹${(sales.data?.data?.avgDealValue ?? 0).toLocaleString()}`}
                icon={TrendingUp}
                subtitle="Per deal"
                loading={isLoading}
              />
              <StatsCard
                title="Active Leads"
                value={leads.data?.data?.totalLeads ?? 0}
                icon={Users}
                subtitle="In pipeline"
                loading={isLoading}
              />
            </div>

            {/* Chart + Recent deals */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Area chart */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div>
                    <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                    <CardDescription className="mt-0.5">Monthly revenue breakdown</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    Last 30 days
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    {isLoading ? (
                      <Skeleton className="h-full w-full rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v: number) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent deals */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Recent Deals</CardTitle>
                  <CardDescription className="mt-0.5">Latest closed transactions</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : recentDeals.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No deals found</p>
                  ) : (
                    <div className="space-y-1">
                      {recentDeals.map((deal: any, i: number) => (
                        <React.Fragment key={i}>
                          <div className="flex items-center justify-between py-2.5 px-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                                {deal.client.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-none">{deal.client}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{deal.date}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold tabular-nums">{deal.amount}</p>
                          </div>
                          {i < recentDeals.length - 1 && <Separator />}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ══════════ INVENTORY TAB ══════════ */}
          <TabsContent value="inventory" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                title="Total Stock"
                value={inventory.data?.data?.totalStock ?? 0}
                icon={Package}
                subtitle="All vehicles"
                loading={isLoading}
              />
              <StatsCard
                title="Sold Vehicles"
                value={inventory.data?.data?.soldVehicles ?? 0}
                icon={TrendingUp}
                trend="up"
                subtitle="Cleared from stock"
                loading={isLoading}
              />
              <StatsCard
                title="Unsold Vehicles"
                value={inventory.data?.data?.unsoldVehicles ?? 0}
                icon={BarChart3}
                subtitle="Still in stock"
                loading={isLoading}
              />
            </div>

            {/* Stock utilization */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Stock Utilization</CardTitle>
                <CardDescription>Percentage of inventory sold vs total stock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <Skeleton className="h-4 w-full rounded-full" />
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sold</span>
                      <span className="font-semibold">{stockUtilization}%</span>
                    </div>
                    <Progress value={stockUtilization} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{inventory.data?.data?.soldVehicles ?? 0} sold</span>
                      <span>{inventory.data?.data?.unsoldVehicles ?? 0} remaining</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══════════ LEADS TAB ══════════ */}
          <TabsContent value="leads" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                title="Total Leads"
                value={leads.data?.data?.totalLeads ?? 0}
                icon={Users}
                subtitle="All pipeline entries"
                loading={isLoading}
              />
              <StatsCard
                title="Converted"
                value={leads.data?.data?.converted ?? 0}
                icon={TrendingUp}
                trend="up"
                subtitle="Successfully closed"
                loading={isLoading}
              />
              <StatsCard
                title="Conversion Rate"
                value={`${leads.data?.data?.conversionRate ?? 0}%`}
                icon={ArrowUpRight}
                subtitle="Lead-to-close ratio"
                loading={isLoading}
              />
            </div>

            {/* Funnel chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Lead Funnel</CardTitle>
                <CardDescription>Total leads vs converted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full">
                  {isLoading ? (
                    <Skeleton className="h-full w-full rounded-lg" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadFunnelData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="value"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={64}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Conversion progress */}
                {!isLoading && (
                  <div className="mt-4 space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Progress</span>
                      <span className="font-semibold">{leads.data?.data?.conversionRate ?? 0}%</span>
                    </div>
                    <Progress value={leads.data?.data?.conversionRate ?? 0} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══════════ FINANCIAL TAB ══════════ */}
          <TabsContent value="financial" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatsCard
                title="Total Revenue"
                value={`₹${(financial.data?.data?.revenue ?? 0).toLocaleString()}`}
                icon={DollarSign}
                subtitle="All time earnings"
                loading={isLoading}
              />
              <StatsCard
                title="Total Invoices"
                value={financial.data?.data?.invoices?.length ?? 0}
                icon={FileText}
                subtitle="Invoices generated"
                loading={isLoading}
              />
            </div>

            {/* Invoice list */}
            {!isLoading && (financial.data?.data?.invoices?.length ?? 0) > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
                  <CardDescription>Latest financial documents</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1">
                    {financial.data.data.invoices.slice(0, 5).map((inv: any, i: number) => (
                      <React.Fragment key={i}>
                        <div className="flex items-center justify-between py-2.5 px-1">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted shrink-0">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">
                                {inv.invoice_number ?? `INV-${i + 1}`}
                              </p>
                              {inv.created_at && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {new Date(inv.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {inv.amount && (
                            <p className="text-sm font-semibold tabular-nums">
                              ₹{Number(inv.amount).toLocaleString()}
                            </p>
                          )}
                        </div>
                        {i < Math.min(financial.data.data.invoices.length, 5) - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}