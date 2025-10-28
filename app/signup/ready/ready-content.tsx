"use client";

import { useSearchParams } from 'next/navigation';
import { ReadyScreen } from '@/components/signup/ready-screen';
import { useSignupNavigation } from '@/lib/hooks/use-signup-navigation';

export default function ReadyPageContent() {
  const { isPending, goHome } = useSignupNavigation();
  const searchParams = useSearchParams();
  
  // Get user name from URL params if available (passed from verification)
  const userName = searchParams.get('name') || undefined;

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
    <ReadyScreen
      userName={userName}
      onExploreListings={handleExploreListings}
      onCompleteProfile={handleCompleteProfile}
      onBrowseWaitlists={handleBrowseWaitlists}
      isLoading={isPending}
    />
  );
}