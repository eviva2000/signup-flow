import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string | undefined;
  error?: string | undefined;
  required?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, required, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || `checkbox-${generatedId}`;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    
    const describedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={describedBy}
              aria-required={required}
              className={cn(
                "h-5 w-5 rounded-waitly-radius-sm border-2 border-waitly-neutral-300",
                "text-waitly-primary focus:ring-2 focus:ring-waitly-primary focus:ring-offset-2",
                "transition-colors duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-waitly-error focus:ring-waitly-error",
                className
              )}
              {...props}
            />
            {/* Custom checkmark icon */}
            <svg
              className={cn(
                "absolute inset-0 h-5 w-5 text-white pointer-events-none",
                "opacity-0 transition-opacity duration-200",
                props.checked && "opacity-100"
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          {label && (
            <div className="flex-1 min-w-0">
              <label
                htmlFor={checkboxId}
                className={cn(
                  "block text-sm font-medium text-waitly-neutral-900 cursor-pointer",
                  required && "after:content-['*'] after:ml-0.5 after:text-waitly-error"
                )}
              >
                {label}
              </label>
              {description && (
                <p id={descriptionId} className="mt-1 text-sm text-waitly-neutral-500">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm text-waitly-error ml-8"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };