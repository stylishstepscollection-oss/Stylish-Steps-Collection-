'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyPaymentAndCreateOrder();
  }, []);

  const verifyPaymentAndCreateOrder = async () => {
    try {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        throw new Error('Payment reference not found');
      }

      // Step 1: Verify payment with Paystack
      const verifyResponse = await fetch(`/api/payment/verify?reference=${reference}`);
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // Step 2: Get checkout data from sessionStorage
      const checkoutDataString = sessionStorage.getItem('checkoutData');
      if (!checkoutDataString) {
        throw new Error('Checkout data not found');
      }

      const checkoutData = JSON.parse(checkoutDataString);

      // Step 3: Create order with payment confirmation
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...checkoutData,
          paymentReference: reference,
          paymentStatus: 'paid',
        }),
      });

      if (!orderResponse.ok) {
        const orderError = await orderResponse.json();
        throw new Error(orderError.error || 'Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Step 4: Clean up and show success
      sessionStorage.removeItem('checkoutData');
      sessionStorage.removeItem('paymentReference');
      clearCart();
      
      setOrderId(order._id);
      setStatus('success');
    } catch (error: any) {
      console.error('Payment callback error:', error);
      setError(error.message || 'Something went wrong');
      setStatus('failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-accent-gold" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully
            </p>
            {orderId && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono font-semibold">#{orderId.slice(-8)}</p>
              </div>
            )}
            <div className="space-y-3">
              <Button asChild className="w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black">
                <Link href={`/orders/${orderId}`}>View Order Details</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'There was an issue processing your payment'}
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}