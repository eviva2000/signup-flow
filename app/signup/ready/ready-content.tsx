"use client";

import { useSearchParams } from 'next/navigation';
import { ReadyScreen } from '@/components/signup/ready-screen';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';
import { useAuth } from '@/lib/auth';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function ReadyPageContent() {
  const { isPending, goHome } = useSignupNavigation();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  
  // Get user name from URL params if available (passed from verification) or from auth context
  const userName = searchParams.get('name') || user?.firstName || undefined;

  const handleExploreListings = () => {
    // TODO: This will navigate to the main app when implemented
    goHome();
  };

  const handleCompleteProfile = () => {
    // TODO: This will navigate to profile completion when implemented
    // For now, go to home page
    goHome();
  };

  const handleBrowseWaitlists = () => {
    // TODO: This will navigate to waitlists when implemented
    // For now, go to home page
    goHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay for page transitions */}
      {isPending && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Main card container */}
      <div className="w-full max-w-md">
        {/* Language selector above the card */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <ReadyScreen
            userName={userName}
            onExploreListings={handleExploreListings}
            onCompleteProfile={handleCompleteProfile}
            onBrowseWaitlists={handleBrowseWaitlists}
            isLoading={false} // We handle loading in this component
            compact={true} // Use compact layout for card
          />
        </div>
      </div>
    </div>
  );
}