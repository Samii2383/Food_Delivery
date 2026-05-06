export default function FoodCard({ food, onAdd }) {
  return (
    <article className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:shadow-lg">
      <h4 className="text-base font-semibold text-slate-900">{food.name}</h4>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{food.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold text-slate-900">Rs {food.price}</span>
        <button
          onClick={onAdd}
          className="brand-gradient rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

