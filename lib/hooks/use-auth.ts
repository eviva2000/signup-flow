'use client';

import { useAuth, useIsAuthenticated, useCurrentUser, useAuthActions } from '../auth';
import type { UserRegistration } from '../types';

// Re-export the main auth hooks for convenience
export { useAuth, useIsAuthenticated, useCurrentUser, useAuthActions };

// Additional convenience hooks

// Hook to check if user has verified email
export function useIsEmailVerified(): boolean {
  const user = useCurrentUser();
  return user?.emailVerified ?? false;
}

// Hook to get user's full name
export function useUserDisplayName(): string {
  const user = useCurrentUser();
  return user?.firstName ?? 'User';
}

// Hook to check if user has specific consent
export function useHasConsent(consentType: 'terms' | 'privacy' | 'marketing'): boolean {
  const user = useCurrentUser();
  
  if (!user) return false;
  
  const consent = user.consents.find(c => c.type === consentType);
  return consent?.granted ?? false;
}

// Hook to get user's locale
export function useUserLocale(): 'da-DK' | 'en-GB' | null {
  const user = useCurrentUser();
  return user?.locale ?? null;
}

// Hook for login with loading state
export function useLogin() {
  const { login } = useAuthActions();
  
  return {
    login,
    // You can add loading state here if needed
  };
}

// Hook for logout with loading state
export function useLogout() {
  const { logout } = useAuthActions();
  
  return {
    logout,
    // You can add loading state here if needed
  };
}

// Hook for registration with loading state
export function useRegister() {
  const { register } = useAuthActions();
  
  return {
    register,
    // You can add loading state here if needed
  };
}

// Hook for email verification
export function useEmailVerification() {
  const { verifyEmail } = useAuthActions();
  
  return {
    verifyEmail,
    // You can add loading state here if needed
  };
}

// Hook for magic link functionality
export function useMagicLink() {
  const { sendMagicLink } = useAuthActions();
  
  return {
    sendMagicLink,
    // You can add loading state here if needed
  };
}

// Hook to check authentication status with loading
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading, // Convenience flag
  };
}