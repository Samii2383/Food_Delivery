import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import FoodCard from "../components/FoodCard";
import { useCart } from "../hooks/useCart";

export default function Restaurant() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [restaurantRes, foodsRes] = await Promise.all([
          restaurantService.getRestaurant(id),
          foodService.getFoods({ restaurantId: id, limit: 50 })
        ]);
        setRestaurant(restaurantRes.data);
        setFoods(foodsRes.data || []);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load restaurant";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Could not load restaurant" subtitle={error} />;

  return (
    <section>
      <div className="glass-card mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{restaurant?.name}</h1>
          <p className="text-slate-600">{restaurant?.description}</p>
        </div>
        <Link
          to="/cart"
          className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50"
        >
          Go to Cart
        </Link>
      </div>

      {foods.length === 0 ? (
        <EmptyState title="No foods listed" subtitle="This restaurant has no menu items yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onAdd={() => {
                addToCart({ id: food._id, name: food.name, price: food.price });
                toast.success(`${food.name} added to cart`);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

