import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={restaurant.image?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
        alt={restaurant.name}
        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{restaurant.name}</h3>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            {restaurant.rating || 4.2} ★
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{restaurant.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{restaurant.category || "Multi Cuisine"}</span>
          <span>{restaurant.deliveryTimeMins || 30} mins</span>
        </div>
      </div>
    </Link>
  );
}

