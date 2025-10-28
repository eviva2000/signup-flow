// Rate limiting for resend functionality
const RESEND_COOLDOWN_MS = 60000; // 1 minute
const resendAttempts = new Map<string, number>();

// Hardcoded verification code for mocked implementation
const VERIFICATION_CODE = '1234';

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
 * Validate a verification code
 * In a real implementation, this would validate against server-side storage
 */
export async function validateVerificationCode(code: string): Promise<VerificationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simple validation against hardcoded code
  if (code !== VERIFICATION_CODE) {
    return {
      success: false,
      error: 'invalid',
      message: 'Invalid verification code',
    };
  }
  
  return {
    success: true,
    message: 'Email verified successfully',
    userData: {
      name: 'John', // In real implementation, this would come from the verification token
      email: 'user@example.com', // In real implementation, this would come from the verification token
    },
  };
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
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'invalid_email',
      message: 'Invalid email address',
    };
  }
  
  try {
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Update rate limiting
    resendAttempts.set(email, now);
    
    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: 'network',
      message: 'Failed to send verification email. Please try again.',
    };
  }
}