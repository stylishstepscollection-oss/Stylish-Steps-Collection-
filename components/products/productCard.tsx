'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/models/Product';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-card">
      <Link href={`/products/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Status Badges */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-accent-gold text-primary-dark border-0 shadow-lg backdrop-blur-sm">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  Featured
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive" className="border-0 shadow-lg backdrop-blur-sm">
                  Out of Stock
                </Badge>
              )}
            </div>
            
            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:scale-110 transition-transform shadow-lg"
              onClick={handleWishlistClick}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
                }`}
              />
            </Button>
          </div>

          {/* Product Image */}
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                priority={false}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-6xl md:text-7xl opacity-30">
              {getCategoryEmoji(product.category)}
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick view or add to cart functionality
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-3 md:p-4 space-y-2">
          {/* Category/Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {getCategoryLabel(product.category)}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[2.5rem] group-hover:text-accent-gold transition-colors">
            {product.name}
          </h3>

          {/* Description - Hidden on mobile, shown on tablet+ */}
          <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground">Sizes:</span>
              {product.sizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price & Stock */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <p className="text-lg md:text-xl font-bold text-accent-gold">
                {formatPrice(product.price)}
              </p>
              {product.stock !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              )}
            </div>
            
            {/* Rating (if you add reviews later) */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent-gold text-accent-gold" />
              <span className="text-sm font-medium">4.5</span>
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