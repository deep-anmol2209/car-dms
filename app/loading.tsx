export default function Loading() {
    return (
      <div className="flex h-full w-full animate-pulse">
        
        {/* Sidebar Skeleton */}
        <div className="w-64 border-r p-4 space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-muted rounded" />
          ))}
        </div>
  
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6 space-y-6">
  
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted rounded" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
            <div className="h-10 w-32 bg-muted rounded" />
          </div>
  
          {/* Cards / Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-muted rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }