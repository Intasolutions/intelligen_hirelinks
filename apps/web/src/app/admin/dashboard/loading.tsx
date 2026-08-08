export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 lg:p-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="mb-8 border-b border-admin-card pb-8">
        <div className="h-10 bg-admin-card rounded w-1/3 mb-4"></div>
        <div className="h-5 bg-admin-card rounded w-1/2"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl bg-admin-bg p-6 shadow-sm border border-admin-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-admin-card mb-4"></div>
            <div className="h-8 bg-admin-card rounded w-16 mb-2"></div>
            <div className="h-4 bg-admin-card rounded w-24"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content Skeleton */}
        <div className="lg:col-span-2 rounded-xl bg-admin-bg shadow-sm border border-admin-card p-6">
          <div className="h-6 bg-admin-card rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-admin-card rounded-lg w-full"></div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="rounded-xl bg-admin-bg shadow-sm border border-admin-card p-6">
          <div className="h-6 bg-admin-card rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-admin-card rounded-lg w-full mb-4"></div>
          <div className="h-16 bg-admin-card rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}
