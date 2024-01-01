export default function ListingCardSkeleton() {
  return (
    <div className="w-64 rounded-lg border border-gray-200 bg-white shadow-sm transition-all">
      <div className="h-48 w-full animate-pulse bg-gray-200" />
      <div className="mx-4 mt-6 h-4 animate-pulse rounded-full bg-gray-200" />
      <div className="m-4 h-3 animate-pulse rounded-full bg-gray-200" />
      <div className="m-4 h-4 w-1/2 animate-pulse rounded-full bg-gray-200" />
    </div>
  )
}
