import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Page Not Found - Waitly Signup',
  description: 'The signup page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupNotFound() {
  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          {/* 404 icon */}
          <div className="w-20 h-20 bg-waitly-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-waitly-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.877 2.172M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-waitly-neutral-900 mb-4">
            Page not found
          </h1>
          
          <p className="text-waitly-neutral-600 mb-8 leading-relaxed">
            The signup page you're looking for doesn't exist. Let's get you back on track.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/signup">
            <Button variant="primary" size="lg" className="w-full">
              Go to signup
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="secondary" size="lg" className="w-full">
              Back to home
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-waitly-neutral-200">
          <p className="text-sm text-waitly-neutral-500">
            Need help?{' '}
            <a 
              href="/help" 
              className="text-waitly-primary hover:text-waitly-primary-hover underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}