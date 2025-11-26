'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { IOrder } from '@/models/Order';
import { Search, Eye, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
}

interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

function isPopulatedUser(user: IOrder['user']): user is PopulatedUser {
  return user != null && typeof user === 'object' && 'name' in user && 'email' in user;
}

function isPopulatedProduct(
  product: IOrder['products'][number]['product']
): product is PopulatedProduct {
  return product != null && typeof product === 'object' && 'name' in product;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const orderId = order._id.toString().slice(-8).toLowerCase();
     
    let userName = '';
    let userEmail = '';

    if (isPopulatedUser(order.user)) {
        userName = order.user.name.toLowerCase();
        userEmail = order.user.email.toLowerCase();
    }
    
    return (
      orderId.includes(searchLower) ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      processing: 'secondary',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-500/10 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      failed: 'bg-red-500/10 text-red-700 dark:text-red-400',
      refunded: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Orders</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Search - Full width on mobile */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          
          {/* Filters - Stack on mobile, row on tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-8 md:p-12 text-center">
          <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
          <h3 className="text-base md:text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-sm md:text-base text-muted-foreground">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Orders will appear here once customers make purchases'}
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-3 md:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Order Images */}
                  <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {order.products.slice(0, 2).map((item, idx) => {
                      const product = item.product;
                      if (!isPopulatedProduct(product)) {
                        return null;
                      }
                      return product?.images?.[0] ? (
                        <div key={idx} className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null;
                    })}
                    {order.products.length > 2 && (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center text-xs md:text-sm font-medium shrink-0">
                        +{order.products.length - 2}
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 md:mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base md:text-lg truncate">
                          Order #{order._id.toString().slice(-8)}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {isPopulatedUser(order.user) && (
                            <>
                              {order.user.name} • {order.user.email}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="font-bold text-base md:text-lg">{formatPrice(order.total)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                      <Badge variant={getStatusBadge(order.status)} className="capitalize text-xs">
                        {order.status}
                      </Badge>
                      <Badge className={`${getPaymentBadge(order.paymentStatus)} text-xs`}>
                        💳 {order.paymentStatus}
                      </Badge>
                      {order.trackingNumber && (
                        <Badge variant="outline" className="font-mono text-xs">
                          📦 {order.trackingNumber}
                        </Badge>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                      <p className="truncate">📍 {order.shippingInfo?.city}, {order.shippingInfo?.address}</p>
                      <p>📞 {order.shippingInfo?.phone}</p>
                      {order.estimatedDelivery && (
                        <p>🚚 Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t md:border-t-0 md:pt-0">
                    <Button asChild size="sm" className="flex-1 md:flex-none text-xs md:text-sm">
                      <Link href={`/admin-orders/${order._id}`}>
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                size="sm"
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              
              {/* Page Numbers - Scrollable on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    size="sm"
                    className="min-w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                size="sm"
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}