'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, getCategoryIcon, getCategoryLabel } from '@/lib/utils';
import { IProduct } from '@/models/Product';
import { Ruler, MessageCircle, ChevronLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductDetailProps {
  product: IProduct;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
const { isInWishlist, toggleWishlist } = useWishlist();
const inWishlist = isInWishlist(product._id);

  const handleContactSeller = () => {
    // Store selected product info in sessionStorage for contact page
    const orderInfo = {
      productId: product._id,
      productName: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
    };
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderInfo));
    router.push('/contact');
  };

  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Product Details</h1>
            <Button
              variant="ghost"
              size="icon"
  onClick={() => toggleWishlist(product._id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl">
                  {getCategoryEmoji(product.category)}
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg">
                    Out of Stock
</Badge>
</div>
)}
</div>
        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-accent-gold'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">
            {getCategoryIcon(product.category)} {getCategoryLabel(product.category)}
          </Badge>
          {product.featured && (
            <Badge className="bg-zinc-500">Featured</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-3xl font-bold text-accent-gold mb-4">
          {formatPrice(product.price)}
        </p>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    selectedSize === size
                      ? 'border-accent-gold bg-zinc-500 text-primary-dark'
                      : 'border-gray-300 hover:border-accent-gold'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Select Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all capitalize ${
                    selectedColor === color
                      ? 'border-accent-gold bg-zinc-500 text-primary-dark'
                      : 'border-gray-300 hover:border-accent-gold'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Info */}
        {product.stock !== undefined && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <>
                  <span className="text-green-600 font-semibold">In Stock</span> - {product.stock} available
                </>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => router.push('/measurement')}
            className="bg-accent hover:bg-accent/50 text-primary"
            disabled={!product.inStock}
          >
            <Ruler className="mr-2 h-4 w-4" />
            Get Measured
          </Button>
          <Button
            onClick={handleContactSeller}
            className="bg-accent hover:bg-accent/50 text-primary"
            disabled={!product.inStock}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        </div>

        {/* Product Details Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{getCategoryLabel(product.category)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subcategory</dt>
                <dd className="font-medium capitalize">{product.subcategory}</dd>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex justify-between items-start">
                  <dt className="text-muted-foreground">Tags</dt>
                  <dd className="flex flex-wrap gap-1 justify-end">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
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
