'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRegistration } from '../types';
import { UserStorage, SessionStorage, SessionData, VerificationTokenStorage } from './storage';

// Authentication state interface
export interface AuthState {
  user: UserRegistration | null;
  session: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Authentication actions interface
export interface AuthActions {
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: Omit<UserRegistration, 'id' | 'createdAt'>) => Promise<{ success: boolean; user?: UserRegistration; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; user?: UserRegistration; error?: string }>;
  getCurrentUser: () => UserRegistration | null;
  refreshSession: () => void;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
}

// Combined context interface
export interface AuthContextType extends AuthState, AuthActions {}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const session = SessionStorage.getSession();
        
        if (session) {
          const user = UserStorage.findUserById(session.userId);
          
          if (user) {
            setState({
              user,
              session,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          } else {
            // User not found, clear invalid session
            SessionStorage.clearSession();
          }
        }
        
        // No valid session found
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function (mock implementation)
  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = UserStorage.findUserByEmail(email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (!user.emailVerified) {
        return { success: false, error: 'Email not verified. Please check your email for verification link.' };
      }

      // Create session
      const session = SessionStorage.createSession(user.id, user.email);
      
      setState({
        user,
        session,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    SessionStorage.clearSession();
    setState({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  // Register function
  const register = async (userData: Omit<UserRegistration, 'id' | 'createdAt'>): Promise<{ success: boolean; user?: UserRegistration; error?: string }> => {
    try {
      // Check if user already exists
      const existingUser = UserStorage.findUserByEmail(userData.email);
      
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser = UserStorage.createUser(userData);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Verify email function
  const verifyEmail = async (token: string): Promise<{ success: boolean; user?: UserRegistration; error?: string }> => {
    try {
      const verificationToken = VerificationTokenStorage.consumeToken(token);
      
      if (!verificationToken) {
        return { success: false, error: 'Invalid or expired verification token' };
      }

      // Find and update user
      const user = UserStorage.findUserByEmail(verificationToken.email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = UserStorage.updateUser(user.id, {
        emailVerified: true,
        verifiedAt: new Date(),
      });

      if (!updatedUser) {
        return { success: false, error: 'Failed to verify email' };
      }

      // Create session for verified user
      const session = SessionStorage.createSession(updatedUser.id, updatedUser.email);
      
      setState({
        user: updatedUser,
        session,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Email verification failed. Please try again.' };
    }
  };

  // Get current user
  const getCurrentUser = (): UserRegistration | null => {
    return state.user;
  };

  // Refresh session
  const refreshSession = () => {
    if (state.session) {
      const extendedSession = SessionStorage.extendSession();
      if (extendedSession) {
        setState(prev => ({
          ...prev,
          session: extendedSession,
        }));
      }
    }
  };

  // Send magic link (mock implementation)
  const sendMagicLink = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = UserStorage.findUserByEmail(email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // In a real implementation, this would send an email
      // For now, we'll just create a verification token that can be used for login
      const token = VerificationTokenStorage.createToken(email, 1); // 1 hour expiration
      
      // In development, log the magic link
      console.log(`Magic link for ${email}: /signup/verify?token=${token.token}&type=magic`);
      
      return { success: true };
    } catch (error) {
      console.error('Send magic link error:', error);
      return { success: false, error: 'Failed to send magic link. Please try again.' };
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    register,
    verifyEmail,
    getCurrentUser,
    refreshSession,
    sendMagicLink,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

// Hook to get current user
export function useCurrentUser(): UserRegistration | null {
  const { user } = useAuth();
  return user;
}

// Hook for authentication actions only
export function useAuthActions(): AuthActions {
  const context = useAuth();
  
  return {
    login: context.login,
    logout: context.logout,
    register: context.register,
    verifyEmail: context.verifyEmail,
    getCurrentUser: context.getCurrentUser,
    refreshSession: context.refreshSession,
    sendMagicLink: context.sendMagicLink,
  };
}