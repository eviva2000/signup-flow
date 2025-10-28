"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui';

interface SignupErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SignupError({ error, reset }: SignupErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Signup page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          {/* Error icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-waitly-neutral-900 mb-4">
            Something went wrong
          </h1>
          
          <p className="text-waitly-neutral-600 mb-8 leading-relaxed">
            We encountered an error while loading the signup page. This is usually temporary.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Try again
          </Button>
          
          <Button
            onClick={() => window.location.href = '/signup'}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Reload page
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            Back to home
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-waitly-neutral-200">
          <p className="text-sm text-waitly-neutral-500">
            Error persists?{' '}
            <a 
              href="/help" 
              className="text-waitly-primary hover:text-waitly-primary-hover underline"
            >
              Contact support
            </a>
          </p>
          {error.digest && (
            <p className="text-xs text-waitly-neutral-400 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}