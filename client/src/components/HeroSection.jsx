export default function HeroSection({ onOrderNow, onExplore }) {
  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden rounded-3xl border border-orange-100 bg-slate-950 shadow-xl">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&q=80&auto=format&fit=crop"
        alt="Food background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/85" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-6 py-12 md:px-10">
        <div className="max-w-2xl text-white">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            #1 Food Delivery Experience
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Order Food Anytime, Anywhere
          </h1>
          <p className="mt-4 text-base text-white/85 md:text-lg">
            Fast delivery from top restaurants — fresh, hot and right on time.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={onOrderNow}
              className="brand-gradient rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Order Now
            </button>
            <button
              onClick={onExplore}
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

