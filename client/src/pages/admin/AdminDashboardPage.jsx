import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../features/admin/adminApi.js";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err?.response?.data?.message || "Failed to load stats"));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Users" value={stats?.users ?? "-"} />
        <StatCard label="Restaurants" value={stats?.restaurants ?? "-"} />
        <StatCard label="Foods" value={stats?.foods ?? "-"} />
        <StatCard label="Orders" value={stats?.orders ?? "-"} />
        <StatCard label="Pending Orders" value={stats?.pendingOrders ?? "-"} />
        <StatCard label="Revenue" value={`Rs ${stats?.revenue ?? "-"}`} />
      </div>
    </div>
  );
}

