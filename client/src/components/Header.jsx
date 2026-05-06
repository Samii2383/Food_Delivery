import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight text-slate-900">
          <span className="brand-gradient inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white shadow">
            QB
          </span>
          QuickBite
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                to="/orders"
                className="rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Profile
              </Link>
              <Link
                to="/cart"
                className="rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Cart ({itemCount})
              </Link>
              <span className="hidden text-slate-500 sm:inline">{user?.name}</span>
              <button
                onClick={logout}
                className="brand-gradient rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="brand-gradient rounded-xl px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

