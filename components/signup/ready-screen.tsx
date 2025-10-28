"use client";

import React from 'react';
import { Button } from '@/components/ui';
import { useTranslations } from '@/lib/i18n/use-translations';

export interface ReadyScreenProps {
  userName?: string | undefined;
  nextActions?: Array<{
    title: string;
    href: string;
    primary?: boolean;
    onClick?: () => void;
  }>;
  onExploreListings?: () => void;
  onCompleteProfile?: () => void;
  onBrowseWaitlists?: () => void;
  isLoading?: boolean;
  compact?: boolean; // New prop to control layout
}

export function ReadyScreen({
  userName,
  nextActions,
  onExploreListings,
  onCompleteProfile,
  onBrowseWaitlists,
  isLoading = false,
  compact = false,
}: ReadyScreenProps) {
  const { t } = useTranslations('signup');

  // Default next actions if none provided
  const defaultActions = [
    {
      title: t('ready.actions.exploreListings'),
      href: '/listings',
      primary: true,
      onClick: onExploreListings,
    },
    {
      title: t('ready.actions.completeProfile'),
      href: '/profile',
      primary: false,
      onClick: onCompleteProfile,
    },
    {
      title: t('ready.actions.browseWaitlists'),
      href: '/waitlists',
      primary: false,
      onClick: onBrowseWaitlists,
    },
  ];

  const actions = nextActions || defaultActions;
  const primaryAction = actions.find(action => action.primary) || actions[0];
  const secondaryActions = actions.filter(action => !action.primary);

  // Ensure we have a primary action
  if (!primaryAction) {
    throw new Error('ReadyScreen: No primary action available');
  }

  const containerClass = compact 
    ? "w-full text-center" 
    : "min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8";

  return (
    <div className={containerClass}>
      {/* Loading overlay for page transitions */}
      {!compact && isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-waitly-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-waitly-neutral-600">Loading...</span>
          </div>
        </div>
      )}

      <div className={compact ? "w-full" : "w-full max-w-md mx-auto text-center"}>
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-waitly-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-10 h-10 text-waitly-success" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Welcome Message */}
          <h1 className="text-3xl font-bold text-waitly-neutral-900 mb-4">
            {t('ready.title')}
          </h1>
          
          <p className="text-waitly-neutral-600 mb-8 leading-relaxed">
            {userName 
              ? `Hi ${userName}! ${t('ready.message')}`
              : t('ready.message')
            }
          </p>
        </div>

        {/* Primary Action */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={primaryAction.onClick}
            variant="primary"
            size="lg"
            className="w-full bg-waitly-primary hover:bg-waitly-primary-hover focus:ring-waitly-primary"
            disabled={isLoading}
            aria-describedby={`action-${primaryAction.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
          >
            {primaryAction.title}
          </Button>

        </div>

        {/* Secondary Actions */}
        {secondaryActions.length > 0 && (
          <div className="space-y-3 mb-8">
            {secondaryActions.map((action, index) => (
              <div key={index}>
                <Button
                  onClick={action.onClick}
                  variant="outline"
                  size="md"
                  className="w-full border-waitly-neutral-300 text-waitly-neutral-700 hover:bg-waitly-neutral-50 focus:ring-waitly-primary"
                  disabled={isLoading}
                  aria-describedby={`action-${action.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
                >
                  {action.title}
                </Button>

              </div>
            ))}
          </div>
        )}



        {/* Branding Footer */}
        <div className="mt-8 pt-6">
          <p className="text-xs text-waitly-neutral-400">
            Powered by Waitly - Making apartment hunting easier
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReadyScreen;