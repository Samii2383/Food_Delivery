import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/restaurants", label: "Restaurants" },
  { to: "/admin/foods", label: "Foods" },
  { to: "/admin/orders", label: "Orders" }
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-orange-100 bg-white/90 p-3 backdrop-blur md:w-64 md:border-b-0 md:border-r md:p-4">
      <div className="mb-3 flex items-center gap-2 px-2">
        <span className="brand-gradient inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow">
          A
        </span>
        <div>
          <p className="text-sm font-extrabold tracking-tight text-slate-900">Admin</p>
          <p className="text-xs text-slate-500">QuickBite Console</p>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 md:flex-col">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/admin"}
            className={({ isActive }) =>
              [
                "rounded-xl px-3 py-2 text-sm font-semibold transition",
                isActive ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-orange-50 hover:text-orange-700"
              ].join(" ")
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

