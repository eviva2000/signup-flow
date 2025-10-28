import type { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyPageContent from './verify-content';

export const metadata: Metadata = {
  title: 'Verify Email - Waitly',
  description: 'Verify your email address to complete your Waitly account setup.',
  robots: {
    index: false,
    follow: false,
  },
};

// Loading component for the verification page
function VerifyPageLoading() {
  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-waitly-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
            Loading verification...
          </h1>
          <p className="text-waitly-neutral-500">
            Please wait while we prepare your verification page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyPageLoading />}>
      <VerifyPageContent />
    </Suspense>
  );
}