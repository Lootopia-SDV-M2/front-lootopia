import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

/**
 * A refined badge with subtle glass effect.
 */
export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-black/[0.03] text-text-muted border border-black/[0.06]",
    primary: "bg-primary/10 text-primary border border-primary/20",
    success:
      "bg-status-success/10 text-status-success border border-status-success/20",
    warning:
      "bg-status-warning/10 text-status-warning border border-status-warning/20",
    destructive:
      "bg-status-error/10 text-status-error border border-status-error/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
