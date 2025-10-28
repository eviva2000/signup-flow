"use client";

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export type SignupStep = 'signup' | 'verify' | 'ready';

export interface SignupNavigationOptions {
  email?: string | undefined;
  token?: string | undefined;
  replace?: boolean;
}

export function useSignupNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToStep = (step: SignupStep, options: SignupNavigationOptions = {}) => {
    const { email, token, replace = false } = options;
    
    let url = `/signup`;
    
    switch (step) {
      case 'signup':
        url = '/signup';
        break;
      case 'verify':
        url = '/signup/verify';
        if (email) {
          url += `?email=${encodeURIComponent(email)}`;
        }
        if (token) {
          url += `${email ? '&' : '?'}token=${encodeURIComponent(token)}`;
        }
        break;
      case 'ready':
        url = '/signup/ready';
        break;
    }

    startTransition(() => {
      if (replace) {
        router.replace(url as any);
      } else {
        router.push(url as any);
      }
    });
  };

  const goToSignup = (options?: SignupNavigationOptions) => {
    navigateToStep('signup', options);
  };

  const goToVerify = (email?: string, options?: Omit<SignupNavigationOptions, 'email'>) => {
    navigateToStep('verify', { ...options, email });
  };

  const goToReady = (options?: SignupNavigationOptions) => {
    navigateToStep('ready', options);
  };

  const goBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  const goHome = () => {
    startTransition(() => {
      router.push('/' as any);
    });
  };

  return {
    isPending,
    navigateToStep,
    goToSignup,
    goToVerify,
    goToReady,
    goBack,
    goHome,
  };
}