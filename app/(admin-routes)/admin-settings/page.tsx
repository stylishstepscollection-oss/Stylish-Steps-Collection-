'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Lock, Bell, Store, User } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    disputes: true,
    lowStock: true,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem('adminNotifications', JSON.stringify(notificationSettings));
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account and store preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword" className='mb-2'>Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className='mb-2'>New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className='mb-2'>Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New Orders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new orders are placed
                </p>
              </div>
              <Switch
                checked={notificationSettings.newOrders}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, newOrders: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dispute Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new disputes
                </p>
              </div>
              <Switch
                checked={notificationSettings.disputes}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, disputes: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are low in stock
                </p>
              </div>
              <Switch
                checked={notificationSettings.lowStock}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, lowStock: checked })
                }
              />
            </div>
            <Button onClick={handleNotificationSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </CardContent>
        </Card> */}

        {/* Store Contact Information */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>WhatsApp Number</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || 'Not configured'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Configure in environment variables: NEXT_PUBLIC_WHATSAPP_NUMBER
              </p>
            </div>
            <div>
              <Label>Snapchat Username</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {process.env.NEXT_PUBLIC_SNAPCHAT_USERNAME || 'Not configured'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Configure in environment variables: NEXT_PUBLIC_SNAPCHAT_USERNAME
              </p>
            </div>
            <div>
              <Label>Instagram Username</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'Not configured'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Configure in environment variables: NEXT_PUBLIC_INSTAGRAM_USERNAME
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}