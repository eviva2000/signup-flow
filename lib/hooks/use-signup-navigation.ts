"use client";

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export type SignupStep = 'signup' | 'verify' | 'ready';

export interface SignupNavigationOptions {
  email?: string | undefined;
  token?: string | undefined;
  name?: string | undefined;
  replace?: boolean;
}

export function useSignupNavigation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigateToStep = (step: SignupStep, options: SignupNavigationOptions = {}) => {
    const { email, token, name, replace = false } = options;
    
    let url = `/signup`;
    const params = new URLSearchParams();
    
    switch (step) {
      case 'signup':
        url = '/signup';
        break;
      case 'verify':
        url = '/signup/verify';
        if (email) {
          params.set('email', email);
        }
        if (token) {
          params.set('token', token);
        }
        break;
      case 'ready':
        url = '/signup/ready';
        if (name) {
          params.set('name', name);
        }
        break;
    }

    // Add query parameters if any exist
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    startTransition(() => {
      if (replace) {
        router.replace(url as never);
      } else {
        router.push(url as never);
      }
    });
  };

  const goToSignup = (options?: SignupNavigationOptions) => {
    navigateToStep('signup', options);
  };

  const goToVerify = (email?: string, options?: Omit<SignupNavigationOptions, 'email'>) => {
    navigateToStep('verify', { ...options, email });
  };

  const goToReady = (name?: string, options?: Omit<SignupNavigationOptions, 'name'>) => {
    navigateToStep('ready', { ...options, name });
  };

  const goBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  const goHome = () => {
    startTransition(() => {
      router.push('/' as never);
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