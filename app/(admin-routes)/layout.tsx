import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/adminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isAdminSubdomain = hostname.startsWith('admin.');

  if (!isAdminSubdomain) {
    redirect('/');
  }

  if (!session) {
    redirect('/admin-login');
  }

  if (session.user.role !== 'admin') {
    redirect('/admin-login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 lg:pt-6 pb-20 lg:pb-6">
        {children}
      </main>
    </div>
  );
}