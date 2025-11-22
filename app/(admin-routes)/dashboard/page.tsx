'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/admin/statCard';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Star,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/models/Order';

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  outOfStockProducts: number;
  featuredProducts: number;
  recentOrders: any[];
  salesByCategory: any[];
}

// Add proper type for draft orders with populated product
interface DraftOrder extends Omit<IOrder, 'products'> {
  products: {
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftOrders, setDraftOrders] = useState<DraftOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchDraftOrders();
  }, []);

  const fetchDraftOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?status=draft');
      const data = await response.json();
      setDraftOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching draft orders:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description={`${stats.outOfStockProducts} out of stock`}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description="Registered customers"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description={`${stats.pendingOrders} pending`}
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          description={`${stats.completedOrders} completed orders`}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProducts}</div>
            <p className="text-xs text-muted-foreground">Currently featured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Draft Orders Section */}
      <Card>
  <CardHeader>
    <CardTitle>Pending Confirmations</CardTitle>
    <p className="text-sm text-muted-foreground">
      Draft orders awaiting confirmation from social media
    </p>
  </CardHeader>
  <CardContent>
    {draftOrders.length === 0 ? (
      <p className="text-center text-muted-foreground py-4">
        No draft orders pending confirmation
      </p>
    ) : (
      <div className="space-y-3">
        {draftOrders.map((order) => (
          <div key={order._id} className="border-b pb-3 last:border-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">Order #{order._id.slice(-8)}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {order.products[0]?.product?.name || 'Product details loading...'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">
                    {order.contactMethod === 'whatsapp' && '💬'}
                    {order.contactMethod === 'instagram' && '📸'}
                    {order.contactMethod === 'snapchat' && '👻'}
                  </span>
                  <Badge variant="outline" className="capitalize text-xs">
                    {order.contactMethod}
                  </Badge>
                  {order.draftExpiresAt && (
                    <span className="text-xs text-muted-foreground">
                      Expires: {formatDate(order.draftExpiresAt)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => router.push(`/admin-orders/${order._id}/confirm`)}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {order.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'pending'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.salesByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sales data yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.salesByCategory.map((cat: any) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm capitalize">{cat._id}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.count} items sold
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <p className="font-semibold">{formatPrice(cat.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}