# Waitly Signup Flow Design Document

## Overview

The Waitly signup flow is designed as a modern, accessible, and brand-consistent user registration experience. The design emphasizes simplicity, clear communication, and progressive disclosure to minimize friction while ensuring compliance with data protection requirements and accessibility standards.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14+ with TypeScript for type safety and modern React features
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **State Management**: React Context for signup flow state and Zustand for global app state
- **Internationalization**: next-i18next for locale management with fallback support
- **Form Management**: React Hook Form with Zod validation for type-safe form handling
- **Accessibility**: Radix UI primitives for accessible component foundations

### Application Structure
```
app/
├── signup/
│   ├── page.tsx                 # Initial signup form
│   ├── verify/
│   │   └── page.tsx            # Email verification handler
│   └── ready/
│       └── page.tsx            # Post-verification ready screen
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── forms/                  # Form-specific components
│   └── signup/                 # Signup flow components
├── lib/
│   ├── validations/            # Zod schemas
│   ├── i18n/                   # Internationalization setup
│   └── utils/                  # Utility functions
└── styles/
    └── globals.css             # Global styles and design tokens
```

## Components and Interfaces

### Core Components

#### SignupForm Component
```typescript
interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isLoading: boolean;
  locale: 'da-DK' | 'en-GB';
}

interface SignupFormData {
  email: string;
  firstName: string;
  country: string;
  consents: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}
```

#### ExistingUserPrompt Component
```typescript
interface ExistingUserPromptProps {
  email: string;
  onSendMagicLink: () => Promise<void>;
  onBackToSignup: () => void;
}
```

#### EmailVerificationScreen Component
```typescript
interface EmailVerificationProps {
  email: string;
  onResendVerification: () => Promise<void>;
  verificationStatus: 'pending' | 'success' | 'error';
}
```

#### ReadyScreen Component
```typescript
interface ReadyScreenProps {
  userName: string;
  nextActions: Array<{
    title: string;
    description: string;
    href: string;
    primary?: boolean;
  }>;
}
```

### Data Models

#### User Registration Model
```typescript
interface UserRegistration {
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

interface ConsentRecord {
  type: 'terms' | 'privacy' | 'marketing';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  version: string; // Version of terms/privacy policy
}
```

#### Verification Token Model
```typescript
interface VerificationToken {
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
}
```

### Brand Identity Integration

#### Design Tokens (Based on Waitly Brand)
```css
:root {
  /* Primary Colors */
  --waitly-primary: #2563eb;      /* Blue primary */
  --waitly-primary-hover: #1d4ed8;
  --waitly-primary-light: #dbeafe;
  
  /* Neutral Colors */
  --waitly-neutral-50: #f8fafc;
  --waitly-neutral-100: #f1f5f9;
  --waitly-neutral-500: #64748b;
  --waitly-neutral-900: #0f172a;
  
  /* Semantic Colors */
  --waitly-success: #059669;
  --waitly-error: #dc2626;
  --waitly-warning: #d97706;
  
  /* Typography */
  --waitly-font-family: 'Inter', system-ui, sans-serif;
  --waitly-font-size-sm: 0.875rem;
  --waitly-font-size-base: 1rem;
  --waitly-font-size-lg: 1.125rem;
  --waitly-font-size-xl: 1.25rem;
  
  /* Spacing */
  --waitly-spacing-xs: 0.5rem;
  --waitly-spacing-sm: 0.75rem;
  --waitly-spacing-md: 1rem;
  --waitly-spacing-lg: 1.5rem;
  --waitly-spacing-xl: 2rem;
  
  /* Border Radius */
  --waitly-radius-sm: 0.375rem;
  --waitly-radius-md: 0.5rem;
  --waitly-radius-lg: 0.75rem;
}
```

#### Visual Hierarchy
- **Primary Actions**: Waitly blue with sufficient contrast
- **Secondary Actions**: Neutral with clear hover states
- **Form Elements**: Clean borders with focus indicators
- **Typography**: Inter font family for readability
- **Spacing**: Consistent 8px grid system

## User Experience Flow

### Flow States
1. **Initial Signup** → Form with email, name, country, consents
2. **Email Check** → Validate if email exists
3. **Existing User** → Magic link option or back to signup
4. **Email Sent** → Confirmation screen with resend option
5. **Verification** → Token validation and account activation
6. **Ready State** → Welcome screen with next actions

### Progressive Disclosure
- Start with minimal required fields
- Show consent details on demand with clear explanations
- Provide contextual help without overwhelming the interface
- Use micro-interactions to guide user attention

### Accessibility Features
- Semantic HTML structure with proper heading hierarchy
- ARIA labels and descriptions for all interactive elements
- Focus management with visible focus indicators
- Screen reader announcements for dynamic content changes
- Keyboard navigation support with logical tab order
- Color contrast ratios meeting WCAG 2.1 AA standards (4.5:1 minimum)

## Error Handling

### Validation Strategy
- **Client-side**: Immediate feedback using Zod schemas
- **Server-side**: Comprehensive validation with detailed error messages
- **Network**: Retry mechanisms with exponential backoff
- **Graceful Degradation**: Fallback experiences for JavaScript failures

### Error Types and Responses
```typescript
interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ApiError {
  type: 'validation' | 'network' | 'server' | 'rate_limit';
  message: string;
  details?: ValidationError[];
  retryable: boolean;
}
```

### Error Display Patterns
- Inline field errors with clear messaging
- Toast notifications for system-level errors
- Retry buttons for recoverable failures
- Clear instructions for user resolution

## Internationalization

### Locale Support
- **Primary**: Danish (da-DK) and English (en-GB)
- **Fallback**: English for missing translations
- **Detection**: Browser preference with manual override
- **Persistence**: localStorage with server sync

### Translation Structure
```typescript
interface Translations {
  signup: {
    title: string;
    subtitle: string;
    form: {
      email: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          invalid: string;
          exists: string;
        };
      };
      firstName: {
        label: string;
        placeholder: string;
        error: {
          required: string;
          minLength: string;
        };
      };
      country: {
        label: string;
        placeholder: string;
        error: {
          required: string;
        };
      };
      consents: {
        terms: {
          label: string;
          link: string;
          error: string;
        };
        privacy: {
          label: string;
          link: string;
          error: string;
        };
        marketing: {
          label: string;
          description: string;
        };
      };
    };
    actions: {
      submit: string;
      sendMagicLink: string;
      backToSignup: string;
      resendEmail: string;
    };
  };
}
```

## Testing Strategy

### Unit Testing
- Component rendering and prop handling
- Form validation logic
- Utility function behavior
- Internationalization fallbacks

### Integration Testing
- Complete signup flow scenarios
- Error handling paths
- Accessibility compliance
- Cross-browser compatibility

### End-to-End Testing
- Full user journey from signup to ready state
- Email verification flow (mocked)
- Existing user detection and magic link flow
- Locale switching and persistence

### Accessibility Testing
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader compatibility verification
- Color contrast validation

## Performance Considerations

### Optimization Strategies
- Code splitting by route for faster initial loads
- Lazy loading of non-critical components
- Optimized bundle size with tree shaking
- Efficient re-rendering with React.memo and useMemo

### Metrics and Monitoring
- Core Web Vitals tracking
- Form completion rates
- Error occurrence monitoring
- Accessibility compliance scoring

## Security Considerations

### Data Protection
- Client-side input sanitization
- HTTPS enforcement for all communications
- Secure token generation and validation
- GDPR-compliant consent tracking

### Privacy Implementation
- Minimal data collection approach
- Clear consent mechanisms
- Data retention policies
- User rights management (access, deletion)

## Technical Decisions and Rationales

### Framework Choice: Next.js
- **Rationale**: Excellent TypeScript support, built-in internationalization, optimized performance, and strong ecosystem
- **Trade-offs**: Slightly larger bundle size compared to lighter frameworks, but benefits outweigh costs

### Styling: Tailwind CSS
- **Rationale**: Rapid development, consistent design system, excellent purging for production builds
- **Trade-offs**: Learning curve for team members unfamiliar with utility-first CSS

### Form Management: React Hook Form + Zod
- **Rationale**: Type-safe validation, excellent performance, minimal re-renders
- **Trade-offs**: Additional dependencies, but significantly improves developer experience and reliability

### State Management: Context + Zustand
- **Rationale**: Context for signup flow state (temporary), Zustand for global app state (persistent)
- **Trade-offs**: Hybrid approach requires clear boundaries, but provides optimal performance for each use case