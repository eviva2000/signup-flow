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
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
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
          <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
            {t("existingUser.title")}
          </h1>
          <p className="text-waitly-neutral-500">
            {t("existingUser.emailSent")}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-waitly-md p-4 mb-6">
          <p className="text-sm text-blue-800">
            We've sent a magic link to <strong>{email}</strong>. 
            Check your email and click the link to sign in.
          </p>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onBackToSignup}
          className="w-full"
        >
          {t("actions.backToSignup")}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
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
        <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
          {t("existingUser.title")}
        </h1>
        <p className="text-waitly-neutral-500 mb-4">
          {t("existingUser.message")}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-waitly-md p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Email:</strong> {email}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 bg-red-50 border border-red-200 rounded-waitly-md mb-6"
        >
          <p className="text-sm text-waitly-error">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSendMagicLink}
          loading={isLoading}
          loadingText="Sending magic link..."
          disabled={isLoading}
          className="w-full"
        >
          {t("actions.sendMagicLink")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onBackToSignup}
          disabled={isLoading}
          className="w-full"
        >
          {t("actions.backToSignup")}
        </Button>
      </div>
    </div>
  );
}