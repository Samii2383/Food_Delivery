export default function AuthButton({ children, disabled, onClick, type = "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative mt-1 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold",
        "bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500",
        "shadow-[0_12px_40px_-18px_rgba(99,102,241,0.8)]",
        "transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      ].join(" ")}
    >
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <span className="absolute inset-0 bg-white/10" />
      </span>
      <span className="relative">{children}</span>
    </button>
  );
}

