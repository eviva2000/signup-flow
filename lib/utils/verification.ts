import { handleTokenVerification, resendVerificationEmail as resendVerificationEmailAuth } from '@/lib/auth/signup-integration';

// Rate limiting for resend functionality
const RESEND_COOLDOWN_MS = 60000; // 1 minute
const resendAttempts = new Map<string, number>();

export interface VerificationResult {
  success: boolean;
  error?: 'invalid' | 'expired' | 'used' | 'network';
  message?: string;
  userData?: {
    name?: string;
    email?: string;
  };
}

export interface ResendResult {
  success: boolean;
  error?: 'rate_limit' | 'network' | 'invalid_email';
  message?: string;
  cooldownMs?: number;
}

/**
 * Validate a verification token using the authentication system
 */
export async function validateVerificationCode(token: string): Promise<VerificationResult> {
  try {
    // Use the authentication system to verify the token
    const result = await handleTokenVerification(token, 'verification');
    
    if (result.success && result.user) {
      return {
        success: true,
        message: 'Email verified successfully',
        userData: {
          name: result.user.firstName,
          email: result.user.email,
        },
      };
    } else {
      return {
        success: false,
        error: 'invalid',
        message: result.error || 'Invalid verification token',
      };
    }
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: 'network',
      message: 'Verification failed. Please try again.',
    };
  }
}

/**
 * Resend verification email with rate limiting
 */
export async function resendVerificationEmail(email: string): Promise<ResendResult> {
  // Check rate limiting
  const lastAttempt = resendAttempts.get(email);
  const now = Date.now();
  
  if (lastAttempt && (now - lastAttempt) < RESEND_COOLDOWN_MS) {
    const remainingMs = RESEND_COOLDOWN_MS - (now - lastAttempt);
    return {
      success: false,
      error: 'rate_limit',
      message: `Please wait ${Math.ceil(remainingMs / 1000)} seconds before requesting another email`,
      cooldownMs: remainingMs,
    };
  }
  
  try {
    // Use the authentication system to resend verification email
    const result = await resendVerificationEmailAuth(email);
    
    if (result.success) {
      // Update rate limiting
      resendAttempts.set(email, now);
      
      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } else {
      return {
        success: false,
        error: 'network',
        message: result.error || 'Failed to send verification email',
      };
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'network',
      message: 'Failed to send verification email. Please try again.',
    };
  }
}