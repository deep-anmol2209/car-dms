'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { SystemHealthStatus } from '@/lib/actions/system-health';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SystemHealthDashboardProps {
  healthStatus: SystemHealthStatus;
  tableCounts: Record<string, number>;
}

export function SystemHealthDashboard({ healthStatus, tableCounts }: SystemHealthDashboardProps) {
  const getStatusIcon = (status: 'OK' | 'ERROR') => {
    if (status === 'OK') {
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    }
    return <XCircleIcon className="w-6 h-6 text-red-500" />;
  };

  const getStatusBadge = (status: 'OK' | 'ERROR') => {
    if (status === 'OK') {
      return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Error</Badge>;
  };

  const overallStatus = 
    healthStatus.inventory === 'OK' && 
    healthStatus.crm === 'OK' && 
    healthStatus.finance === 'OK' 
      ? 'OK' 
      : 'ERROR';

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={overallStatus === 'OK' ? 'border-green-500' : 'border-red-500'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              System Status
            </CardTitle>
            {getStatusBadge(overallStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-600">
            <p>Database Latency: <span className="font-semibold">{healthStatus.latency}</span></p>
            {healthStatus.corruptedRecords > 0 && (
              <p className="mt-2 text-amber-600 flex items-center gap-2">
                <AlertTriangleIcon className="w-4 h-4" />
                {healthStatus.corruptedRecords} corrupted record(s) detected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Module Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Inventory</CardTitle>
              {getStatusIcon(healthStatus.inventory)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(healthStatus.inventory)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Records:</span>
                <span className="font-semibold">{tableCounts.vehicles >= 0 ? tableCounts.vehicles : 'N/A'}</span>
              </div>
              {healthStatus.errors?.inventory && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {healthStatus.errors.inventory}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">CRM</CardTitle>
              {getStatusIcon(healthStatus.crm)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(healthStatus.crm)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Records:</span>
                <span className="font-semibold">{tableCounts.leads >= 0 ? tableCounts.leads : 'N/A'}</span>
              </div>
              {healthStatus.orphanLeads > 0 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                  {healthStatus.orphanLeads} orphan lead(s)
                </div>
              )}
              {healthStatus.errors?.crm && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {healthStatus.errors.crm}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Finance</CardTitle>
              {getStatusIcon(healthStatus.finance)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(healthStatus.finance)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Records:</span>
                <span className="font-semibold">{tableCounts.invoices >= 0 ? tableCounts.invoices : 'N/A'}</span>
              </div>
              {healthStatus.errors?.finance && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {healthStatus.errors.finance}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Integrity Check */}
      <Card>
        <CardHeader>
          <CardTitle>Data Integrity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600">Orphan Leads</p>
                <p className="text-2xl font-bold">
                  {healthStatus.orphanLeads > 0 ? (
                    <span className="text-amber-600">{healthStatus.orphanLeads}</span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Orphan Test Drives</p>
                <p className="text-2xl font-bold">
                  {healthStatus.orphanTestDrives > 0 ? (
                    <span className="text-amber-600">{healthStatus.orphanTestDrives}</span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Corrupted</p>
                <p className="text-2xl font-bold">
                  {healthStatus.corruptedRecords > 0 ? (
                    <span className="text-red-600">{healthStatus.corruptedRecords}</span>
                  ) : (
                    <span className="text-green-600">0</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Database Latency</p>
                <p className="text-2xl font-bold text-slate-700">{healthStatus.latency}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Counts */}
      <Card>
        <CardHeader>
          <CardTitle>Table Record Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(tableCounts).map(([table, count]) => (
              <div key={table} className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 uppercase mb-1">{table}</p>
                <p className="text-xl font-bold">
                  {count >= 0 ? count.toLocaleString() : 'Error'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Status
        </Button>
      </div>
    </div>
  );
}
