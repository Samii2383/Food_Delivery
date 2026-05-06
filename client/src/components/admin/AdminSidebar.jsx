import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, LayoutDashboard, Settings, ShoppingBag, Store, UtensilsCrossed, X } from "lucide-react";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/restaurants", label: "Restaurants", icon: Store },
  { to: "/admin/foods", label: "Foods", icon: UtensilsCrossed },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: null, label: "Analytics", icon: BarChart3, disabled: true },
  { to: null, label: "Settings", icon: Settings, disabled: true }
];

function Item({ item, onNavigate }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400">
        <Icon size={17} />
        <span>{item.label}</span>
        <span className="ml-auto rounded-md border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">Soon</span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive ? "text-white" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="admin-active-tab"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-600/20"
            />
          ) : null}
          <Icon size={17} className="relative z-10" />
          <span className="relative z-10">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        className={[
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:z-20 md:h-screen"
        ].join(" ")}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-sm font-black text-white shadow-lg shadow-orange-500/30">
              QB
            </span>
            <div>
              <p className="text-sm font-semibold text-white">QuickBite</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Item key={item.label} item={item} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}

