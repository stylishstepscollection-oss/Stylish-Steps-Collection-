import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderDetails from '@/components/orders/OrderDetails';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  try {
    await connectDB();
    const order = await Order.findOne({
      _id: params.id,
      user: session.user.id,
    })
      .populate('products.product')
      .lean();

    if (!order) {
      notFound();
    }

    return <OrderDetails order={JSON.parse(JSON.stringify(order))} />;
  } catch (error) {
    notFound();
  }
}