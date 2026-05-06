export default function AppBanner() {
  return (
    <section className="mt-12 overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white md:px-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            QuickBite App
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
            Get the app for better experience
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Faster checkout, live order tracking, and exclusive offers.
          </p>

          <button className="brand-gradient mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
            Download App
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <div className="h-40 w-40 rounded-xl bg-white/90 p-3">
              <div className="grid h-full w-full grid-cols-6 gap-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={i % 3 === 0 ? "bg-slate-900" : "bg-slate-200"}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/70">Mock QR</p>
          </div>
        </div>
      </div>
    </section>
  );
}

