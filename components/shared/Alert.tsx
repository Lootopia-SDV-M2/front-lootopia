import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A futuristic, game-themed alert component.
 */
export function Alert({
  variant = "info",
  title,
  children,
  className,
}: AlertProps) {
  const variants = {
    info: {
      container: "border-primary/20 bg-primary/[0.06]",
      icon: "text-primary",
      title: "text-text-heading",
      content: "text-primary",
      Icon: Info,
    },
    success: {
      container: "border-status-success/20 bg-status-success/[0.06]",
      icon: "text-status-success",
      title: "text-text-heading",
      content: "text-status-success",
      Icon: CheckCircle,
    },
    warning: {
      container: "border-status-warning/20 bg-status-warning/[0.06]",
      icon: "text-status-warning",
      title: "text-text-heading",
      content: "text-status-warning",
      Icon: AlertTriangle,
    },
    error: {
      container: "border-status-error/20 bg-status-error/[0.06]",
      icon: "text-status-error",
      title: "text-text-heading",
      content: "text-status-error",
      Icon: AlertCircle,
    },
  };

  const {
    container,
    icon,
    title: titleStyle,
    content,
    Icon,
  } = variants[variant];

  return (
    <div
      className={cn("flex gap-4 rounded-xl border p-4", container, className)}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", icon)} />
      <div className="flex-1">
        {title && (
          <h4 className={cn("font-heading font-bold", titleStyle)}>{title}</h4>
        )}
        <div className={cn("text-sm", title && "mt-1", content)}>
          {children}
        </div>
      </div>
    </div>
  );
}
