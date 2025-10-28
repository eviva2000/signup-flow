import React from 'react';
import { cn } from '@/lib/utils';

export interface ErrorMessageProps {
  message?: string;
  className?: string;
  variant?: 'inline' | 'toast' | 'banner';
  onDismiss?: () => void;
  title?: string;
  children?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  variant = 'inline',
  onDismiss,
  title,
  children,
}) => {
  if (!message && !children) return null;

  const content = children || message;

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          "text-sm text-waitly-error",
          className
        )}
      >
        {content}
      </div>
    );
  }

  if (variant === 'toast') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={cn(
          "fixed top-4 right-4 z-50 max-w-md",
          "bg-white border border-waitly-error rounded-waitly-radius-lg shadow-lg",
          "p-4 space-y-2",
          "animate-in slide-in-from-top-2 fade-in-0 duration-300",
          className
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-waitly-error"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-medium text-waitly-neutral-900">
                {title}
              </h3>
            )}
            <div className="text-sm text-waitly-neutral-700">
              {content}
            </div>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 rounded-md p-1.5 text-waitly-neutral-400 hover:text-waitly-neutral-600 focus:outline-none focus:ring-2 focus:ring-waitly-primary"
              aria-label="Dismiss error"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          "bg-waitly-error/10 border border-waitly-error rounded-waitly-radius-md p-4",
          className
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-waitly-error"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-medium text-waitly-error">
                {title}
              </h3>
            )}
            <div className="text-sm text-waitly-error">
              {content}
            </div>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 rounded-md p-1.5 text-waitly-error/70 hover:text-waitly-error focus:outline-none focus:ring-2 focus:ring-waitly-primary"
              aria-label="Dismiss error"
            >
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export { ErrorMessage };