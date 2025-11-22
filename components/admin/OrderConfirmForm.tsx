// components/admin/OrderConfirmForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Loader2, Package, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface OrderConfirmFormProps {
  order: any;
}

export default function OrderConfirmForm({ order }: OrderConfirmFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contactInfo: '',
    externalOrderId: '',
    estimatedDelivery: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactInfo.trim()) {
      toast.error('Please enter customer contact information');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/orders/${order._id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm order');
      }

      toast.success('Order confirmed successfully!');
      router.push('/admin-orders');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'whatsapp':
        return '💬';
      case 'instagram':
        return '📸';
      case 'snapchat':
        return '👻';
      default:
        return '📱';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Confirm Draft Order</h1>
        <p className="text-muted-foreground">
          Order #{order._id.slice(-8)} • Created {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl">{getContactMethodIcon(order.contactMethod)}</span>
                  <Badge variant="outline" className="capitalize">
                    {order.contactMethod}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.products.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">
                        📦
                      </div>
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

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Confirmation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Confirmation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">
                    Customer Contact Info * (Phone/Username)
                  </Label>
                  <Input
                    id="contactInfo"
                    placeholder="e.g., +233XXXXXXXXX or @username"
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the contact information from the {order.contactMethod} conversation
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalOrderId">
                    External Order ID (Optional)
                  </Label>
                  <Input
                    id="externalOrderId"
                    placeholder="e.g., WhatsApp message ID or conversation reference"
                    value={formData.externalOrderId}
                    onChange={(e) =>
                      setFormData({ ...formData, externalOrderId: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">
                    Estimated Delivery Date (Optional)
                  </Label>
                  <Input
                    id="estimatedDelivery"
                    type="date"
                    value={formData.estimatedDelivery}
                    onChange={(e) =>
                      setFormData({ ...formData, estimatedDelivery: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special instructions or notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      'Confirm Order'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Timeline - 1 column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((history: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      {index < order.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm capitalize">{history.status}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(history.timestamp)}
                      </p>
                      {history.note && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {history.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}