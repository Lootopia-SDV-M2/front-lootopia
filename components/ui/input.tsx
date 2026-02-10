import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * A sleek, dark input with subtle gold focus ring.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-black/[0.06] bg-background-surface-alt px-4 py-2 text-sm text-text-heading transition-all duration-300",
          "placeholder:text-text-muted",
          "focus-visible:border-primary/30 focus-visible:shadow-glow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-40",
          error
            ? "border-status-error/50 focus-visible:border-status-error/50 focus-visible:ring-status-error/20"
            : "hover:border-black/[0.08]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
