import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

/**
 * A game-themed badge component.
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-background-surface-alt text-text-muted",
    primary: "bg-primary text-primary-foreground",
    success: "bg-status-success text-white",
    warning: "bg-status-warning text-primary",
    destructive: "bg-status-error text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
