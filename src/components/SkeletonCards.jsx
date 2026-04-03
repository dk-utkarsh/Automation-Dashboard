export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-8 min-h-[200px] flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="skeleton w-8 h-6 rounded" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="skeleton w-24 h-5 rounded" />
        <div className="skeleton w-16 h-3 rounded" />
        <div className="skeleton w-full h-2 rounded-full mt-4" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-xl p-6 flex items-center gap-5">
          <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton w-40 h-5 rounded" />
            <div className="skeleton w-64 h-3 rounded" />
          </div>
          <div className="skeleton w-24 h-9 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
