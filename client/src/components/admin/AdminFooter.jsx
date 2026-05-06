export default function AdminFooter() {
  return (
    <footer className="mt-8 border-t border-slate-200/80 px-4 py-4 text-xs text-slate-500 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="font-medium text-slate-600">QuickBite Admin Panel</p>
        <p>Copyright © {new Date().getFullYear()} QuickBite. v1.0.0</p>
        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:text-slate-700">
            Privacy
          </a>
          <a href="#" className="transition hover:text-slate-700">
            Support
          </a>
          <a href="#" className="transition hover:text-slate-700">
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}

