// app/disputes/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import DisputeDetail from '@/components/disputes/DisputeDetail';

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

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

  // Check authorization
  if (dispute.user._id.toString() !== session.user.id) {
    redirect('/disputes');
  }

  return <DisputeDetail dispute={JSON.parse(JSON.stringify(dispute))} />;
}