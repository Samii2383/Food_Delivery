import { Link } from "react-router-dom";

export default function GlassAuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500/40 via-indigo-500/35 to-cyan-500/35 blur-3xl" />
        <div className="absolute -bottom-40 right-[-10rem] h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-500/25 to-sky-500/25 blur-3xl" />
        <div className="absolute -bottom-40 left-[-10rem] h-96 w-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                QB
              </span>
              <span className="text-lg font-semibold tracking-tight">QuickBite</span>
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="mb-5">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-white/70">{subtitle}</p>
              ) : null}
            </div>
            {children}
          </div>

          {footer ? <div className="mt-5 text-center text-sm text-white/70">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

