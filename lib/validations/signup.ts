import { z } from 'zod';
import { COUNTRIES } from '../utils';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// First name validation schema
export const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .min(2, 'First name must be at least 2 characters')
  .max(50, 'First name must be less than 50 characters');

// Country validation schema
export const countrySchema = z
  .string()
  .min(1, 'Please select a country')
  .refine(
    (value) => COUNTRIES.some(country => country.code === value),
    'Please select a valid country'
  );

// Locale validation schema
export const localeSchema = z.enum(['da-DK', 'en-GB']);

// Consent validation schema
export const consentSchema = z.object({
  terms: z.boolean().refine(val => val === true, 'You must accept the Terms & Conditions'),
  privacy: z.boolean().refine(val => val === true, 'You must accept the Privacy Policy'),
  marketing: z.boolean().default(false),
});

// Complete signup form validation schema
export const signupFormSchema = z.object({
  email: emailSchema,
  firstName: firstNameSchema,
  country: countrySchema,
  consents: consentSchema,
});

// ConsentRecord validation schema
export const consentRecordSchema = z.object({
  type: z.enum(['terms', 'privacy', 'marketing']),
  granted: z.boolean(),
  timestamp: z.date(),
  ipAddress: z.string().regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
    'Invalid IP address format'
  ),
  version: z.string().min(1, 'Version is required'),
});

// UserRegistration validation schema
export const userRegistrationSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  firstName: firstNameSchema,
  country: countrySchema,
  locale: localeSchema,
  consents: z.array(consentRecordSchema),
  emailVerified: z.boolean(),
  createdAt: z.date(),
  verifiedAt: z.date().optional(),
});

// VerificationToken validation schema
export const verificationTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: emailSchema,
  expiresAt: z.date(),
  used: z.boolean(),
});

// Validation error schema
export const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

// API error schema
export const apiErrorSchema = z.object({
  type: z.enum(['validation', 'network', 'server', 'rate_limit']),
  message: z.string(),
  details: z.array(validationErrorSchema).optional(),
  retryable: z.boolean(),
});

// Type exports
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type ConsentRecord = z.infer<typeof consentRecordSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type VerificationToken = z.infer<typeof verificationTokenSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type Locale = z.infer<typeof localeSchema>;