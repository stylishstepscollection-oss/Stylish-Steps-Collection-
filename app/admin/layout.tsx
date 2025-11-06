import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/adminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}