"use client";

import { useState } from 'react';
import { SignupForm, ExistingUserPrompt } from '@/components/signup';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';
import { useAuth } from '@/lib/auth';
import { LanguageSelector } from '@/components/ui/language-selector';
import { registerUserFromSignup, checkEmailExists } from '@/lib/auth/signup-integration';
import type { SignupFormData } from '@/lib/validations/signup';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showExistingUser, setShowExistingUser] = useState(false);
  const [existingUserEmail, setExistingUserEmail] = useState('');
  const { isPending, goToVerify } = useSignupNavigation();
  const { sendMagicLink } = useAuth();

  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      console.log('Signup data:', data);
      
      // Check if user already exists
      if (checkEmailExists(data.email)) {
        throw new Error('User with this email already exists');
      }
      
      // Register user using the authentication system
      const result = await registerUserFromSignup(data, 'en-GB');
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      console.log('User registered successfully:', result.user);
      console.log('Verification token:', result.token);
      
      // Navigate to verification page
      goToVerify(data.email);
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUser = (email: string) => {
    console.log('Existing user detected:', email);
    setExistingUserEmail(email);
    setShowExistingUser(true);
  };

  const handleSendMagicLink = async () => {
    const result = await sendMagicLink(existingUserEmail);
    if (!result.success) {
      throw new Error(result.error || 'Failed to send magic link');
    }
  };

  const handleBackToSignup = () => {
    setShowExistingUser(false);
    setExistingUserEmail('');
  };

  const isFormLoading = isLoading || isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay for page transitions */}
      {isPending && (
        <div 
          className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Loading"
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></div>
            <span className="text-gray-600" aria-live="polite">
              Loading...
            </span>
          </div>
        </div>
      )}
      
      {/* Main card container */}
      <div className="w-full max-w-[600px]">
        {/* Logo and Language selector above the card */}
        <div className="flex justify-between items-center mb-6">
          <img 
            src="/logo-dark.png" 
            alt="Waitly Logo" 
            className="h-8 w-auto"
          />
          <LanguageSelector />
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10">
          {showExistingUser ? (
            <ExistingUserPrompt
              email={existingUserEmail}
              onSendMagicLink={handleSendMagicLink}
              onBackToSignup={handleBackToSignup}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignupSubmit}
              isLoading={isFormLoading}
              onExistingUser={handleExistingUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}