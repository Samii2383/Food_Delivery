import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { orderService } from "../services/orderService";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders({ limit: 50 });
        setOrders(res.data || []);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load orders";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Could not load orders" subtitle={error} />;
  if (orders.length === 0) return <EmptyState title="No orders yet" subtitle="Place your first order." />;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</p>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {order.status}
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              {order.items.map((item, idx) => (
                <p key={`${item.name}-${idx}`}>
                  {item.name} x {item.qty} - Rs {item.price * item.qty}
                </p>
              ))}
            </div>
            <p className="mt-3 border-t border-slate-200 pt-2 font-semibold">Total: Rs {order.total}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

