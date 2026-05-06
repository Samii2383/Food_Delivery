export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="h-36 rounded-xl bg-slate-200" />
      <div className="mt-3 h-5 w-2/3 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
    </div>
  );
}

