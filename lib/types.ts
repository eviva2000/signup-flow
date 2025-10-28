// Core data types for Waitly signup flow

export interface UserRegistration {
  id: string;
  email: string;
  firstName: string;
  country: string;
  locale: 'da-DK' | 'en-GB';
  consents: ConsentRecord[];
  emailVerified: boolean;
  createdAt: Date;
  verifiedAt?: Date;
}

export interface ConsentRecord {
  type: 'terms' | 'privacy' | 'marketing';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  version: string; // Version of terms/privacy policy
}

export interface VerificationToken {
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
}

export interface SignupFormData {
  email: string;
  firstName: string;
  country: string;
  consents: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}

export type Locale = 'da-DK' | 'en-GB';

export interface ApiError {
  type: 'validation' | 'network' | 'server' | 'rate_limit';
  message: string;
  details?: ValidationError[];
  retryable: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}