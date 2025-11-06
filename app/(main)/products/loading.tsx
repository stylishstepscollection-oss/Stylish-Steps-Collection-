import ProductSkeleton from '@/components/shared/ProductSkeleton';

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}