'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const hostname = window.location.hostname;
    const isAdmin = hostname.startsWith('admin.');
    setIsAdminSubdomain(isAdmin);
    
    // If not on admin subdomain, redirect to home
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, []);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    
    if (result?.error) {
      toast.error('Invalid credentials or insufficient permissions');
    } else if (result?.ok) {
      // Fetch session to verify role
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (session?.user?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        await signOut({ redirect: false });
        return;
      }
      
      toast.success('Welcome to Admin Panel');
      window.location.href = '/dashboard';
    }
  } catch (error) {
    toast.error('Something went wrong. Please try again.');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};
  if (!isAdminSubdomain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-zinc-500 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Secure login for authorized administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-zinc-500 hover:bg-zinc-600" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Admin'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}