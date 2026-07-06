"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex min-h-screen flex-col items-center justify-center bg-background text-text-body",
          showRadialGradient &&
            "bg-[radial-gradient(circle_at_top,#fff7df_0%,#faf8f4_34%,#f3efe7_100%)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </main>
  );
};
