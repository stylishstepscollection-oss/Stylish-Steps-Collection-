'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
          <p className="text-muted-foreground mb-6">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={reset}
              className="bg-zinc-500 hover:bg-zinc-500/90"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}