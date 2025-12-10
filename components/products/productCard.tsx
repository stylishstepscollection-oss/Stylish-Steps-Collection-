'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/models/Product';
import { Heart, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: IProduct;
}

interface ProductRating {
  averageRating: number;
  totalReviews: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [rating, setRating] = useState<ProductRating>({ averageRating: 0, totalReviews: 0 });
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  useEffect(() => {
    fetchRating();
  }, [product._id]);

  const fetchRating = async () => {
    try {
      const response = await fetch(`/api/reviews/stats?productId=${product._id}`);
      if (response.ok) {
        const data = await response.json();
        setRating(data);
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <Card 
      className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 bg-white dark:bg-gray-900 h-full flex flex-col rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Image Container - Better aspect ratio on mobile */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-xl">
          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 z-20 h-9 w-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                inWishlist 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </Button>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {product.featured && (
              <Badge className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-0 text-xs font-medium px-2 py-1">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="outline" className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-xs font-medium px-2 py-1">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Product Image - Using object-contain to show full image */}
          {product.images && product.images.length > 0 ? (
            <>
              <div className="relative w-full h-full p-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`object-contain transition-all duration-700 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  } ${isHovered ? 'scale-105' : 'scale-100'}`}
                  onLoad={() => setImageLoaded(true)}
                  priority={false}
                />
              </div>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-6xl opacity-20">
              {getCategoryEmoji(product.category)}
            </div>
          )}

          {/* Second Image on Hover - Desktop only */}
          {product.images && product.images.length > 1 && (
            <div className="hidden sm:block absolute inset-0 p-4">
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-contain transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                priority={false}
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-3 md:p-4 space-y-2 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {product.description || getCategoryLabel(product.category)}
          </p>

          {/* Price & Rating */}
          <div className="flex items-end justify-between pt-2 mt-auto">
            <div className="flex-1">
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </p>
              {product.stock !== undefined && product.stock > 0 && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {product.stock} in stock
                </p>
              )}
            </div>
            
            {/* Dynamic Rating */}
            {rating.totalReviews > 0 && (
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {rating.averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  ({rating.totalReviews})
                </span>
              </div>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Sizes:</span>
              {product.sizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    men: '👔',
    women: '👗',
    accessories: '⌚',
    custom: '🎨',
  };
  return emojis[category] || '📦';
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    men: "Men's Fashion",
    women: "Women's Fashion",
    accessories: 'Accessories',
    custom: 'Custom Design',
  };
  return labels[category] || 'Product';
}