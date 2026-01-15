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
      container: "border-brand-accent/30 bg-brand-accent/10",
      icon: "text-brand-accent",
      title: "text-brand-light",
      content: "text-brand-accent",
      Icon: Info,
    },
    success: {
      container: "border-brand-success/30 bg-brand-success/10",
      icon: "text-brand-success",
      title: "text-brand-light",
      content: "text-brand-success",
      Icon: CheckCircle,
    },
    warning: {
      container: "border-brand-primary/30 bg-brand-primary/10",
      icon: "text-brand-primary",
      title: "text-brand-light",
      content: "text-brand-primary",
      Icon: AlertTriangle,
    },
    error: {
      container: "border-brand-danger/30 bg-brand-danger/10",
      icon: "text-brand-danger",
      title: "text-brand-light",
      content: "text-brand-danger",
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
