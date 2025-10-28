import { SignupFormData, UserRegistration } from '../types';
import { UserStorage, VerificationTokenStorage } from './storage';
import { ConsentStorage } from '../utils/consent';

// Convert signup form data to user registration data
export function createUserFromSignupData(
  formData: SignupFormData,
  locale: 'da-DK' | 'en-GB' = 'en-GB'
): Omit<UserRegistration, 'id' | 'createdAt'> {
  // Create consent records using the new consent storage utilities
  const consents = ConsentStorage.createConsentRecords(
    formData.email,
    formData.consents
  );

  return {
    email: formData.email.toLowerCase(),
    firstName: formData.firstName,
    country: formData.country,
    locale,
    consents,
    emailVerified: false,
  };
}

// Check if email already exists
export function checkEmailExists(email: string): boolean {
  const existingUser = UserStorage.findUserByEmail(email);
  return existingUser !== null;
}

// Register user from signup form
export async function registerUserFromSignup(
  formData: SignupFormData,
  locale: 'da-DK' | 'en-GB' = 'en-GB'
): Promise<{ success: boolean; user?: UserRegistration; error?: string; token?: string }> {
  try {
    // Check if user already exists
    if (checkEmailExists(formData.email)) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Create user data
    const userData = createUserFromSignupData(formData, locale);
    
    // Create user
    const user = UserStorage.createUser(userData);
    
    // Create verification token
    const verificationToken = VerificationTokenStorage.createToken(user.email);
    
    // Simulating email delivery for verification token
    console.log(`Verification email for ${user.email}: /signup/verify?token=${verificationToken.token}`);
    
    return {
      success: true,
      user,
      token: verificationToken.token,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed. Please try again.',
    };
  }
}

// Resend verification email
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; error?: string; token?: string }> {
  try {
    const user = UserStorage.findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: 'Email is already verified',
      };
    }

    // Create new verification token
    const verificationToken = VerificationTokenStorage.createToken(email);
    
    // In a real app, you would send the verification email here
    console.log(`Verification email resent for ${email}: /signup/verify?token=${verificationToken.token}`);
    
    return {
      success: true,
      token: verificationToken.token,
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Failed to resend verification email. Please try again.',
    };
  }
}

// Handle magic link for existing users
export async function sendMagicLinkForExistingUser(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = UserStorage.findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        error: 'Please verify your email first',
      };
    }

    // Create magic link token (shorter expiration for security)
    const magicToken = VerificationTokenStorage.createToken(email, 1); // 1 hour
    
    // In a real app, you would send the magic link email here
    console.log(`Magic link for ${email}: /signup/verify?token=${magicToken.token}&type=magic`);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Magic link error:', error);
    return {
      success: false,
      error: 'Failed to send magic link. Please try again.',
    };
  }
}

// Verify token and determine type (verification or magic link)
export async function handleTokenVerification(
  token: string,
  type: 'verification' | 'magic' = 'verification'
): Promise<{ success: boolean; user?: UserRegistration; error?: string }> {
  try {
    const verificationToken = VerificationTokenStorage.consumeToken(token);
    
    if (!verificationToken) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    const user = UserStorage.findUserByEmail(verificationToken.email);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    if (type === 'verification') {
      // Email verification - update user to verified
      const updatedUser = UserStorage.updateUser(user.id, {
        emailVerified: true,
        verifiedAt: new Date(),
      });

      return {
        success: true,
        user: updatedUser || user,
      };
    } else {
      // Magic link - user should already be verified
      if (!user.emailVerified) {
        return {
          success: false,
          error: 'Email not verified',
        };
      }

      return {
        success: true,
        user,
      };
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      error: 'Token verification failed. Please try again.',
    };
  }
}

// Clean up expired tokens (utility function)
export function cleanupExpiredTokens(): void {
  VerificationTokenStorage.cleanupExpiredTokens();
}