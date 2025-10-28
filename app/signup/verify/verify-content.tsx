"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';

type VerificationStatus = 'pending' | 'verifying' | 'success' | 'error' | 'expired';

export default function VerifyPageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const email = searchParams.get('email') || '';
  const { isPending, goToReady, goToSignup } = useSignupNavigation();

  const handleVerification = useCallback(async (token: string) => {
    setStatus('verifying');
    
    try {
      // TODO: This will be implemented in task 7
      // For now, simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success and redirect to ready page
      setStatus('success');
      
      setTimeout(() => {
        goToReady();
      }, 1500);
      
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  }, [goToReady]);

  const handleResendVerification = async () => {
    try {
      // TODO: This will be implemented in task 7
      console.log('Resending verification to:', email);
      
      // Simulate resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Verification email sent! Please check your inbox.');
      
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to resend verification email. Please try again.');
    }
  };

  const handleBackToSignup = () => {
    goToSignup();
  };

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => handleVerification(token), 0);
    }
  }, [searchParams, handleVerification]);

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
          {status === 'pending' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 bg-waitly-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-waitly-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
                  Check your email
                </h1>
                <p className="text-waitly-neutral-500 mb-4">
                  We&apos;ve sent a verification link to:
                </p>
                <p className="text-waitly-neutral-900 font-medium">
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  variant="secondary"
                  className="w-full"
                >
                  Resend verification email
                </Button>
                
                <Button
                  onClick={handleBackToSignup}
                  variant="ghost"
                  className="w-full"
                >
                  Back to signup
                </Button>
              </div>
            </>
          )}

          {status === 'verifying' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 border-4 border-waitly-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
                  Verifying your email...
                </h1>
                <p className="text-waitly-neutral-500">
                  Please wait while we confirm your email address.
                </p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
                  Email verified!
                </h1>
                <p className="text-waitly-neutral-500">
                  Redirecting you to complete your setup...
                </p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
                  Verification failed
                </h1>
                <p className="text-waitly-neutral-500 mb-6">
                  The verification link is invalid or has expired.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleResendVerification}
                  variant="primary"
                  className="w-full"
                >
                  Send new verification email
                </Button>
                
                <Button
                  onClick={handleBackToSignup}
                  variant="ghost"
                  className="w-full"
                >
                  Back to signup
                </Button>
              </div>
            </>
          )}
        </div>
    </div>
  );
}