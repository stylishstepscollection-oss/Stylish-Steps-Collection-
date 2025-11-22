// app/admin/disputes/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import AdminDisputeList from '@/components/admin/AdminDisputeList';

export default async function AdminDisputesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const { status } = await searchParams;

  await connectDB();
  
  const query: any = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const disputes = await Dispute.find(query)
    .populate('order')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <AdminDisputeList
      disputes={JSON.parse(JSON.stringify(disputes))}
      initialStatus={status || 'all'}
    />
  );
}