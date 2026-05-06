export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        disabled={!canPrev}
        onClick={() => canPrev && onChange(page - 1)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
      >
        Prev
      </button>
      <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium">
        {page} / {totalPages}
      </span>
      <button
        disabled={!canNext}
        onClick={() => canNext && onChange(page + 1)}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

