# Waitly - Apartment Waiting List Platform

A modern, accessible signup flow, helping users join apartment waiting lists in Denmark. Built with Next.js 13+, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Signup Flow

- **Multi-step Registration**: Email, personal details, country selection, and consent management
- **Email Verification**: Secure account activation with verification tokens
- **Existing User Detection**: Automatic detection with magic link authentication
- **Real-time Validation**: Immediate feedback with Zod schema validation
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

### Internationalization

- **Multi-language Support**: English (en-GB) and Danish (da-DK)
- **Locale-aware Components**: Country selection and form labels adapt to user language
- **Dynamic Language Switching**: Users can change language during signup

### Accessibility (WCAG 2.1 AA Compliant)

- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Visible focus indicators and color contrast compliance
- **Form Accessibility**: Proper labels, error announcements, and validation states

### Technical Features

- **Type Safety**: Full TypeScript implementation with strict type checking
- **Performance Optimized**: React Hook Form for minimal re-renders
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Reusable UI components following atomic design

## 🛠️ Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: Custom i18n implementation
- **State Management**: React hooks and context
- **Testing**: Ready for Jest/Testing Library integration

## 📁 Project Structure

```
waitly/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   └── signup/                  # Signup feature module
│       ├── layout.tsx           # Signup-specific layout
│       ├── page.tsx             # Main signup page
│       ├── error.tsx            # Error boundary
│       └── verify/              # Email verification
│           └── page.tsx         # Verification page
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx           # Button component
│   │   ├── input.tsx            # Input component
│   │   ├── select.tsx           # Select component
│   │   └── checkbox.tsx         # Checkbox component
│   ├── forms/                   # Form-specific components
│   │   ├── country-select.tsx   # Country selection
│   │   └── consent-checkbox.tsx # GDPR consent checkboxes
│   └── signup/                  # Signup flow components
│       ├── signup-form.tsx      # Main signup form
│       ├── existing-user-prompt.tsx # Existing user flow
│       └── email-verification-screen.tsx # Email verification
├── lib/                         # Business logic & utilities
│   ├── auth/                    # Authentication system
│   │   ├── index.ts             # Auth context and hooks
│   │   ├── storage.ts           # User data storage
│   │   └── signup-integration.ts # Signup business logic
│   ├── i18n/                    # Internationalization
│   │   ├── config.ts            # i18n configuration
│   │   ├── index.ts             # Translation utilities
│   │   └── use-translations.tsx # Translation hook
│   ├── utils/                   # Utility functions
│   │   ├── accessibility.ts     # Accessibility helpers
│   │   ├── consent.ts           # GDPR consent management
│   │   └── verification.ts      # Email verification logic
│   ├── validations/             # Schema validation
│   │   └── signup.ts            # Signup form schemas
│   └── hooks/                   # Custom React hooks
│       └── use-signup-navigation.ts # Navigation management
└── public/                      # Static assets
    ├── logo-dark.png           # Waitly logo
    └── locales/                # Translation files
        ├── en-GB/              # English translations
        └── da-DK/              # Danish translations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd waitly
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Key URLs

- **Main Signup**: `/signup`
- **Email Verification**: `/signup/verify`
- **Landing Page**: `/`

## 🎯 User Flow

### 1. Signup Process

```
Landing Page → Signup Form → Email Verification → Account Activated
                    ↓
            Existing User Detection → Magic Link → Login
```

### 2. Form Validation

- **Real-time validation** on field blur
- **Schema-based validation** with Zod
- **Internationalized error messages**
- **Accessibility-compliant error announcements**

### 3. Consent Management

- **GDPR-compliant consent collection**
- **Separate consent storage** for legal compliance
- **Required consents**: Terms & Conditions, Privacy Policy
- **Optional consent**: Marketing communications

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage

- **Component testing**: UI component behavior
- **Form validation**: Schema validation logic
- **User flows**: Complete signup journey
- **Accessibility**: WCAG compliance testing

## 🌐 Internationalization

### Adding New Languages

1. **Create translation files**

   ```
   public/locales/[locale]/
   ├── common.json
   ├── signup.json
   └── validation.json
   ```

2. **Update i18n configuration**

   ```typescript
   // lib/i18n/config.ts
   export const SUPPORTED_LOCALES = ["en-GB", "da-DK", "new-locale"];
   ```

3. **Add locale-specific logic**
   ```typescript
   // Country names, date formats, etc.
   ```

### Authentication

- **Email Verification**: Secure account activation
- **Magic Links**: Passwordless authentication
- **Token Management**: Secure verification tokens
- **Session Management**: Secure user sessions

## 🎨 Design System

### Color Palette

```css
/* Waitly Brand Colors */
--waitly-primary: #d8b4fe; /* Primary purple */
--waitly-primary-hover: #cbacff; /* Hover state */
--waitly-neutral-900: #0f172a; /* Dark text */
--waitly-neutral-500: #64748b; /* Medium text */
--waitly-success: #059669; /* Success green */
--waitly-error: #dc2626; /* Error red */
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: Optimized for readability

### Components

- **Consistent spacing**: 8px grid system
- **Accessible touch targets**: Minimum 44px
- **Focus indicators**: High contrast outlines
- **Responsive breakpoints**: Mobile-first approach


### Build Optimization

```bash
# Production build
npm run build







