import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-zinc-500 hover:bg-zinc-500/90">
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}