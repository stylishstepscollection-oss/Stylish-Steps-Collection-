'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsRedirecting(true);
      // Redirect to login with the current path as callback URL
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [status, router, pathname]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show redirect message
  if (status === 'unauthenticated' || isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
        <p className="text-sm text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}