export default function Spinner({ size = "md" }) {
  const s = size === "sm" ? "h-4 w-4 border-2" : "h-6 w-6 border-[3px]";
  return (
    <span
      className={`inline-block ${s} animate-spin rounded-full border-slate-300 border-t-slate-900`}
      aria-label="Loading"
    />
  );
}

