import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // Keep error for potential non-form usage, but style it simply
}

/**
 * A clean, accessible input component.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-background-surface-alt px-4 py-2 text-sm text-primary transition-all duration-200",
          "placeholder:text-text-muted",
          "focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-status-error focus-visible:border-status-error"
            : "hover:border-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
