// app/disputes/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import UserDisputeList from '@/components/disputes/UserDisputeList';

export default async function DisputesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  await connectDB();
  
  const disputes = await Dispute.find({ user: session.user.id })
    .populate('order')
    .sort({ createdAt: -1 })
    .lean();

  return <UserDisputeList disputes={JSON.parse(JSON.stringify(disputes))} />;
}