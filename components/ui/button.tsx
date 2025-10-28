import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Size variants
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-4 text-base": size === "md",
            "h-14 px-6 text-lg": size === "lg",
          },

          // Color variants
          {
            // Primary - Waitly brand colors
            "bg-waitly-primary text-waitly-primary-text hover:bg-waitly-primary-hover focus:ring-waitly-primary":
              variant === "primary",

            // Secondary - Waitly neutral colors
            "bg-waitly-neutral-100 text-waitly-neutral-900 hover:bg-waitly-neutral-200 focus:ring-waitly-primary":
              variant === "secondary",

            // Outline - Waitly neutral with primary focus
            "border border-waitly-neutral-300 bg-white text-waitly-neutral-900 hover:bg-waitly-neutral-50 focus:ring-waitly-primary":
              variant === "outline",

            // Ghost - Waitly neutral colors
            "text-waitly-neutral-900 hover:bg-waitly-neutral-100 focus:ring-waitly-primary":
              variant === "ghost",
          },

          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={loading ? "sr-only" : undefined}>
          {loading && loadingText ? loadingText : children}
        </span>
        {loading && loadingText && (
          <span aria-live="polite" aria-atomic="true">
            {loadingText}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
