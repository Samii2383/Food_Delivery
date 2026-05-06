const cards = [
  {
    title: "Food Delivery",
    subtitle: "Order from top restaurants near you",
    image:
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80&auto=format&fit=crop"
  },
  {
    title: "Grocery (Instamart)",
    subtitle: "Daily essentials delivered fast",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop"
  },
  {
    title: "Dineout",
    subtitle: "Reserve tables & explore offers",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop"
  }
];

export default function CategoryCards() {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-slate-900">Explore</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <img src={c.image} alt="" className="h-36 w-full object-cover transition group-hover:scale-105" />
            <div className="p-4">
              <p className="text-lg font-semibold text-slate-900">{c.title}</p>
              <p className="mt-1 text-sm text-slate-600">{c.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

