import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import GlassAuthShell from "../components/auth/GlassAuthShell.jsx";
import AuthTextField from "../components/auth/AuthTextField.jsx";
import AuthButton from "../components/auth/AuthButton.jsx";
import { isEmail } from "../utils/validators.js";
import { registerThunk, selectIsAuthed } from "../features/auth/authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const isAuthed = useSelector(selectIsAuthed);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthed) return <Navigate to="/" replace />;

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Name is required";
    else if (name.trim().length < 2) next.name = "Name must be at least 2 characters";

    if (!email.trim()) next.email = "Email is required";
    else if (!isEmail(email)) next.email = "Enter a valid email";

    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await dispatch(registerThunk({ name, email, password }));
    setSubmitting(false);

    if (registerThunk.fulfilled.match(res)) {
      toast.success("Account created!");
      navigate("/", { replace: true });
    } else {
      toast.error(res.payload || "Registration failed");
    }
  }

  return (
    <GlassAuthShell
      title="Create account"
      subtitle="Premium experience. Fast checkout. Order history."
      footer={
        <>
          Already have an account?{" "}
          <Link className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthTextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Sameer"
          error={errors.name}
        />
        <AuthTextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password}
        />

        <AuthButton disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </AuthButton>
      </form>
    </GlassAuthShell>
  );
}

