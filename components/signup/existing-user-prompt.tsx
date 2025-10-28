"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useTranslations } from "@/lib/i18n";

export interface ExistingUserPromptProps {
  email: string;
  onSendMagicLink: () => Promise<void>;
  onBackToSignup: () => void;
}

export function ExistingUserPrompt({
  email,
  onSendMagicLink,
  onBackToSignup,
}: ExistingUserPromptProps) {
  const { t } = useTranslations("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMagicLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onSendMagicLink();
      setMagicLinkSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send magic link";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    onBackToSignup();
  };

  if (magicLinkSent) {
    return (
      <div className="w-full">
        <header className="text-center mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 
            className="text-2xl font-bold text-waitly-neutral-900 mb-2"
            id="existing-user-title"
          >
            Magic Link Sent
          </h1>
          <p 
            className="text-waitly-neutral-500"
            id="existing-user-description"
          >
            Check your email for the login link
          </p>
        </header>

        <div 
          className="bg-blue-50 border border-blue-200 rounded-waitly-md p-4 mb-6"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm text-blue-800">
            We&apos;ve sent a magic link to{' '}
            <strong className="font-semibold">{email}</strong>. 
            Check your email and click the link to sign in.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={handleBackToSignup}
          className="w-full touch-target"
          aria-describedby="back-to-signup-help"
        >
          {t("actions.backToSignup")}
        </Button>
        
        <div id="back-to-signup-help" className="sr-only">
          Return to the signup form to create a new account with a different email address.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="text-center mb-8">
        <div 
          className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center"
          role="img"
          aria-label="Warning"
        >
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 
          className="text-2xl font-bold text-waitly-neutral-900 mb-2"
          id="existing-user-title"
        >
          Account Already Exists
        </h1>
        <p 
          className="text-waitly-neutral-500 mb-4"
          id="existing-user-description"
        >
          This email address is already registered. Choose an option below to continue.
        </p>
      </header>

      <div 
        className="bg-gray-50 border border-gray-200 rounded-waitly-md p-4 mb-6"
        role="region"
        aria-label="Account information"
      >
        <p className="text-sm text-gray-700">
          <span className="font-medium">Email:</span>{' '}
          <span className="font-mono">{email}</span>
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-50 border border-red-200 rounded-waitly-md mb-6"
        >
          <h3 className="text-sm font-medium text-waitly-error mb-1">
            Error
          </h3>
          <p className="text-sm text-waitly-error">{error}</p>
        </div>
      )}

      <div 
        className="space-y-4"
        role="group"
        aria-labelledby="existing-user-title"
        aria-describedby="existing-user-description"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleSendMagicLink}
          loading={isLoading}
          loadingText="Sending magic link..."
          disabled={isLoading}
          className="w-full touch-target"
          aria-describedby="magic-link-help"
        >
          Send Magic Link
        </Button>
        
        <div id="magic-link-help" className="sr-only">
          Send a secure login link to your email address. No password required.
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={handleBackToSignup}
          disabled={isLoading}
          className="w-full touch-target"
          aria-describedby="back-to-signup-help"
        >
          {t("actions.backToSignup")}
        </Button>
        
        <div id="back-to-signup-help" className="sr-only">
          Return to the signup form to create a new account with a different email address.
        </div>
      </div>
    </div>
  );
}
