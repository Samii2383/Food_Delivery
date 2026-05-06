import { Link, useLocation } from "react-router-dom";
import { Bell, LogOut, Menu, Search } from "lucide-react";

const titleMap = {
  "/admin": "Dashboard",
  "/admin/restaurants": "Restaurants",
  "/admin/foods": "Foods",
  "/admin/orders": "Orders"
};

export default function AdminHeader({ user, onLogout, onMenuClick }) {
  const location = useLocation();
  const title = titleMap[location.pathname] || "Admin";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-900 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">{title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/admin" className="transition hover:text-slate-700">
                Admin
              </Link>
              <span>/</span>
              <span className="truncate text-slate-600">{title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500 shadow-sm lg:flex">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell size={17} />
          </button>

          <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:block">
            <p className="text-xs font-semibold text-slate-800">{user?.name || "Admin"}</p>
            <p className="max-w-[150px] truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110 sm:text-sm"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

