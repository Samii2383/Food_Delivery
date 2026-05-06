export default function AdminTable({ title, subtitle, columns, rows, renderRow, actions }) {
  return (
    <section className="rounded-2xl border border-orange-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-orange-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="w-full overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-orange-50/60 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-5 py-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-slate-500" colSpan={columns.length}>
                  No data
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

