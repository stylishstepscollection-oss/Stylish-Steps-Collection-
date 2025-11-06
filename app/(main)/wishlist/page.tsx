'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/products/productCard';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Heart } from 'lucide-react';
import { IProduct } from '@/models/Product';

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading wishlist..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {products.length} item{products.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Start adding products you love to your wishlist"
          action={{
            label: 'Browse Products',
            onClick: () => router.push('/products'),
          }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}