import { motion } from "framer-motion";

export default function DashboardTable({ title, subtitle, columns, rows, renderRow, actions, emptyText = "No data found." }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/70 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100/95 text-xs uppercase tracking-wide text-slate-600 backdrop-blur">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-5 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

