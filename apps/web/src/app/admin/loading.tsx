export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-admin-card border-t-blue-600"></div>
        <p className="text-sm font-medium animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}
