'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderCard from '@/components/orders/OrderCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Package } from 'lucide-react';
import { IOrder } from '@/models/Order';

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('status', activeTab);

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track your purchases and order history
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders found"
            description={
              activeTab === 'all'
                ? 'Start shopping to see your orders here'
                : `You don't have any ${activeTab} orders`
            }
            action={{
              label: 'Browse Products',
              onClick: () => (window.location.href = '/products'),
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <OrderCard key={index} order={order} />
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}