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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
          {!isEditing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary mb-3 sm:mb-4">
            <AvatarFallback className="bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 text-white text-xl sm:text-2xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!isEditing && (
            <h2 className="text-xl sm:text-2xl font-bold text-center">{user.name}</h2>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input 
                id="email" 
                value={user.email} 
                disabled 
                className="text-sm sm:text-base break-all"
              />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="submit"
                className="w-full sm:flex-1 bg-zinc-500 hover:bg-zinc-500/90"
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
                className="w-full sm:flex-1"
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
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm text-muted-foreground">Full Name</Label>
              <p className="font-medium text-sm sm:text-base">{user.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs sm:text-sm text-muted-foreground">Email</Label>
              <p className="font-medium text-sm sm:text-base break-all">{user.email}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}