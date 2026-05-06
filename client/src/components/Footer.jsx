const company = ["About", "Careers", "Team", "Contact"];
const social = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-orange-100 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900">QuickBite</p>
            <p className="mt-2 text-sm text-slate-600">
              A modern food delivery experience — fast, clean, and reliable.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {company.map((x) => (
                <li key={x}>
                  <a className="hover:text-orange-600" href="#">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Social</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {social.map((x) => (
                <li key={x.label}>
                  <a className="hover:text-orange-600" href={x.href}>
                    {x.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} QuickBite. All rights reserved.</p>
          <p>Made with React + Tailwind</p>
        </div>
      </div>
    </footer>
  );
}

