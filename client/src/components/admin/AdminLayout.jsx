import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/restaurants", label: "Restaurants" },
  { to: "/admin/foods", label: "Foods" },
  { to: "/admin/orders", label: "Orders" }
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <h2 className="px-3 py-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Admin Panel
          </h2>
          <nav className="mt-2 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

