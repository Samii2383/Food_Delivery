import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="brand-gradient inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white shadow">
            QB
          </span>
          QuickBite
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
          <Link to="/" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                >
                  Admin
                </Link>
              ) : null}
              <Link to="/cart" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">
                Cart ({itemCount})
              </Link>
              <Link to="/orders" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">
                Orders
              </Link>
              <span className="hidden text-slate-600 sm:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="brand-gradient rounded-lg px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600">
                Login
              </Link>
              <Link
                to="/register"
                className="brand-gradient rounded-lg px-3 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

