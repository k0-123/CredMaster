export function AuditResultsSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      {/* Hero Skeleton */}
      <div className="h-64 bg-slate-800/40 rounded-3xl border border-slate-700/50" />
      
      {/* Title Skeleton */}
      <div className="h-8 bg-slate-800/40 rounded w-1/3" />
      
      {/* Tool Cards Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-800/40 rounded-2xl border border-slate-700/50" />
        ))}
      </div>
      
      {/* AI Summary Skeleton */}
      <div className="h-40 bg-slate-800/40 rounded-2xl border border-slate-700/50" />
    </div>
  );
}
