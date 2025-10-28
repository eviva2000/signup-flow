import type { Metadata } from 'next';
import { LocaleProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: {
    template: '%s | Waitly Signup',
    default: 'Sign Up - Waitly',
  },
  description: 'Join Waitly to get on apartment waiting lists and find your next home in Denmark.',
  keywords: ['apartment', 'waiting list', 'housing', 'Denmark', 'signup', 'registration'],
  openGraph: {
    title: 'Sign Up - Waitly',
    description: 'Join Waitly to get on apartment waiting lists and find your next home in Denmark.',
    type: 'website',
    siteName: 'Waitly',
    locale: 'en_GB',
    alternateLocale: 'da_DK',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      'en-GB': '/signup',
      'da-DK': '/signup',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

interface SignupLayoutProps {
  children: React.ReactNode;
}

export default function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <LocaleProvider>
      <div className="signup-layout">
        {/* Optional: Add signup-specific navigation or header */}
        <main className="signup-main">
          {children}
        </main>
        
        {/* Optional: Add signup-specific footer */}
        <footer className="signup-footer sr-only">
          <p>Waitly Signup Process</p>
        </footer>
      </div>
    </LocaleProvider>
  );
}