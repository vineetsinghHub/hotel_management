// Elegant skeleton loaders. Use as building blocks:
//   <Skeleton className="h-8 w-40" />
//   <SkeletonText lines={3} />
//   <SkeletonCard />

export const Skeleton = ({ className = "", rounded = "rounded-[12px]", testid }) => (
  <div
    className={`aura-skeleton ${rounded} ${className}`}
    aria-busy="true"
    aria-live="polite"
    data-testid={testid}
  />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
  <div className={`space-y-2 ${className}`} aria-busy="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} rounded="rounded-full" />
    ))}
  </div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`p-5 rounded-[18px] border border-slate-200 bg-white ${className}`} aria-busy="true" data-testid="skeleton-card">
    <Skeleton className="h-40 w-full" rounded="rounded-[14px]" />
    <div className="mt-4 space-y-2">
      <Skeleton className="h-4 w-3/4" rounded="rounded-full" />
      <Skeleton className="h-3 w-1/2" rounded="rounded-full" />
    </div>
    <div className="mt-5 flex items-center justify-between">
      <Skeleton className="h-6 w-20" rounded="rounded-full" />
      <Skeleton className="h-8 w-24" rounded="rounded-full" />
    </div>
  </div>
);

export default Skeleton;
