import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../../components/orders/StatusBadge.jsx";
import { adminApi } from "../../features/admin/adminApi.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Pagination from "../../components/ui/Pagination.jsx";

const statuses = ["Pending", "Preparing", "Out for delivery", "Delivered"];

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.listOrders({ page, limit: 12 });
      setOrders(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => {
      load().catch((err) => toast.error(err?.response?.data?.message || "Failed to load"));
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Orders</h1>
      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12">
          <Spinner />
        </div>
      ) : null}
      {!loading ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-slate-100">
                <td className="px-4 py-3">#{o._id.slice(-6).toUpperCase()}</td>
                <td className="px-4 py-3">{o.user?.name || "Unknown"}</td>
                <td className="px-4 py-3">Rs {o.total}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={async (e) => {
                      await adminApi.updateOrderStatus(o._id, e.target.value);
                      setOrders((prev) =>
                        prev.map((x) => (x._id === o._id ? { ...x, status: e.target.value } : x))
                      );
                      toast.success("Status updated");
                    }}
                    className="rounded-lg border border-slate-200 px-2 py-1"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : null}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

