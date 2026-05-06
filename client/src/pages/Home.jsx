import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import RestaurantCard from "../components/RestaurantCard";
import EmptyState from "../components/EmptyState";
import { restaurantService } from "../services/restaurantService";
import HeroSection from "../components/HeroSection";
import Header from "../components/Header";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import ReviewsSection from "../components/ReviewsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import RestaurantGridSkeleton from "../components/RestaurantGridSkeleton";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await restaurantService.getRestaurants({ limit: 50 });
        setRestaurants(res.data || []);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to fetch restaurants";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredRestaurants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter((r) => {
      const name = String(r.name || "").toLowerCase();
      const category = String(r.category || "").toLowerCase();
      return name.includes(q) || category.includes(q);
    });
  }, [restaurants, search]);

  return (
    <div className="-mt-2">
      <Header />
      <HeroSection
        onOrderNow={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })}
        onExplore={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      />

      <div id="about">
        <AboutSection />
      </div>
      <StatsSection />
      <ReviewsSection />

      <section id="restaurants" className="mt-14">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Restaurants</h2>
            <p className="mt-1 text-sm text-slate-600">Discover best places to eat around you</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants..."
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm outline-none ring-orange-200/60 focus:ring-2 sm:w-72"
            />
            <p className="hidden text-sm text-slate-500 md:block">
              Showing <span className="font-semibold text-slate-900">{filteredRestaurants.length}</span>
            </p>
          </div>
        </div>

        {loading ? <RestaurantGridSkeleton /> : null}

        {!loading && error ? (
          <EmptyState title="Could not load restaurants" subtitle={error} />
        ) : null}

        {!loading && !error && filteredRestaurants.length === 0 ? (
          <EmptyState title="No matches found" subtitle="Try a different search keyword." />
        ) : null}

        {!loading && !error && filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : null}
      </section>

      <CTASection onBrowse={() => document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" })} />

      <Footer />
    </div>
  );
}

