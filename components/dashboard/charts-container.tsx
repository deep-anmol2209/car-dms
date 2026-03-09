'use client';

import { 
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = {
  Active: '#0ea5e9',
  Sold: '#22c55e',
  Inactive: '#64748b',
};

interface InventoryStat {
  status: string;
  count: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

export function ChartsContainer({ 
  inventoryStats, 
  revenueData 
}: {
  inventoryStats: InventoryStat[];
  revenueData: RevenueData[];
}) {
  const totalInventory = inventoryStats.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inventory Status Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorInactive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <Pie
                data={inventoryStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {inventoryStats.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'Active' ? 'url(#colorActive)' : 
                          entry.status === 'Sold' ? 'url(#colorSold)' : 
                          'url(#colorInactive)'} 
                  />
                ))}
              </Pie>
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                dominantBaseline="middle"
                className="text-2xl font-bold fill-slate-700"
              >
                {totalInventory}
              </text>
              <text 
                x="50%" 
                y="55%" 
                textAnchor="middle" 
                dominantBaseline="middle"
                className="text-sm fill-slate-500"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Revenue Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [
                  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
                  'Revenue'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '8px 12px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0d9488" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
