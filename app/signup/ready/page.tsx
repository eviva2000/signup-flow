import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReadyPageContent from './ready-content';

export const metadata: Metadata = {
  title: 'Welcome to Waitly!',
  description: 'Your Waitly account is ready. Start exploring apartment waiting lists and find your next home.',
  robots: {
    index: false,
    follow: false,
  },
};

// Loading component for the ready page
function ReadyPageLoading() {
  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-waitly-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
            Preparing your account...
          </h1>
          <p className="text-waitly-neutral-500">
            Almost ready!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReadyPage() {
  return (
    <Suspense fallback={<ReadyPageLoading />}>
      <ReadyPageContent />
    </Suspense>
  );
}