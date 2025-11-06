"use client"
import { redirect } from 'next/navigation';
import ProfileInfo from '@/components/profile/ProfileInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Ruler,
  ShoppingBag,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default  function ProfilePage() {
  const {status, data:session} = useSession()
;

  if (!session) {
    redirect('/login');
  }

  const menuItems = [
    {
      href: '/orders',
      icon: ShoppingBag,
      label: 'My Orders',
      description: 'View order history',
    },
    {
      href: '/measurement',
      icon: Ruler,
      label: 'My Measurements',
      description: 'Manage body measurements',
    },
    {
      href: '/wishlist',
      icon: Heart,
      label: 'Wishlist',
      description: 'Saved products',
    },
    {
      href: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
    },
    {
      href: '/help',
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get assistance',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileInfo user={session.user} />

          {session.user.role === 'admin' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-zinc-500 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Admin Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage store and products
                    </p>
                  </div>
                  <Button asChild className="bg-zinc-500 hover:bg-zinc-500/90">
                    <Link href="/admin">Open Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-muted-foreground">→</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}