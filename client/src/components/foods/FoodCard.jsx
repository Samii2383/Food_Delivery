export default function FoodCard({ food, onAdd }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <img
        src={food.image?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"}
        alt={food.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <h4 className="text-base font-semibold text-slate-900">{food.name}</h4>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{food.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Rs {food.price}</span>
          <button
            onClick={onAdd}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

