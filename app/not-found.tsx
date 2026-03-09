'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestionIcon, HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
              <FileQuestionIcon className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <p className="text-slate-500 mt-2">
            The page you&apos;re looking for doesn&apos;t exist in Adaptus DMS
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-slate-200">404</div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              The page may have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">
                <HomeIcon className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go Back
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-slate-500">
              Need help? Check our documentation or contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
