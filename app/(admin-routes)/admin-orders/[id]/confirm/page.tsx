// app/admin-orders/[id]/confirm/page.tsx
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderConfirmForm from '@/components/admin/OrderConfirmForm';

interface OrderConfirmPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmPage({ params }: OrderConfirmPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    notFound();
  }

  try {
    await connectDB();
    const { id } = await params;
    
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('products.product', 'name price images')
      .lean();

  

    return <OrderConfirmForm order={JSON.parse(JSON.stringify(order))} />;
  } catch (error) {
    notFound();
  }
}