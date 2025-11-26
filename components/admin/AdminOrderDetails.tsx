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
import {
  Loader2,
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';

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

  const canUpdate = !['delivered', 'cancelled'].includes(order.status);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock, label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Package, label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck, label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle2, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle, label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[status] || colors.pending;
  };

  const handleUpdateOrder = useCallback(
    async (e: React.FormEvent) => {
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
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setUpdating(false);
      }
    },
    [order._id, status, trackingNumber, estimatedDelivery, statusNote, router]
  );

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-4 md:space-y-6 pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold truncate">
              Order #{order._id.slice(-8)}
            </h1>
            <Badge className={`${statusConfig.color} border-0 w-fit`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <User className="h-4 w-4 md:h-5 md:w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-sm md:text-base truncate">{order.user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-xs md:text-sm break-all">{order.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-sm md:text-base">{order?.shippingInfo?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-sm md:text-base break-words">
                      {order?.shippingInfo?.address}, {order?.shippingInfo?.city}
                    </p>
                  </div>
                </div>
              </div>
              {order.notes && (
                <div className="sm:col-span-2 pt-3 md:pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">Order Notes</p>
                      <p className="text-xs md:text-sm break-words">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Package className="h-4 w-4 md:h-5 md:w-5" />
                Order Items ({order.products.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {order.products.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 pb-3 md:pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xl md:text-2xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      {item.product.name}
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-2">
                      {item.size && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Size:</span> {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Color:</span> {item.color}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Qty:</span> {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                      <p className="font-semibold text-sm md:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 md:pt-4 border-t text-base md:text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-accent-gold">
                  {formatPrice(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Clock className="h-4 w-4 md:h-5 md:w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                {order.statusHistory.map((history: any, index: number) => {
                  const historyConfig = getStatusConfig(history.status);
                  const HistoryIcon = historyConfig.icon;
                  return (
                    <div key={index} className="flex gap-3 md:gap-4">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                          index === 0
                            ? 'bg-accent-gold text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <HistoryIcon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="flex-1 pb-3 md:pb-4 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <p className="font-semibold capitalize text-sm md:text-base">{history.status}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(history.timestamp)}
                          </span>
                        </div>
                        {history.note && (
                          <p className="text-xs md:text-sm text-muted-foreground break-words">{history.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Status</p>
                <Badge className={`${getPaymentStatusColor(order?.paymentStatus)} border-0`}>
                  {order?.paymentStatus === 'paid' && '✓ '}
                  {order?.paymentStatus?.charAt(0).toUpperCase() + order?.paymentStatus?.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Method</p>
                <p className="font-medium capitalize text-sm md:text-base">{order?.paymentMethod}</p>
              </div>
              {order?.paymentReference && (
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Reference</p>
                  <p className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                    {order?.paymentReference}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Order - Only show if can update */}
          {canUpdate && (
            <Card className="border-2 border-accent-gold/20">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Update Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm">Order Status</Label>
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
                    <Label htmlFor="trackingNumber" className="text-sm">
                      <Truck className="h-4 w-4 inline mr-1" />
                      Tracking Number
                    </Label>
                    <Input
                      id="trackingNumber"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDelivery" className="text-sm">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Estimated Delivery
                    </Label>
                    <Input
                      id="estimatedDelivery"
                      type="date"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="statusNote" className="text-sm">Update Note (Optional)</Label>
                    <Textarea
                      id="statusNote"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Add a note about this update..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={updating}
                  >
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
          )}

          {/* Order Completed/Cancelled Message */}
          {!canUpdate && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 text-center">
                {order.status === 'delivered' ? (
                  <>
                    <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 text-green-600" />
                    <h3 className="font-semibold text-sm md:text-base mb-1">Order Completed</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      This order has been delivered
                      {order.deliveredAt && ` on ${formatDate(order.deliveredAt)}`}
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 text-red-600" />
                    <h3 className="font-semibold text-sm md:text-base mb-1">Order Cancelled</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {order.cancellationReason || 'This order has been cancelled'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}