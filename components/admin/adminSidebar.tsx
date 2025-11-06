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
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders',href: '/admin/orders', icon: ShoppingCart },
{ name: 'Users', href: '/admin/users', icon: Users },
{ name: 'Settings', href: '/admin/settings', icon: Settings },
];
export default function AdminSidebar() {
const pathname = usePathname();
return (
<aside className="w-64 border-r bg-card hidden md:block">
<div className="p-6">
<Link href="/" className="flex items-center gap-2 mb-8">
<div className="w-10 h-10 bg-zinc-500 rounded-lg flex items-center justify-center">
<span className="text-lg font-bold text-primary">SS</span>
</div>
<div>
<h2 className="font-bold">Admin Panel</h2>
<p className="text-xs text-muted-foreground">Stylish Style Collection</p>
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
      <Button variant="outline" className="w-full" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
      </Button>
    </div>
  </div>
</aside>
);
}
