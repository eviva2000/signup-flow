// Data helper utilities for Waitly signup flow
import { ConsentRecord, UserRegistration, VerificationToken, SignupFormData } from '../validations/signup';

// Generate a UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate a secure verification token
export function generateVerificationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a consent record
export function createConsentRecord(
  type: 'terms' | 'privacy' | 'marketing',
  granted: boolean,
  ipAddress: string,
  version: string = '1.0'
): ConsentRecord {
  return {
    type,
    granted,
    timestamp: new Date(),
    ipAddress,
    version,
  };
}

// Create consent records from signup form data
export function createConsentRecords(
  consents: SignupFormData['consents'],
  ipAddress: string,
  version: string = '1.0'
): ConsentRecord[] {
  return [
    createConsentRecord('terms', consents.terms, ipAddress, version),
    createConsentRecord('privacy', consents.privacy, ipAddress, version),
    createConsentRecord('marketing', consents.marketing, ipAddress, version),
  ];
}

// Create a user registration from signup form data
export function createUserRegistration(
  formData: SignupFormData,
  locale: 'da-DK' | 'en-GB',
  ipAddress: string
): UserRegistration {
  return {
    id: generateUUID(),
    email: formData.email.toLowerCase().trim(),
    firstName: formData.firstName.trim(),
    country: formData.country,
    locale,
    consents: createConsentRecords(formData.consents, ipAddress),
    emailVerified: false,
    createdAt: new Date(),
  };
}

// Create a verification token
export function createVerificationToken(email: string, expirationHours: number = 24): VerificationToken {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expirationHours);
  
  return {
    token: generateVerificationToken(),
    email: email.toLowerCase().trim(),
    expiresAt,
    used: false,
  };
}

// Check if a verification token is valid
export function isTokenValid(token: VerificationToken): boolean {
  return !token.used && new Date() < token.expiresAt;
}

// Check if a verification token is expired
export function isTokenExpired(token: VerificationToken): boolean {
  return new Date() >= token.expiresAt;
}

// Get consent by type from user registration
export function getConsentByType(
  user: UserRegistration,
  type: 'terms' | 'privacy' | 'marketing'
): ConsentRecord | undefined {
  return user.consents.find(consent => consent.type === type);
}

// Check if user has granted specific consent
export function hasGrantedConsent(
  user: UserRegistration,
  type: 'terms' | 'privacy' | 'marketing'
): boolean {
  const consent = getConsentByType(user, type);
  return consent?.granted ?? false;
}

// Update user verification status
export function markUserAsVerified(user: UserRegistration): UserRegistration {
  return {
    ...user,
    emailVerified: true,
    verifiedAt: new Date(),
  };
}