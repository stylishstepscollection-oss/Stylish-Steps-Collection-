// components/profile/ProfileInfo.tsx
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, X, Loader2, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import imageCompression from 'browser-image-compression';
interface ProfileInfoProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    image: user.image || '',
  });
  const [previewImage, setPreviewImage] = useState(user.image || '');
console.log(user);
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size must be less than 5MB');
    return;
  }

  setIsUploadingImage(true);

  try {
    // Compress image before upload
    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 1024, // Maximum width or height
      useWebWorker: true,
      fileType: file.type,
    };

    const compressedFile = await imageCompression(file, options);
    
    // Create preview from compressed file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(compressedFile);

    // Upload to server
    const uploadFormData = new FormData();
    uploadFormData.append('file', compressedFile);
    uploadFormData.append('purpose', 'profile');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    setFormData({ ...formData, image: data.url });
    toast.success('Image uploaded successfully');
  } catch (error: any) {
    console.error('Upload error:', error);
    toast.error(error.message || 'Failed to upload image');
    setPreviewImage(user.image || '');
  } finally {
    setIsUploadingImage(false);
  }
};
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    const data = await response.json();

    // Update the session with new user data
    await updateSession({
      user: {
        ...session?.user,
        name: formData.name,
        image: formData.image,
      },
    });

    toast.success('Profile updated successfully');
    setIsEditing(false);
    router.refresh();
  } catch (error: any) {
    toast.error(error.message || 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: user.name, image: user.image || '' });
    setPreviewImage(user.image || '');
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
          <div className="relative group">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary mb-3 sm:mb-4">
              {previewImage ? (
                <AvatarImage src={previewImage} alt={formData.name} className='object-cover'/>
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white text-xl sm:text-2xl font-bold">
                  {getInitials(formData.name)}
                </AvatarFallback>
              )}
            </Avatar>
            
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleImageClick}
                  disabled={isUploadingImage}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploadingImage ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {isEditing && previewImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploadingImage || isLoading}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Photo
            </Button>
          )}

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
                disabled={isLoading || isUploadingImage}
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
                className="w-full sm:flex-1 border text-black border-black dark:border-0 bg-white hover:bg-white/90"
                disabled={isLoading || isUploadingImage}
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
                onClick={handleCancel}
                disabled={isLoading || isUploadingImage}
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