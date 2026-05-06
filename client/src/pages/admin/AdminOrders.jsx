import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import DashboardTable from "../../components/admin/DashboardTable";
import { orderService } from "../../services/orderService";

const statuses = ["Pending", "Preparing", "Out for delivery", "Delivered"];

function statusClass(status) {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "preparing":
      return "bg-blue-100 text-blue-700";
    case "delivered":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  async function load() {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders({ page: 1, limit: 50 });
      setRows(res?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function updateStatus(orderId, status) {
    try {
      await orderService.updateOrderStatus(orderId, { status });
      toast.success("Order status updated");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  }

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "user", label: "User" },
    { key: "total", label: "Total" },
    { key: "paymentMethod", label: "Payment" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" }
  ];

  function paymentStatusClass(status) {
    switch (String(status || "").toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";
      case "failed":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  }

  return (
    <div>
      <DashboardTable
        title="Orders"
        subtitle="View and update order statuses."
        columns={columns}
        rows={rows}
        emptyText="No orders found yet."
        renderRow={(o) => (
          <tr key={o._id} className="text-slate-700 transition hover:bg-slate-50/80">
            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-700">{String(o._id).slice(-10)}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <p className="font-semibold text-slate-900">{o.user?.name || "-"}</p>
              <p className="text-xs text-slate-500">{o.user?.email || ""}</p>
            </td>
            <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">₹{o.total}</td>
            <td className="whitespace-nowrap px-5 py-4">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{o.paymentMethod || "COD"}</span>
            </td>
            <td className="whitespace-nowrap px-5 py-4">
              <span className={["rounded-full px-2.5 py-1 text-xs font-semibold", paymentStatusClass(o.paymentStatus)].join(" ")}>
                {o.paymentStatus || "pending"}
              </span>
            </td>
            <td className="whitespace-nowrap px-5 py-4">
              <div className="flex items-center gap-2">
                <span className={["rounded-full px-2.5 py-1 text-xs font-semibold", statusClass(o.status)].join(" ")}>{o.status}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none ring-orange-200/60 focus:ring-2"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
              {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
            </td>
          </tr>
        )}
      />

      {loading ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-slate-500">
          Loading orders...
        </motion.p>
      ) : null}
    </div>
  );
}

