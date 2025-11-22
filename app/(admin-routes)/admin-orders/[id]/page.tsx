// app/admin-orders/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import AdminOrderDetail from '@/components/admin/AdminOrderDetails';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await params;

  await connectDB();
  const order = await Order.findById(id)
    .populate('user', 'name email')
    .populate('products.product', 'name price images')
    .lean();

  if (!order) {
    return <div>Order not found</div>;
  }

  return <AdminOrderDetail order={JSON.parse(JSON.stringify(order))} />;
}