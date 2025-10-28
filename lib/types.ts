// Core data types for Waitly signup flow
// Re-export types from validation schemas to maintain consistency
export type {
  UserRegistration,
  ConsentRecord,
  VerificationToken,
  SignupFormData,
  ValidationError,
  ApiError,
  Locale,
} from './validations/signup';