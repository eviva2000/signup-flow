"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { EmailVerificationScreen } from "@/components/signup";
import { useSignupNavigation } from "@/lib/hooks/use-signup-navigation";
import { LanguageSelector } from "@/components/ui/language-selector";
import { validateVerificationCode } from "@/lib/utils/verification";

export default function VerifyPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token");
  const { isPending, goToReady, goToSignup } = useSignupNavigation();
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);

  const handleAutoVerification = useCallback(
    async (verificationToken: string) => {
      try {
        const result = await validateVerificationCode(verificationToken);

        if (result.success) {
          // Verification successful, redirect to ready page
          goToReady(result.userData?.name);
        } else {
          // Verification failed, show error in the verification screen
          console.error("Auto-verification failed:", result.message);
          setIsAutoVerifying(false);
        }
      } catch (error) {
        console.error("Auto-verification error:", error);
        setIsAutoVerifying(false);
      }
    },
    [goToReady]
  );

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token && !isAutoVerifying) {
      // Use a timeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setIsAutoVerifying(true);
        handleAutoVerification(token);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [token, isAutoVerifying, handleAutoVerification]);

  const handleVerificationSuccess = (userData?: {
    name?: string;
    email?: string;
  }) => {
    goToReady(userData?.name);
  };

  const handleBackToSignup = () => {
    goToSignup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay for page transitions */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-waitly-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-waitly-neutral-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Main card container */}
      <div className="w-full max-w-md">
        {/* Language selector above the card */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <EmailVerificationScreen
            email={email}
            onVerificationSuccess={handleVerificationSuccess}
            onBackToSignup={handleBackToSignup}
            initialStatus={isAutoVerifying ? "verifying" : "pending"}
          />
        </div>
      </div>
    </div>
  );
}
