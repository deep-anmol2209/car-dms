'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Something went wrong</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">An unexpected error occurred</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-2">Error Details:</p>
                <p className="text-xs text-slate-600 font-mono break-all">
                  {error.message || 'Unknown error occurred'}
                </p>
                {error.digest && (
                  <p className="text-xs text-slate-400 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={reset}
                  className="flex-1"
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
              
              <p className="text-xs text-center text-slate-500">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
