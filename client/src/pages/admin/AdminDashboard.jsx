import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HandPlatter, IndianRupee, ShoppingBag, Store } from "lucide-react";
import StatsCard from "../../components/admin/StatsCard";
import { restaurantService } from "../../services/restaurantService";
import { foodService } from "../../services/foodService";
import { orderService } from "../../services/orderService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ restaurants: 0, foods: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const [r, f, o] = await Promise.all([
          restaurantService.getRestaurants({ page: 1, limit: 1 }),
          foodService.getFoods({ page: 1, limit: 1 }),
          orderService.getAllOrders({ page: 1, limit: 100 })
        ]);

        if (!mounted) return;
        const orderRows = o?.data || [];
        const revenue = orderRows.reduce((sum, x) => sum + Number(x?.total || 0), 0);
        setStats({
          restaurants: r?.pagination?.total ?? (r?.data?.length || 0),
          foods: f?.pagination?.total ?? (f?.data?.length || 0),
          orders: o?.pagination?.total ?? orderRows.length,
          revenue
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      { title: "Total Orders", value: stats.orders, icon: ShoppingBag, trend: "+8.4%" },
      { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, trend: "+12.1%" },
      { title: "Restaurants", value: stats.restaurants, icon: Store, trend: "+4.2%" },
      { title: "Foods", value: stats.foods, icon: HandPlatter, trend: "+6.3%" }
    ],
    [stats]
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">Track growth across restaurants, foods, and orders.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[142px] animate-pulse rounded-2xl border border-slate-200 bg-white/70" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <StatsCard key={card.title} title={card.title} value={card.value} icon={card.icon} trend={card.trend} />
          ))}
        </div>
      )}
    </div>
  );
}

