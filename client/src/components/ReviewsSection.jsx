const reviews = [
  {
    name: "Aarav",
    rating: 5,
    comment: "Super fast delivery and the food arrived hot. Love the experience!"
  },
  {
    name: "Meera",
    rating: 5,
    comment: "Great restaurant options and smooth checkout. Highly recommended."
  },
  {
    name: "Rohan",
    rating: 4,
    comment: "Clean UI, quick ordering. Would love more offers though!"
  },
  {
    name: "Sneha",
    rating: 5,
    comment: "The best delivery app UI I’ve used. Very premium and simple."
  }
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "text-amber-400" : "text-slate-200"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="mt-14">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Customer Reviews</h2>
        <p className="mt-2 text-sm text-slate-600">What people love about QuickBite.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                <Stars count={r.rating} />
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                Verified
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">“{r.comment}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}

