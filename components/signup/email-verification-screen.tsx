"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useTranslations } from '@/lib/i18n/use-translations';
import { validateVerificationCode, resendVerificationEmail, type VerificationResult, type ResendResult } from '@/lib/utils/verification';

export type VerificationStatus = 'pending' | 'verifying' | 'success' | 'error' | 'expired';

export interface EmailVerificationScreenProps {
  email: string;
  onVerificationSuccess: (userData?: { name?: string; email?: string }) => void;
  onBackToSignup: () => void;
  initialStatus?: VerificationStatus;
}

export default function EmailVerificationScreen({
  email,
  onVerificationSuccess,
  onBackToSignup,
  initialStatus = 'pending'
}: EmailVerificationScreenProps) {
  const { t } = useTranslations('signup');
  const [status, setStatus] = useState<VerificationStatus>(initialStatus);
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleVerification = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    setStatus('verifying');
    setErrorMessage('');
    
    try {
      const result: VerificationResult = await validateVerificationCode(code);
      
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          // Pass user data if available from verification result
          onVerificationSuccess(result.userData);
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(result.message || t('verification.error'));
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setErrorMessage(t('verification.error'));
    }
  }, [onVerificationSuccess, t]);

  const handleResendVerification = useCallback(async () => {
    if (isResending || resendCooldown > 0) return;
    
    setIsResending(true);
    setErrorMessage('');
    
    try {
      const result: ResendResult = await resendVerificationEmail(email);
      
      if (result.success) {
        // Show success message briefly
        setStatus('pending');
        setVerificationCode('');
        
        // Start cooldown
        if (result.cooldownMs) {
          setResendCooldown(Math.ceil(result.cooldownMs / 1000));
        } else {
          setResendCooldown(60); // Default 60 seconds
        }
      } else {
        setErrorMessage(result.message || 'Failed to resend verification email');
        
        if (result.error === 'rate_limit' && result.cooldownMs) {
          setResendCooldown(Math.ceil(result.cooldownMs / 1000));
        }
      }
    } catch (error) {
      console.error('Resend error:', error);
      setErrorMessage('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendCooldown]);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
    return undefined;
  }, [resendCooldown]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(verificationCode);
  };

  return (
    <div className="w-full text-center">
      {status === 'pending' && (
        <>
          <header className="mb-8">
            <div 
              className="w-16 h-16 bg-waitly-primary-light rounded-full flex items-center justify-center mx-auto mb-4"
              role="img"
              aria-label="Email verification"
            >
              <svg 
                className="w-8 h-8 text-waitly-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 
              className="text-2xl font-bold text-waitly-neutral-900 mb-2"
              id="verification-title"
            >
              Check Your Email
            </h1>
            <p 
              className="text-waitly-neutral-500 mb-4"
              id="verification-description"
            >
              We&apos;ve sent a verification code to <span className="font-mono font-medium">{email}</span>
            </p>
            <p className="text-sm text-waitly-neutral-400 mb-6">
              For testing: Check the browser console for the verification link, then copy and paste the token below.
            </p>
          </header>

          <form 
            onSubmit={handleCodeSubmit} 
            className="space-y-4 mb-6"
            aria-labelledby="verification-title"
            aria-describedby="verification-description"
          >
            <div>
              <label 
                htmlFor="verification-code" 
                className="block text-sm font-medium text-waitly-neutral-900 mb-2 text-left"
              >
                Verification Token
              </label>
              <input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Paste verification token here"
                className="w-full px-4 py-3 border border-waitly-neutral-300 rounded-waitly-radius-md focus:ring-2 focus:ring-waitly-primary focus:border-transparent text-sm font-mono"
                autoComplete="one-time-code"
                aria-describedby={errorMessage ? "verification-error verification-help" : "verification-help"}
                aria-invalid={errorMessage ? "true" : "false"}
              />
              <div id="verification-help" className="sr-only">
                Enter the verification token from your email to confirm your account.
              </div>
              {errorMessage && (
                <p id="verification-error" className="mt-2 text-sm text-red-600" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!verificationCode.trim()}
              aria-describedby="verify-help"
            >
              Verify Email
            </Button>
            <div id="verify-help" className="sr-only">
              Submit the verification token to confirm your email address and activate your account.
            </div>
          </form>

          <div 
            className="space-y-4"
            role="group"
            aria-label="Additional verification options"
          >
            <Button
              onClick={handleResendVerification}
              variant="secondary"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
              aria-describedby="resend-help"
              aria-live="polite"
            >
              {isResending 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Verification Email'
              }
            </Button>
            <div id="resend-help" className="sr-only">
              {resendCooldown > 0 
                ? `Resend is available in ${resendCooldown} seconds.`
                : 'Send a new verification email if you haven\'t received one.'
              }
            </div>
            
            <Button
              onClick={onBackToSignup}
              variant="ghost"
              className="w-full touch-target"
              aria-describedby="back-help"
            >
              Back to Signup
            </Button>
            <div id="back-help" className="sr-only">
              Return to the signup form to create an account with a different email address.
            </div>
          </div>
        </>
      )}

      {status === 'verifying' && (
        <>
          <div 
            className="mb-8"
            role="status"
            aria-live="polite"
          >
            <div 
              className="w-16 h-16 border-4 border-waitly-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"
              aria-hidden="true"
            ></div>
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
          <div 
            className="mb-8"
            role="status"
            aria-live="polite"
          >
            <div 
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              role="img"
              aria-label="Success"
            >
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
              Email Verified Successfully!
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
            <div 
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              role="img"
              aria-label="Error"
            >
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
              Verification Failed
            </h1>
            <div
              role="alert"
              aria-live="assertive"
              className="text-waitly-neutral-500 mb-6"
            >
              {errorMessage || 'The verification token is invalid or has expired.'}
            </div>
          </div>

          <div 
            className="space-y-4"
            role="group"
            aria-label="Error recovery options"
          >
            <Button
              onClick={() => {
                setStatus('pending');
                setErrorMessage('');
                setVerificationCode('');
              }}
              variant="primary"
              className="w-full"
            >
              Try Again
            </Button>
            
            <Button
              onClick={handleResendVerification}
              variant="secondary"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
              aria-live="polite"
            >
              {isResending 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                : 'Send New Verification Email'
              }
            </Button>
            
            <Button
              onClick={onBackToSignup}
              variant="ghost"
              className="w-full"
            >
              Back to Signup
            </Button>
          </div>
        </>
      )}
    </div>
  );
}