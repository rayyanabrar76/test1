export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-20 md:pt-24 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-6 md:space-y-8">

        {/* Top bar */}
        <div className="flex items-center gap-3 md:gap-4 py-4 border-b border-white/5">
          <div className="h-[1px] w-6 md:w-8 bg-red-600/40" />
          <div className="h-2.5 md:h-3 w-28 md:w-40 bg-white/10 rounded animate-pulse" />
          <div className="ml-auto h-2 w-16 md:w-24 bg-white/5 rounded animate-pulse" />
        </div>

        {/* Block rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2 md:space-y-3">
            {/* Row label */}
            <div
              className="h-3 bg-white/10 rounded animate-pulse"
              style={{ width: `${25 + (i % 3) * 10}%` }}
            />
            {/* Row block — taller on desktop */}
            <div className="h-12 md:h-16 w-full bg-white/[0.03] border border-white/5 animate-pulse" />
          </div>
        ))}

        {/* Bottom grid — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 pt-2 border-t border-white/5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="md:border-r md:border-white/5 md:last:border-r-0 p-0 md:p-4"
            >
              <div className="h-24 md:h-32 bg-white/[0.03] border border-white/5 md:border-0 animate-pulse" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
