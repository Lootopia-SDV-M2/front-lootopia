"use client";

import { Locate } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  onCenterUser: () => void;
  isLoading?: boolean;
  error?: string | null;
  hasPosition?: boolean;
  huntCount?: number;
  label?: string;
}

/**
 * Floating control buttons for the map.
 * Includes location centering and zoom controls.
 */
export function MapControls({
  onCenterUser,
  isLoading,
  error,
  hasPosition,
  huntCount,
  label = "Chasses disponibles",
}: MapControlsProps) {
  return (
    <>
      {/* Location button */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={onCenterUser}
          disabled={isLoading}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.06] bg-background-surface/90 shadow-glass backdrop-blur-xl transition-all duration-300 hover:border-primary/20 hover:shadow-glow-sm active:scale-95",
            isLoading && "cursor-not-allowed opacity-50",
            hasPosition && "border-primary/30 shadow-glow-sm"
          )}
          title="Centrer sur ma position"
        >
          <Locate
            className={cn(
              "h-5 w-5",
              hasPosition ? "text-primary" : "text-text-muted",
              isLoading && "animate-pulse"
            )}
          />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000] md:left-auto md:right-4 md:max-w-xs">
          <div className="rounded-xl border border-status-error/20 bg-status-error/10 px-4 py-3 shadow-glass backdrop-blur-xl">
            <p className="text-sm text-status-error">{error}</p>
          </div>
        </div>
      )}

      {/* Hunt count badge */}
      <div className="absolute left-4 top-4 z-[1000]">
        <div className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-background-surface/90 px-4 py-2.5 shadow-glass backdrop-blur-xl">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-gold-600 text-xs font-bold text-primary-foreground">
            {huntCount ?? 0}
          </span>
          <span className="text-sm font-medium text-text-heading">{label}</span>
        </div>
      </div>
    </>
  );
}
