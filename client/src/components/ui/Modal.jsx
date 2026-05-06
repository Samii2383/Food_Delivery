export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-100"
          >
            X
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

