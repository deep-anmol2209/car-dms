export default function loading(){
    return (
<div className="w-full px-6 py-6 space-y-6 animate-pulse">

{/* --- HEADER --- */}
<div className="flex items-center justify-between">
  <div className="space-y-2">
    <div className="h-4 w-40 bg-muted rounded-md" />
    <div className="h-8 w-64 bg-muted rounded-md" />
    <div className="h-4 w-80 bg-muted rounded-md" />
  </div>

  <div className="h-10 w-40 bg-muted rounded-md" />
</div>

{/* --- CARD --- */}
<div className="border rounded-xl p-6 space-y-6">

  {/* Card Header */}
  <div className="space-y-2">
    <div className="h-6 w-40 bg-muted rounded-md" />
    <div className="h-4 w-56 bg-muted rounded-md" />
  </div>

  {/* --- POSTS GRID --- */}
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="border rounded-xl overflow-hidden flex flex-col"
      >
        {/* Image */}
        <div className="h-44 w-full bg-muted" />

        {/* Content */}
        <div className="p-4 space-y-3 flex-1">
          <div className="h-4 w-32 bg-muted rounded-md" />
          <div className="h-3 w-full bg-muted rounded-md" />
          <div className="h-3 w-5/6 bg-muted rounded-md" />
          <div className="h-3 w-2/3 bg-muted rounded-md" />

          {/* Footer */}
          <div className="flex justify-between items-center pt-4">
            <div className="h-3 w-20 bg-muted rounded-md" />
            <div className="h-5 w-16 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    ))}

  </div>
</div>
</div>

    )
}