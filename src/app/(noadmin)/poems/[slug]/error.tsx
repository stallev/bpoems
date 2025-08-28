'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/shadcnComponents/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Poem page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8">
        {error.message || 'An error occurred while loading the poem.'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
