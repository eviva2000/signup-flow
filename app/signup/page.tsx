"use client";

import { useState } from 'react';
import { SignupForm } from '@/components/signup';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';
import type { SignupFormData } from '@/lib/validations/signup';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isPending, goToVerify } = useSignupNavigation();

  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // TODO: This will be implemented in later tasks
      // For now, just simulate API call
      console.log('Signup data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Handle actual signup logic
      // - Check if user exists
      // - Create user registration
      // - Send verification email
      
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
    // TODO: This will be implemented in task 6
    console.log('Existing user detected:', email);
    // For now, stay on signup page with existing user indicator
    // This will be enhanced in task 6 with proper existing user flow
  };

  const isFormLoading = isLoading || isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay for page transitions */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      )}
      
      <SignupForm
        onSubmit={handleSignupSubmit}
        isLoading={isFormLoading}
        onExistingUser={handleExistingUser}
      />
    </div>
  );
}