export default function EmptyState({ title, subtitle }) {
  return (
    <div className="glass-card rounded-2xl p-10 text-center shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  );
}

