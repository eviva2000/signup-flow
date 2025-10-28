import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-waitly-primary-50 to-waitly-neutral-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/logo-dark.png"
              alt="Waitly Logo"
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/signup"
              className="text-waitly-neutral-600 hover:text-waitly-neutral-900 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="text-waitly-neutral-600 hover:text-waitly-neutral-900 transition-colors"
            >
              Log In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-waitly-neutral-900 mb-6 leading-tight">
            Find Your Next Home {' '}
            <span className="text-waitly-primary-600">Here</span>
          </h1>

          <p className="text-xl text-waitly-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join apartment waiting lists across Denmark and get notified when
            your perfect home becomes available. Simple, fast, and designed for
            the Danish housing market.
          </p>

          {/* Demo Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-waitly-neutral-200 p-8 mb-16">
            <h2 className="text-2xl font-semibold text-waitly-neutral-900 mb-6">
              🚀 Signup Flow Demo
            </h2>
            <p className="text-waitly-neutral-600 mb-6">
              Experience our accessible, internationalized signup process built
              with modern web technologies.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-waitly-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-waitly-primary-600 font-semibold">
                    1
                  </span>
                </div>
                <h3 className="font-medium text-waitly-neutral-900 mb-2">
                  Create Account
                </h3>
                <p className="text-sm text-waitly-neutral-600">
                  Fill out the signup form with validation
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-waitly-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-waitly-primary-600 font-semibold">
                    2
                  </span>
                </div>
                <h3 className="font-medium text-waitly-neutral-900 mb-2">
                  Verify Email
                </h3>
                <p className="text-sm text-waitly-neutral-600">
                  Secure email verification process
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-waitly-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-waitly-primary-600 font-semibold">
                    3
                  </span>
                </div>
                <h3 className="font-medium text-waitly-neutral-900 mb-2">
                  Start Searching
                </h3>
                <p className="text-sm text-waitly-neutral-600">
                  Join waiting lists for apartments
                </p>
              </div>
            </div>

            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Try the Signup Flow →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-waitly-neutral-200">
        <div className="text-center text-waitly-neutral-600">
          <p>&copy; 2024 Waitly. Built for the Danish housing market.</p>
        </div>
      </footer>
    </div>
  );
}
