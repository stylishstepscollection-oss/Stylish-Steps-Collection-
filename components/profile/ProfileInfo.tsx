'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProfileInfoProps {
  user: {
    name: string;
    email: string;
  };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarFallback className="bg-zinc-500 text-primary text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-zinc-500 hover:bg-zinc-500/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name });
                }}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Full Name</Label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}