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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="grid gap-4 md:grid-cols-2">
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