"use client";

import { useSearchParams } from 'next/navigation';
import { EmailVerificationScreen } from '@/components/signup';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';

export default function VerifyPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { isPending, goToReady, goToSignup } = useSignupNavigation();

  const handleVerificationSuccess = (userData?: { name?: string; email?: string }) => {
    goToReady(userData?.name);
  };

  const handleBackToSignup = () => {
    goToSignup();
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

      <EmailVerificationScreen
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToSignup={handleBackToSignup}
      />
    </div>
  );
}