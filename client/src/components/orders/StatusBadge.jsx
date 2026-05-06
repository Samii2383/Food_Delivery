const statusMap = {
  Pending: "bg-amber-100 text-amber-800",
  Preparing: "bg-indigo-100 text-indigo-800",
  "Out for delivery": "bg-sky-100 text-sky-800",
  Delivered: "bg-emerald-100 text-emerald-800"
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusMap[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

