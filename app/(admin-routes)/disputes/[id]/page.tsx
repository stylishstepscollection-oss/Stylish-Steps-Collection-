// app/admin/disputes/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import AdminDisputeDetail from '@/components/admin/AdminDisputeDetail';

export default async function AdminDisputeDetailPage({
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
  const dispute = await Dispute.findById(id)
    .populate('order')
    .populate('user', 'name email')
    .populate('messages.sender', 'name')
    .lean();

  if (!dispute) {
    return <div>Dispute not found</div>;
  }

  return <AdminDisputeDetail dispute={JSON.parse(JSON.stringify(dispute))} />;
}