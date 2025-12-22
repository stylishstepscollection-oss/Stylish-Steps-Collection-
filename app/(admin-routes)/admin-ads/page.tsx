// app/admin-ads/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Ad from '@/models/Ads';
import AdsManager from '@/components/admin/AdsManager';

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();
  const ads = await Ad.find().sort({ priority: -1, createdAt: -1 }).lean();
  const serializedAds = JSON.parse(JSON.stringify(ads));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Advertisements</h1>
        <p className="text-muted-foreground">
          Create and manage product ads and sponsored content
        </p>
      </div>
      <AdsManager initialAds={serializedAds} />
    </div>
  );
}