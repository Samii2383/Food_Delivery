export default function CTASection({ onBrowse }) {
  return (
    <section className="mt-14">
      <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-8 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Hungry? Order your favorite food now!
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Browse restaurants and get your meal delivered in minutes.
            </p>
          </div>
          <button
            onClick={onBrowse}
            className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    </section>
  );
}

