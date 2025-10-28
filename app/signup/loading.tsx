export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          {/* Loading spinner */}
          <div className="w-16 h-16 border-4 border-waitly-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          
          <h1 className="text-2xl font-bold text-waitly-neutral-900 mb-2">
            Loading signup...
          </h1>
          
          <p className="text-waitly-neutral-500">
            Please wait while we prepare the signup form.
          </p>
        </div>

        {/* Skeleton form preview */}
        <div className="space-y-6 opacity-50">
          <div className="space-y-2">
            <div className="h-4 bg-waitly-neutral-200 rounded w-20"></div>
            <div className="h-10 bg-waitly-neutral-200 rounded"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-waitly-neutral-200 rounded w-24"></div>
            <div className="h-10 bg-waitly-neutral-200 rounded"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-waitly-neutral-200 rounded w-16"></div>
            <div className="h-10 bg-waitly-neutral-200 rounded"></div>
          </div>
          
          <div className="h-12 bg-waitly-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}