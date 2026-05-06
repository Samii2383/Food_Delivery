import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import GlassAuthShell from "../components/auth/GlassAuthShell.jsx";
import AuthTextField from "../components/auth/AuthTextField.jsx";
import AuthButton from "../components/auth/AuthButton.jsx";
import { isEmail } from "../utils/validators.js";
import { loginThunk, selectIsAuthed } from "../features/auth/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const isAuthed = useSelector(selectIsAuthed);
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthed) return <Navigate to={from} replace />;

  function validate() {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!isEmail(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await dispatch(loginThunk({ email, password }));
    setSubmitting(false);

    if (loginThunk.fulfilled.match(res)) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } else {
      toast.error(res.payload || "Login failed");
    }
  }

  return (
    <GlassAuthShell
      title="Sign in"
      subtitle="Access your account and order in seconds."
      footer={
        <>
          New here?{" "}
          <Link className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthTextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
        />
        <AuthTextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.password}
        />

        <AuthButton disabled={submitting}>{submitting ? "Signing in..." : "Sign in"}</AuthButton>
      </form>
    </GlassAuthShell>
  );
}

