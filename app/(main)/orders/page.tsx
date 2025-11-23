'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderCard from '@/components/orders/OrderCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Package } from 'lucide-react';
import { IOrder } from '@/models/Order';
import { useSession } from 'next-auth/react';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Wait for session to be loaded
    if (status === 'loading') return;
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [activeTab, status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Map 'completed' tab to 'delivered' status
      if (activeTab !== 'all') {
        const statusMap: Record<string, string> = {
          'pending': 'pending',
          'processing': 'processing',
          'completed': 'delivered', // Fix: map completed to delivered
        };
        params.append('status', statusMap[activeTab] || activeTab);
      }

      const response = await fetch(`/api/orders?${params.toString()}`,{
        cache: 'no-store', // Prevent caching issues
  headers: {
    'Content-Type': 'application/json',
  },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };


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
      ) : orders.length === 0 ? (
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
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
      </Tabs>
    </div>
  );
}