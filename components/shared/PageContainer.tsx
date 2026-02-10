"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  animate?: boolean;
}

/**
 * A page container component that provides consistent layout,
 * optional title/subtitle, and entrance animations.
 */
export function PageContainer({
  children,
  className,
  title,
  subtitle,
  animate = true,
}: PageContainerProps) {
  const [mounted, setMounted] = useState(!animate);

  useEffect(() => {
    if (animate) {
      setMounted(true);
    }
  }, [animate]);

  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        animate && "transition-all duration-500",
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
    >
      {(title || subtitle) && (
        <header className="mb-8">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-text-heading md:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}
