export default function RestaurantGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-orange-100 bg-white">
          <div className="h-44 w-full bg-slate-200" />
          <div className="p-4">
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
            <div className="mt-3 flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

