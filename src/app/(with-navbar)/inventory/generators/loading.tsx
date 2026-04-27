export default function GeneratorLoading() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-24 pb-32">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {[1, 2, 3].map((section) => (
          <div key={section}>

            {/* Section Header */}
            <div className="px-4 py-6 border-b border-white/5 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-red-600/40" />
                <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-2 w-20 bg-white/5 rounded animate-pulse" />
              <div className="ml-auto h-2 w-24 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Cards Grid — 1 col mobile, 3 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-white/5">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="border-r border-white/5 last:border-r-0"
                >
                  {/* Top label bar */}
                  <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white/10 rounded-full animate-pulse" />
                      <div className="h-2 w-36 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
                  </div>

                  {/* Image placeholder */}
                  <div className="w-full aspect-[4/3] bg-white/[0.03] animate-pulse" />

                  {/* Content */}
                  <div className="p-4 space-y-3 border-t border-white/5">
                    {/* Category */}
                    <div className="h-2 w-28 bg-white/10 rounded animate-pulse" />
                    {/* Title */}
                    <div className="h-5 w-4/5 bg-white/10 rounded animate-pulse" />
                    <div className="h-5 w-3/5 bg-white/10 rounded animate-pulse" />

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-10 bg-white/[0.03] border border-white/5 animate-pulse" />
                      <div className="h-10 bg-white/[0.03] border border-white/5 animate-pulse" />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <div className="flex-1 h-12 bg-white/10 animate-pulse" />
                      <div className="w-12 h-12 bg-white/5 border border-white/5 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
