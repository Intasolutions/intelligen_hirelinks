'use client';

import { useEffect } from 'react';
import { Button } from '@hirelinks/ui';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">Something went wrong!</h2>
        <p className="mb-6 text-sm text-gray-400">
          An unexpected error occurred while loading this page. 
          {error.message && <span className="block mt-2 italic">"{error.message}"</span>}
        </p>
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}
