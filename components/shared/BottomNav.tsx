'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Ruler, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Shop', icon: ShoppingBag },
  { href: '/measurement', label: 'Measure', icon: Ruler },
   { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on auth pages
  if (pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors',
                isActive
                  ? 'text-accent-gold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}