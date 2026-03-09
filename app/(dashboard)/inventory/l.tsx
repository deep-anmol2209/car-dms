import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function InventoryLoading() {
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
