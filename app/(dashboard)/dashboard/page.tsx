import { KPIGrid } from '@/components/dashboard/kpi-grid';
import { ChartsContainer } from '@/components/dashboard/charts-container';
import { RecentLeads } from '@/components/crm/recent-leads';
// import { AnalystChat } from '@/components/ai/analyst-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  getDashboardStats,
  getInventoryStats,
  getRevenueData,
  getRecentLeads
} from '@/lib/actions/dashboard-stats';
import { LayoutDashboard, TrendingUp, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const [stats, inventoryStats, revenueData, recentLeads] = await Promise.all([
    getDashboardStats(),
    getInventoryStats(),
    getRevenueData(),
    getRecentLeads(5)
  ]);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Dramatic Header */}
      {/* Premium Dashboard Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 md:p-8 p-4 border border-border/40 shadow-sm">

        {/* Soft radial highlight */}
        <div className="absolute -top-20 -right-20 h-72 w-72 bg-indigo-400/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4 sm:gap-6">

          {/* Icon Block */}
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
            <LayoutDashboard className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground truncate">
                Dashboard
              </h1>

              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg flex items-center gap-2 mt-1 sm:mt-2 line-clamp-1 sm:line-clamp-none">
              <TrendingUp className="h-3.5  sm:h-4 w-4 text-emerald-500 shrink-0" />
              Welcome to Adaptus DMS Real-time dealership overview
            </p>
          </div>
        </div>
      </div>


      {/* KPI Grid */}
      <KPIGrid stats={stats} />

      {/* Charts and Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartsContainer
            inventoryStats={inventoryStats}
            revenueData={revenueData}
          />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentLeads leads={recentLeads} />
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
