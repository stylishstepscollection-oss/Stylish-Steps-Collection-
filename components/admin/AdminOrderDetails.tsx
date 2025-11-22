// components/admin/AdminOrderDetail.tsx
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AdminOrderDetailProps {
  order: any;
}

export default function AdminOrderDetail({ order: initialOrder }: AdminOrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : ''
  );
  const [statusNote, setStatusNote] = useState('');

  // Use useCallback to prevent function recreation on every render
  const handleUpdateOrder = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() || undefined,
          estimatedDelivery: estimatedDelivery || undefined,
          statusNote: statusNote.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      setOrder(data.order);
      setStatusNote('');
      toast.success('Order updated successfully');
      
      // Refresh the page data without causing a loop
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  }, [order._id, status, trackingNumber, estimatedDelivery, statusNote, router]);

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
      </Card>

      {/* Customer Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Name:</span> {order.user.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email:</span> {order.user.email}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Contact Method:</span>{' '}
            <span className="capitalize">{order.contactMethod}</span>
          </p>
          {/* <p className="text-sm">
            <span className="font-semibold">Contact Info:</span> {order.contactInfo}
          </p> */}
          {order.notes && (
            <div className="pt-2 border-t">
              <p className="font-semibold text-sm mb-1">Customer Notes:</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
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
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">📦</div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{item.product.name}</h4>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                  <span>Qty: {item.quantity}</span>
                </div>
                <p className="font-semibold mt-2">{formatPrice(item.price)}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl">{formatPrice(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Update Order Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusNote">Status Update Note (Optional)</Label>
              <Textarea
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note about this status update..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full disabled:cursor-not-allowed" disabled={updating || order.status === 'delivered'} >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Order'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.statusHistory.map((history: any, index: number) => (
              <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium capitalize">{history.status}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(history.timestamp)}
                  </p>
                  {history.note && (
                    <p className="text-sm text-muted-foreground mt-1">{history.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}