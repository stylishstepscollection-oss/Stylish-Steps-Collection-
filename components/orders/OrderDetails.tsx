'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/models/Order';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderDetailsProps {
  order: IOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleContactSeller = () => {
    router.push('/contact');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge variant={getStatusColor(order.status)} className="capitalize">
                {order.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items ({order.products.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.products.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                {item.product?.images?.[0] ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.product?.name || 'Product'}</h3>
                  {item.size && (
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>To be determined</span>
            </div>
            <div className="flex justify-between pt-3 border-t font-semibold text-lg">
              <span>Total</span>
              <span className="text-accent-gold">{formatPrice(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Contact Method</p>
                <p className="font-medium capitalize">{order.contactMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Info</p>
                <p className="font-medium">{order.contactInfo}</p>
              </div>
              {order.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Order Notes</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleContactSeller}
            className="flex-1 bg-success hover:bg-success/90"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  );
}