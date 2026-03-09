import { SystemHealthDashboard } from '@/components/system-health/dashboard';
import { checkDatabaseIntegrity, getTableCounts } from '@/lib/actions/system-health';

export default async function SystemHealthPage() {
  const healthStatus = await checkDatabaseIntegrity();
  const tableCounts = await getTableCounts();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="text-slate-500 mt-1">Monitor database integrity and system status</p>
      </div>
      
      <SystemHealthDashboard 
        healthStatus={healthStatus}
        tableCounts={tableCounts}
      />
    </div>
  );
}
