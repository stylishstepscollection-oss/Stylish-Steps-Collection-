import Navbar from '@/components/shared/Navbar';
import BottomNav from '@/components/shared/BottomNav';
import Footer from '@/components/shared/Footer';
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <Footer />
      <BottomNav />
    </div>
  );
}