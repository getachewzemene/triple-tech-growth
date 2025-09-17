'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                Error details (development only)
              </summary>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="space-y-4">
          <Button onClick={reset} size="lg" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            If this problem persists, please <Link href="/" className="text-blue-600 hover:underline">contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}