// app/(main)/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  if (status === 'loading') {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = async () => {
    if (!formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const checkoutData = {
        products: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        total: getTotal(),
        shippingInfo: {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        notes: formData.notes,
      };

      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      const paymentResponse = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal(),
          email: session?.user?.email,
        }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        throw new Error(error.error || 'Failed to initialize payment');
      }

      const { authorization_url, reference } = await paymentResponse.json();

      sessionStorage.setItem('paymentReference', reference);

      window.location.href = authorization_url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl mb-20">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+233 XXX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Accra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className="group"
                  >
                    <Link 
                      href={`/products/${item.productId}`}
                      className="flex gap-3 pb-3 border-b last:border-0 hover:bg-muted/30 rounded-lg p-2 -m-2 transition-all"
                    >
                      {/* Product Image */}
                      {item.image && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0 group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                          <Image 
                            src={item.image} 
                            alt={item.productName} 
                            fill 
                            className="object-cover" 
                            sizes="64px"
                          />
                        </div>
                      )}
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {item.productName}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1 text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          {item.size && (
                            <>
                              <span>•</span>
                              <span>{item.size}</span>
                            </>
                          )}
                          {item.color && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{item.color}</span>
                            </>
                          )}
                        </div>
                        <p className="font-semibold text-sm mt-1.5">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium text-muted-foreground">Calculated at delivery</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-accent-gold">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button
                className="w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black"
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                🔒 Secure payment powered by Paystack
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}