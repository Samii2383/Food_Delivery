const features = [
  {
    title: "Fast Delivery",
    desc: "Lightning-fast delivery from nearby restaurants.",
    icon: "⚡"
  },
  {
    title: "Best Restaurants",
    desc: "Curated top-rated restaurants and trending cuisines.",
    icon: "🍽️"
  },
  {
    title: "Secure Payment",
    desc: "Safe, reliable checkout experience every time.",
    icon: "🔒"
  },
  {
    title: "24/7 Support",
    desc: "We’re here to help you anytime you need.",
    icon: "💬"
  }
];

export default function AboutSection() {
  return (
    <section className="mt-14">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Why Choose Us</h2>
        <p className="mt-2 text-sm text-slate-600">
          Everything you need for a premium delivery experience.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="brand-gradient inline-flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm">
              {f.icon}
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">{f.title}</p>
            <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

