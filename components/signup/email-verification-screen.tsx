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
              {t('verification.title')}
            </h1>
            <p className="text-waitly-neutral-500 mb-4">
              {t('verification.message', { email })}
            </p>
            <p className="text-sm text-waitly-neutral-400 mb-6">
              For testing: Check the browser console for the verification link, then copy and paste the token below.
            </p>
          </div>

          <form onSubmit={handleCodeSubmit} className="space-y-4 mb-6">
            <div>
              <label htmlFor="verification-code" className="sr-only">
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
                aria-describedby={errorMessage ? "verification-error" : undefined}
              />
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
            >
              Verify Email
            </Button>
          </form>

          <div className="space-y-4">
            <Button
              onClick={handleResendVerification}
              variant="secondary"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                  : t('actions.resendEmail')
              }
            </Button>
            
            <Button
              onClick={onBackToSignup}
              variant="ghost"
              className="w-full"
            >
              {t('actions.backToSignup')}
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
              {t('verification.success')}
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
              {errorMessage || t('verification.error')}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                setStatus('pending');
                setErrorMessage('');
                setVerificationCode('');
              }}
              variant="primary"
              className="w-full"
            >
              Try again
            </Button>
            
            <Button
              onClick={handleResendVerification}
              variant="secondary"
              className="w-full"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                  : 'Send new verification email'
              }
            </Button>
            
            <Button
              onClick={onBackToSignup}
              variant="ghost"
              className="w-full"
            >
              {t('actions.backToSignup')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}