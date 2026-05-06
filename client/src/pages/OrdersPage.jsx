import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { fetchMyOrders } from "../features/orders/ordersApi.js";
import StatusBadge from "../components/orders/StatusBadge.jsx";
import OrderTimeline from "../components/orders/OrderTimeline.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchMyOrders({ page, limit: 8 });
        setOrders(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">My Orders</h1>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Back to home
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-600">Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-700">
                  {order.items.map((item, idx) => (
                    <div key={`${item.name}-${idx}`} className="flex items-center justify-between">
                      <span>
                        {item.name} x {item.qty}
                      </span>
                      <span>Rs {item.price * item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
                  Total: Rs {order.total}
                </div>

                <OrderTimeline status={order.status} />
              </article>
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}

