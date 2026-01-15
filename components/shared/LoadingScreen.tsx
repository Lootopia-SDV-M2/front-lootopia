import { Spinner } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface LoadingScreenProps {
  message?: string;
  className?: string;
}

/**
 * A full-screen loading component with the Lootopia branding.
 * Used for page transitions and initial data loading.
 */
export function LoadingScreen({
  message = "Chargement...",
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-muted-foreground animate-pulse text-sm font-medium">
        {message}
      </p>
    </div>
  );
}
