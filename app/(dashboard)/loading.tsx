import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="h-6 w-96 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-slate-100 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-slate-100 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
