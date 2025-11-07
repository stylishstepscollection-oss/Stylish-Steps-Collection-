'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/models/Product';
import { Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <Card 
      className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 bg-white dark:bg-gray-900 h-full flex flex-col rounded-xl sm:rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Image Container - More square on mobile */}
        <div className="relative aspect-square sm:aspect-4/5 overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-t-xl sm:rounded-t-2xl">
          {/* Wishlist Button - Simplified for mobile */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all ${
                inWishlist 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </Button>

          {/* Status Badges - Smaller on mobile */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5">
            {product.featured && (
              <Badge className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-0 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="outline" className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Product Image */}
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } ${isHovered ? 'scale-105' : 'scale-100'}`}
                onLoad={() => setImageLoaded(true)}
                priority={false}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-4xl sm:text-6xl opacity-20">
              {getCategoryEmoji(product.category)}
            </div>
          )}

          {/* Second Image on Hover - Desktop only */}
          {product.images && product.images.length > 1 && (
            <Image
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`hidden sm:block object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              priority={false}
            />
          )}
        </div>

        {/* Product Info - Compact */}
        <CardContent className="p-2.5 sm:p-3 md:p-4 space-y-1 sm:space-y-1.5 flex-1 flex flex-col">
          {/* Product Name - Prioritized */}
          <h3 className="font-medium text-xs sm:text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {product.name}
          </h3>

          {/* Category & Description - Subtle */}
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {product.description || getCategoryLabel(product.category)}
          </p>

          {/* Price & Rating - Prominent */}
          <div className="flex items-end justify-between pt-1.5 sm:pt-2 mt-auto">
            <div className="flex-1">
              <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </p>
              {product.stock !== undefined && product.stock > 0 && (
                <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {product.stock} in stock
                </p>
              )}
            </div>
            
            {/* Rating - Compact */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">4.6</span>
            </div>
          </div>

          {/* Sizes - Bottom row, compact */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">Sizes:</span>
              {product.sizes.slice(0, 3).map((size, index) => (
                <span
                  key={index}
                  className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                  +{product.sizes.length - 3}
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