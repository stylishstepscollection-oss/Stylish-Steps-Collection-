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
      className="group relative overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 bg-white dark:bg-gray-900 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800">
          {/* Wishlist Button - Top Right */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                inWishlist 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </Button>

          {/* Status Badges - Top Left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
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

        {/* Product Info */}
        <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
              {getCategoryLabel(product.category)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">4.5</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {product.name}
          </h3>

          {/* Sizes - Compact */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price & Stock */}
          <div className="flex items-end justify-between pt-3 mt-auto border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </p>
              {product.stock !== undefined && product.stock > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {product.stock} in stock
                </p>
              )}
            </div>
          </div>
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
    men: "Men's",
    women: "Women's",
    accessories: 'Accessories',
    custom: 'Custom',
  };
  return labels[category] || 'Product';
}