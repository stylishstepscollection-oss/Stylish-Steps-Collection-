import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/models/Order';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
  order: IOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'processing':
        return '⏳';
      case 'pending':
        return '○';
      case 'cancelled':
        return '✕';
      default:
        return '○';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Order #{order._id.slice(-8)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusColor(order.status)} className="capitalize">
            {getStatusIcon(order.status)} {order.status}
          </Badge>
        </div>

        {/* Products */}
        <div className="space-y-3 mb-4">
          {order.products.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="flex gap-3">
              {item.product?.images?.[0] ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  📦
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm line-clamp-1">
                  {item.product?.name || 'Product'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} • {formatPrice(item.price)}
                </p>
                {item.size && (
                  <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                )}
              </div>
            </div>
          ))}
          {order.products.length > 2 && (
            <p className="text-xs text-muted-foreground text-center">
              +{order.products.length - 2} more items
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-lg font-bold">{formatPrice(order.total)}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/orders/${order._id}`}>
              View Details <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}