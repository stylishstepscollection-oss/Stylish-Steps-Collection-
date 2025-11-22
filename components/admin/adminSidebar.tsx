'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ArrowLeft,
  BarChart3,
  Menu,Moon, Sun, 
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import  logo from '@/public/SSC.png';
import { useTheme } from 'next-themes';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Products', href: '/admin-products', icon: Package },
  { name: 'Orders', href: '/admin-orders', icon: ShoppingCart },
  { name: 'Disputes', href: '/admin-disputes', icon: ShoppingCart },
  { name: 'Users', href: '/admin-users', icon: Users },
  { name: 'Settings', href: '/admin-settings', icon: Settings },
];

// Mobile navigation items (reduced for bottom nav)
const mobileBottomNav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin-products', icon: Package },
  { name: 'Orders', href: '/admin-orders', icon: ShoppingCart },
  { name: 'Users', href: '/admin-users', icon: Users },
];

function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <Link href="/dashboard" className="flex pl-3 items-center gap-2 mb-8">
        <div className="w-10 h-10 border-black border dark:border-white  rounded-lg flex items-center justify-center">
            <Image src={logo} alt="logo" width={150} height={150} className=''/>
        </div>
        <div>
          <h2 className="font-bold">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Stylish Steps Collection</p>
        </div>
      </Link>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-zinc-500 text-primary-dark font-medium'
                  : 'hover:bg-muted text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">
        {/* <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Site
          </Link>
        </Button> */}
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


   useEffect(() => { 
      setMounted(true);
    }, []);
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-card hidden lg:block">
        <div className="p-6">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 border-black border dark:border-white rounded-lg flex items-center justify-center">
            <Image src={logo} alt="logo" width={150} height={150} className=''/>
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </Link>
          <div className="flex gap-x-6">
                <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className=""
          >
            {mounted && (
              <>
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-64">
             <SheetHeader>
      <SheetTitle>Admin Sidebar</SheetTitle>
      </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet></div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {mobileBottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors',
                  isActive
                    ? 'text-zinc-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}