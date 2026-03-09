'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Car, Users, TrendingUp } from 'lucide-react';

interface DashboardStats {
  total_inventory_count: number;
  total_inventory_value: number;
  projected_profit: number;
  leads_this_month: number;
}

export function KPIGrid({ stats }: { stats: DashboardStats }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const kpis = [
    {
      title: 'Inventory Value',
      value: formatCurrency(stats.total_inventory_value),
      icon: <Car className="w-5 h-5" />,
      trend: '+12% from last month',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Projected Profit',
      value: formatCurrency(stats.projected_profit),
      icon: <TrendingUp className="w-5 h-5" />,
      trend: '+8% from last month',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Active Inventory',
      value: stats.total_inventory_count.toString(),
      icon: <Car className="w-5 h-5" />,
      trend: '+5 vehicles',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Leads This Month',
      value: stats.leads_this_month.toString(),
      icon: <Users className="w-5 h-5" />,
      trend: '+15% from last month',
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <Card
          key={index}
          className="hover-lift border-gradient overflow-hidden relative group animate-in fade-in slide-in-from-bottom"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient background overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

          {/* Glow effect on hover */}
          <div className={`absolute -inset-1 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />

          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <div className={`h-12 w-12 rounded-xl ${kpi.iconBg} flex items-center justify-center ${kpi.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
              {kpi.icon}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
              {kpi.value}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              {kpi.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
