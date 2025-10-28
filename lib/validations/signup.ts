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

export type SignupFormData = z.infer<typeof signupFormSchema>;