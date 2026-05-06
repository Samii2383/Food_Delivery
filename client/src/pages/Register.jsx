import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      const res = await register(form);
      toast.success("Account created");
      const role = res?.user?.role;
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <input
          className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
        <input
          className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        />
        <input
          className="w-full rounded-xl border border-orange-200 px-4 py-3 outline-none ring-orange-200/60 focus:ring-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          disabled={loading}
          className="brand-gradient w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-slate-900 underline">
          Login
        </Link>
      </p>
    </div>
  );
}

