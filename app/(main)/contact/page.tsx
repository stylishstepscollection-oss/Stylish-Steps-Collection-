'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactOptions from '@/components/contact/ContactOptions';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

export default function ContactPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState<any>(null);

  useEffect(() => {
    // Get pending order info from sessionStorage
    const stored = sessionStorage.getItem('pendingOrder');
    if (stored) {
      setProductInfo(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Contact Seller</h1>
        <p className="text-muted-foreground">
          Choose your preferred method to get in touch
        </p>
      </div>

      {productInfo && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product:</span>
                <span className="font-medium">{productInfo.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">{formatPrice(productInfo.price)}</span>
              </div>
              {productInfo.size && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{productInfo.size}</span>
                </div>
              )}
              {productInfo.color && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium">{productInfo.color}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Share this information when contacting the seller
            </p>
          </CardContent>
        </Card>
      )}

      <ContactOptions productInfo={productInfo} />

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Choose your preferred contact method above</li>
            <li>Share your product details and requirements</li>
            <li>Discuss customization, sizing, and delivery</li>
            <li>Complete your order with the seller</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}