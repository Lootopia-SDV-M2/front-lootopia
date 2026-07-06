"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-sans font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-45";

    const variants = {
      primary:
        "border-[#3a2a0a] bg-[#2a2418] text-[#fff8e6] shadow-[0_1px_2px_rgba(42,36,24,0.18),inset_0_1px_0_rgba(255,255,255,0.10)] hover:border-[#4a3710] hover:bg-[#3a2d14] active:bg-[#18140d]",
      secondary:
        "border-black/[0.10] bg-background-surface text-text-heading shadow-[0_1px_2px_rgba(28,27,24,0.06)] hover:border-primary/35 hover:bg-[#fffaf0]",
      ghost:
        "border-transparent bg-transparent text-text-muted hover:border-black/[0.06] hover:bg-black/[0.04] hover:text-text-heading",
      destructive:
        "border-status-error bg-status-error text-white shadow-[0_1px_2px_rgba(220,38,38,0.16)] hover:bg-status-error/90",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-sm sm:text-base",
      icon: "h-11 w-11 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            <span>Chargement...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
