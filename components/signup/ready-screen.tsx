"use client";

import React from 'react';
import { Button } from '@/components/ui';
import { useTranslations } from '@/lib/i18n/use-translations';

export interface ReadyScreenProps {
  userName?: string | undefined;
  nextActions?: Array<{
    title: string;
    description: string;
    href: string;
    primary?: boolean;
    onClick?: () => void;
  }>;
  onExploreListings?: () => void;
  onCompleteProfile?: () => void;
  onBrowseWaitlists?: () => void;
  isLoading?: boolean;
}

export function ReadyScreen({
  userName,
  nextActions,
  onExploreListings,
  onCompleteProfile,
  onBrowseWaitlists,
  isLoading = false,
}: ReadyScreenProps) {
  const { t } = useTranslations('signup');

  // Default next actions if none provided
  const defaultActions = [
    {
      title: t('ready.actions.exploreListings'),
      description: 'Discover available apartments and join waiting lists',
      href: '/listings',
      primary: true,
      onClick: onExploreListings,
    },
    {
      title: t('ready.actions.completeProfile'),
      description: 'Add more details to improve your apartment matches',
      href: '/profile',
      primary: false,
      onClick: onCompleteProfile,
    },
    {
      title: t('ready.actions.browseWaitlists'),
      description: 'View and manage your current waiting list positions',
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

  return (
    <div className="min-h-screen bg-waitly-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay for page transitions */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-waitly-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-waitly-neutral-600">Loading...</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md mx-auto text-center">
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
          <p 
            id={`action-${primaryAction.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
            className="text-sm text-waitly-neutral-500"
          >
            {primaryAction.description}
          </p>
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
                <p 
                  id={`action-${action.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
                  className="text-xs text-waitly-neutral-500 mt-1"
                >
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="pt-6 border-t border-waitly-neutral-200">
          <p className="text-sm text-waitly-neutral-500">
            Need help getting started?{' '}
            <a 
              href="/help" 
              className="text-waitly-primary hover:text-waitly-primary-hover underline focus:outline-none focus:ring-2 focus:ring-waitly-primary focus:ring-offset-2 rounded"
            >
              Visit our help center
            </a>
          </p>
        </div>

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