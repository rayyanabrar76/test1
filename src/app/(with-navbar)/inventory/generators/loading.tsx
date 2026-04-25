export default function InventoryLoading() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-24 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 space-y-8">

        {/* Section header skeleton */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="space-y-4">
            
            {/* Title */}
            <div className="flex items-center gap-4 py-4 border-b border-white/5">
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Cards row */}
            <div className="flex gap-4 overflow-hidden">
              {[1, 2].map((card) => (
                <div
                  key={card}
                  className="min-w-[80vw] md:min-w-[400px] border border-white/5 rounded-none bg-white/[0.02] shrink-0"
                >
                  {/* Top label bar */}
                  <div className="flex justify-between px-4 py-3 border-b border-white/5">
                    <div className="h-2 w-32 bg-white/10 rounded animate-pulse" />
                    <div className="h-2 w-16 bg-white/5 rounded animate-pulse" />
                  </div>

                  {/* Image placeholder */}
                  <div className="w-full aspect-[4/3] bg-white/[0.03] animate-pulse" />

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-5 w-4/5 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-3/5 bg-white/10 rounded animate-pulse" />

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-8 bg-white/[0.03] border border-white/5 rounded animate-pulse" />
                      <div className="h-8 bg-white/[0.03] border border-white/5 rounded animate-pulse" />
                    </div>

                    {/* Button */}
                    <div className="flex gap-2 pt-1">
                      <div className="flex-1 h-12 bg-white/10 rounded animate-pulse" />
                      <div className="w-12 h-12 bg-white/5 border border-white/5 rounded animate-pulse" />
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