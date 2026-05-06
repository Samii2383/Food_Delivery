export default function StatsSection() {
  const stats = [
    { label: "Users", value: "10K+" },
    { label: "Restaurants", value: "500+" },
    { label: "Orders Delivered", value: "50K+" },
    { label: "Rating", value: "4.8 ⭐" }
  ];

  return (
    <section className="mt-14">
      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-orange-50/60 p-5">
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

