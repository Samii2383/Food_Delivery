import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend = "+0%" }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-md"
    >
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-orange-200/60 to-amber-100/20 blur-2xl" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow">
            <Icon size={16} />
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
          <TrendingUp size={12} />
          {trend}
        </p>
      </div>
    </motion.div>
  );
}

