import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { logout, selectAuth } from "../features/auth/authSlice.js";
import { fetchRestaurants } from "../features/restaurants/restaurantApi.js";
import RestaurantCard from "../components/restaurants/RestaurantCard.jsx";
import SkeletonCard from "../components/ui/SkeletonCard.jsx";
import { selectCartCount } from "../features/cart/cartSlice.js";
import Pagination from "../components/ui/Pagination.jsx";

export default function HomePage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector(selectAuth);
  const cartCount = useSelector(selectCartCount);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchRestaurants({ search, category, page, limit: 12 });
        setRestaurants(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search, category, page]);

  const categories = useMemo(
    () => Array.from(new Set(restaurants.map((x) => x.category))).filter(Boolean),
    [restaurants]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">QuickBite</h1>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-slate-900 px-3 py-1 text-sm font-medium text-white">
                {user?.name || "User"}
              </span>
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-100"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                to="/cart"
                className="rounded-xl border border-slate-200 px-3 py-1 text-sm transition hover:bg-slate-100"
              >
                Cart: {cartCount}
              </Link>
              <button
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                onClick={() => {
                  dispatch(logout());
                  toast.success("Logged out");
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search restaurants..."
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
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
        </div>

        {!loading && restaurants.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No restaurants found for current filters.
          </div>
        ) : null}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />

        {!token ? (
          <div className="mt-6 text-center text-sm text-slate-500">
            Please <Link className="underline" to="/login">sign in</Link> to continue.
          </div>
        ) : null}
      </div>
    </div>
  );
}
