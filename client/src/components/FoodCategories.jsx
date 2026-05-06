const items = [
  {
    label: "Pizza",
    image: "https://images.unsplash.com/photo-1548365328-9f547b1f29f7?w=400&q=80&auto=format&fit=crop"
  },
  {
    label: "Burger",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&auto=format&fit=crop"
  },
  {
    label: "Biryani",
    image: "https://images.unsplash.com/photo-1631515243347-20a2d8f36d55?w=400&q=80&auto=format&fit=crop"
  },
  {
    label: "Dosa",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80&auto=format&fit=crop"
  },
  {
    label: "Drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80&auto=format&fit=crop"
  }
];

export default function FoodCategories() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">What’s on your mind?</h2>
        <p className="text-sm text-slate-500">Scroll</p>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {items.map((it) => (
          <div key={it.label} className="min-w-[120px]">
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-orange-100 bg-white shadow-sm transition hover:shadow-md">
              <img src={it.image} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-slate-900">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

