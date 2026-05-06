import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { fetchFoods, fetchRestaurant } from "../features/restaurants/restaurantApi.js";
import FoodCard from "../components/foods/FoodCard.jsx";
import SkeletonCard from "../components/ui/SkeletonCard.jsx";
import { addToCart, selectCartCount } from "../features/cart/cartSlice.js";
import Pagination from "../components/ui/Pagination.jsx";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [restaurantRes, foodRes] = await Promise.all([
          fetchRestaurant(id),
          fetchFoods({ restaurantId: id, search, category, page, limit: 12 })
        ]);
        setRestaurant(restaurantRes.data);
        setFoods(foodRes.data || []);
        setTotalPages(foodRes.pagination?.totalPages || 1);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, search, category, page]);

  const categories = useMemo(
    () => Array.from(new Set(foods.map((x) => x.category))).filter(Boolean),
    [foods]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Back to restaurants
          </Link>
          <Link to="/cart" className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-white">
            Cart: {cartCount}
          </Link>
        </div>

        {restaurant ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={restaurant.image?.url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"}
              alt={restaurant.name}
              className="h-56 w-full object-cover md:h-72"
            />
            <div className="p-5">
              <h1 className="text-2xl font-semibold text-slate-900">{restaurant.name}</h1>
              <p className="mt-2 text-slate-600">{restaurant.description}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search foods..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/30 focus:ring-2"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-500/30 focus:ring-2"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : foods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onAdd={() => {
                    dispatch(addToCart({ id: food._id, name: food.name, price: food.price }));
                    toast.success(`${food.name} added to cart`);
                  }}
                />
              ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}

