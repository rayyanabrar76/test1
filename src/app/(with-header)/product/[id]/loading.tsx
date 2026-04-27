export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden pt-24 pb-32 md:pb-16">
      <div className="max-w-[1600px] mx-auto px-4">

        {/* Return link */}
        <div className="py-5 flex items-center gap-2">
          <div className="h-[1px] w-4 bg-white/20" />
          <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Layout: stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:border md:border-white/5">

          {/* Product image */}
          <div className="md:border-r md:border-white/5">
            <div className="w-full aspect-[4/3] bg-white/[0.03] animate-pulse" />
          </div>

          {/* Right / bottom content */}
          <div className="pt-6 md:p-8 space-y-5 flex flex-col md:justify-center">

            {/* Badge + category */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-2 w-36 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Title — 3 lines */}
            <div className="space-y-3">
              <div className="h-9 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-9 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-9 w-4/6 bg-white/10 rounded animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 w-full bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-white/[0.06] rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-white/[0.06] rounded animate-pulse" />
            </div>

            {/* Spec grid — hidden on mobile, shown on desktop */}
            <div className="hidden md:grid grid-cols-2 gap-2 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-white/[0.03] border border-white/5 animate-pulse"
                />
              ))}
            </div>

            {/* CTA — desktop only (mobile has fixed bar below) */}
            <div className="hidden md:flex gap-2 pt-2">
              <div className="flex-1 h-12 bg-white/10 animate-pulse" />
              <div className="w-12 h-12 bg-white/5 border border-white/5 animate-pulse" />
            </div>

          </div>
        </div>
      </div>

      {/* Fixed bottom CTA bar — mobile only */}
      <div className="fixed bottom-16 left-0 right-0 md:hidden px-4 py-3 bg-black/90 border-t border-white/5 flex gap-3">
        <div className="flex-1 h-14 bg-white/10 rounded-full animate-pulse" />
        <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
      </div>

    </div>
  );
}
