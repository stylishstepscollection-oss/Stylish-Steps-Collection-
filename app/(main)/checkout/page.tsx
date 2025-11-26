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
      // Store checkout data in sessionStorage for use after payment
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

      // Initialize Paystack payment WITHOUT creating order yet
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

      // Store reference for verification
      sessionStorage.setItem('paymentReference', reference);

      // Redirect to Paystack payment page
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
              <div>
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

              <div>
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

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="e.g., Accra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div>
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
              <div className="max-h-64 overflow-y-auto space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm pb-3 border-b last:border-0">
                    <div className="flex-1 pr-4">
                      <p className="font-medium line-clamp-1">{item.productName}</p>
                      <p className="text-muted-foreground text-xs">
                        Qty: {item.quantity}
                        {item.size && ` • ${item.size}`}
                        {item.color && ` • ${item.color}`}
                      </p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
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
                  <span className="font-medium">Calculated at delivery</span>
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