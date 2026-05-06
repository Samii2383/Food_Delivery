const stages = ["Pending", "Preparing", "Out for delivery", "Delivered"];

export default function OrderTimeline({ status }) {
  const activeIndex = Math.max(stages.indexOf(status), 0);

  return (
    <div className="mt-4">
      <div className="relative flex items-center justify-between gap-2">
        {stages.map((stage, index) => {
          const done = index <= activeIndex;
          return (
            <div key={stage} className="flex flex-1 flex-col items-center">
              <div
                className={`h-3 w-3 rounded-full ${
                  done ? "bg-slate-900" : "bg-slate-300"
                } transition-colors`}
              />
              <p className="mt-2 text-center text-[11px] text-slate-600">{stage}</p>
            </div>
          );
        })}
        <div className="pointer-events-none absolute left-[6%] right-[6%] top-[6px] -z-10 h-[2px] bg-slate-200" />
      </div>
    </div>
  );
}

