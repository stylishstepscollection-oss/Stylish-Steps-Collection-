// app/(main)/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  const makeKey = (productId: string, size?: string, color?: string) =>
    `${productId}::${size ?? ''}::${color ?? ''}`;

  const handleUpdateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    const key = makeKey(productId, size, color);
    const newQty = Math.max(1, quantity);
    setLocalQuantities((s) => ({ ...s, [key]: newQty }));
    updateQuantity(productId, newQty, size, color);
  };

  const handleRemoveItem = (productId: string, size?: string, color?: string) => {
    const key = makeKey(productId, size, color);
    setLocalQuantities((s) => {
      const next = { ...s };
      delete next[key];
      return next;
    });
    removeItem(productId, size, color);
  };

  useEffect(() => {
    setLocalQuantities((prev) => {
      const next: Record<string, number> = {};
      items.forEach((item) => {
        const k = makeKey(item.productId, item.size, item.color);
        if (prev[k] != null) next[k] = prev[k];
      });
      return next;
    });
  }, [items]);

  const displayedItemCount = items.reduce((sum, item) => {
    const key = makeKey(item.productId, item.size, item.color);
    return sum + (localQuantities[key] ?? item.quantity);
  }, 0);

  const displayedTotal = items.reduce((sum, item) => {
    const key = makeKey(item.productId, item.size, item.color);
    const qty = localQuantities[key] ?? item.quantity;
    return sum + item.price * qty;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl mb-20">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart ({displayedItemCount} items)</h1>

      <div className="space-y-4 mb-6">
        {items.map((item, index) => (
          <Card key={`${item.productId}-${item.size}-${item.color}-${index}`} className="p-4">
            <div className="flex gap-4">
              {/* Clickable Image */}
              <Link 
                href={`/products/${item.productId}`}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 hover:opacity-80 transition-opacity"
              >
                {item.image && (
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                )}
              </Link>
              
              <div className="flex-1 min-w-0">
                {/* Clickable Product Name */}
                <Link href={`/products/${item.productId}`}>
                  <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                    {item.productName}
                  </h3>
                </Link>
                <div className="text-sm text-muted-foreground space-y-1">
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                  <p className="font-semibold text-foreground">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          (localQuantities[makeKey(item.productId, item.size, item.color)] ?? item.quantity) - 1,
                          item.size,
                          item.color
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 text-sm font-medium">
                      {localQuantities[makeKey(item.productId, item.size, item.color)] ?? item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          (localQuantities[makeKey(item.productId, item.size, item.color)] ?? item.quantity) + 1,
                          item.size,
                          item.color
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleRemoveItem(item.productId, item.size, item.color)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-right font-semibold">
                {formatPrice(item.price * (localQuantities[makeKey(item.productId, item.size, item.color)] ?? item.quantity))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatPrice(displayedTotal)}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-3 border-t">
            <span>Total:</span>
            <span className="text-accent-gold">{formatPrice(displayedTotal)}</span>
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black"
          size="lg"
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </Card>
    </div>
  );
}