export default function AuthTextField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  error
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <input
        value={value}
        onChange={onChange}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={[
          "mt-2 w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35",
          "transition focus:ring-2 focus:ring-indigo-400/60",
          error ? "border-rose-400/40 ring-1 ring-rose-400/20" : "border-white/10 focus:border-white/20"
        ].join(" ")}
      />
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}

