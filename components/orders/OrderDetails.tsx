// components/orders/OrderDetails.tsx - Add Review/Dispute buttons
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IOrder } from '@/models/Order';
import { formatPrice, formatDate } from '@/lib/utils';
import { Star, AlertCircle, Package, Truck, CheckCircle } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';
import DisputeForm from '@/components/disputes/DisputeForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

interface OrderDetailsProps {
  order: IOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const canReview = order.status === 'delivered';
  const canDispute = ['processing', 'shipped', 'delivered'].includes(order.status);

  const handleReviewClick = (product: any) => {
    setSelectedProduct(product);
    setShowReviewForm(true);
  };

return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Order Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Order #{order._id.slice(-8)}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge
              variant={
                order.status === 'delivered'
                  ? 'default'
                  : order.status === 'cancelled'
                  ? 'destructive'
                  : 'secondary'
              }
              className="capitalize"
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Order Status</h3>
            <div className="space-y-2">
              {order.statusHistory.map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    {history.status === 'pending' && <Package className="h-4 w-4" />}
                    {history.status === 'processing' && <Package className="h-4 w-4" />}
                    {history.status === 'shipped' && <Truck className="h-4 w-4" />}
                    {history.status === 'delivered' && <CheckCircle className="h-4 w-4" />}
                    {history.status === 'cancelled' && <AlertCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm capitalize">{history.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(history.timestamp)}
                    </p>
                    {history.note && (
                      <p className="text-xs text-muted-foreground mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="pt-4 border-t">
              <p className="text-sm">
                <span className="font-semibold">Tracking Number:</span> {order.trackingNumber}
              </p>
            </div>
          )}

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="pt-4 border-t">
              <p className="text-sm">
                <span className="font-semibold">Estimated Delivery:</span>{' '}
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.products.map((item: any, index: number) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.product.images && item.product.images[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">
                    📦
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold">{item.product.name}</h4>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                  <span>Qty: {item.quantity}</span>
                </div>
                <p className="font-semibold mt-2">{formatPrice(item.price)}</p>

                {/* Review Button */}
                {canReview && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => handleReviewClick(item.product)}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Write a Review
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl">{formatPrice(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Method:</span>{' '}
              <span className="capitalize">{order.contactMethod}</span>
            </p>
            {order.contactInfo && (
              <p className="text-sm">
                <span className="font-semibold">Contact:</span> {order.contactInfo}
              </p>
            )}
            {order.notes && (
              <div className="pt-2 border-t">
                <p className="font-semibold text-sm mb-1">Notes:</p>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {canDispute && order.status !== 'cancelled' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setShowDisputeForm(true)}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Report an Issue
              </Button>
               <Button
          variant="outline"
          className="flex-1"
          asChild
        >
          <Link href="/disputes">
            View My Disputes
          </Link>
        </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ReviewForm
              orderId={order._id}
              productId={selectedProduct._id}
              productName={selectedProduct.name}
              onSuccess={() => {
                setShowReviewForm(false);
                setSelectedProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDisputeForm} onOpenChange={setShowDisputeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <DisputeForm
            orderId={order._id}
            orderNumber={order._id.slice(-8)}
            onSuccess={() => setShowDisputeForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}