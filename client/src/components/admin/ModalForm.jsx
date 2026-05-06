import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, X } from "lucide-react";

export default function ModalForm({
  open,
  title,
  subtitle,
  submitLabel = "Save",
  onClose,
  onSubmit,
  children,
  busy
}) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={busy ? undefined : onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
                {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={busy ? undefined : onClose}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
              }}
            >
              {children}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={busy ? undefined : onClose}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy ? <LoaderCircle size={14} className="animate-spin" /> : null}
                  {busy ? "Saving..." : submitLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

