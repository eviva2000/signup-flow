"use client";

import { Button } from '@/components/ui';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';

export default function ReadyPageContent() {
  const { isPending, goHome } = useSignupNavigation();

  const handleExploreListings = () => {
    // TODO: This will navigate to the main app when implemented
    goHome();
  };

  const handleCompleteProfile = () => {
    // TODO: This will navigate to profile completion when implemented
    // For now, go to home page
    goHome();
  };

  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Loading overlay for page transitions */}
        {isPending && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-waitly-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-waitly-neutral-600">Loading...</span>
            </div>
          </div>
        )}

        <div className="w-full max-w-md mx-auto text-center">
          <div className="mb-8">
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-waitly-neutral-900 mb-4">
              Welcome to Waitly!
            </h1>
            
            <p className="text-waitly-neutral-600 mb-8 leading-relaxed">
              Your account is ready! You can now join apartment waiting lists and get notified when new homes become available.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleExploreListings}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              Explore apartment listings
            </Button>
            
            <Button
              onClick={handleCompleteProfile}
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              Complete your profile
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-waitly-neutral-200">
            <p className="text-sm text-waitly-neutral-500">
              Need help getting started?{' '}
              <a 
                href="/help" 
                className="text-waitly-primary hover:text-waitly-primary-hover underline"
              >
                Visit our help center
              </a>
            </p>
          </div>
        </div>
    </div>
  );
}