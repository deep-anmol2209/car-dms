'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Reports
        </h1>
        <p className="text-muted-foreground text-lg">
          View detailed business reports and analytics
        </p>
      </div>

      <Tabs defaultValue="sales" className="mt-6">
        <TabsList>
          <TabsTrigger value="sales">
            <DollarSign className="w-4 h-4 mr-2" />
            Sales Reports
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <BarChart3 className="w-4 h-4 mr-2" />
            Inventory Reports
          </TabsTrigger>
          <TabsTrigger value="leads">
            <TrendingUp className="w-4 h-4 mr-2" />
            Lead Reports
          </TabsTrigger>
          <TabsTrigger value="financial">
            <FileText className="w-4 h-4 mr-2" />
            Financial Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <p>Sales reports coming soon</p>
                <p className="text-sm mt-2">Detailed sales analytics and performance metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <p>Inventory reports coming soon</p>
                <p className="text-sm mt-2">Vehicle turnover, aging analysis, and stock performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <p>Lead reports coming soon</p>
                <p className="text-sm mt-2">Conversion rates, source analysis, and pipeline metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <p>Financial reports coming soon</p>
                <p className="text-sm mt-2">P&L statements, cash flow, and profitability analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
