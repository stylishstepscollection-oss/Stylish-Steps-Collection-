'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallback?: string;
}

export default function BackButton({ fallback = '/' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <Button variant="ghost" onClick={handleBack} className="mb-4">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  );
}