'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <Alert variant={isOnline ? 'default' : 'destructive'}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription>
          {isOnline
            ? 'Back online! All features are available.'
            : 'You are offline. Some features may be limited.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}