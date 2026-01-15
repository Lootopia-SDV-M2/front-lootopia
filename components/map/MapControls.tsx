"use client";

import { Locate, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  onCenterUser: () => void;
  isLoading?: boolean;
  error?: string | null;
  hasPosition?: boolean;
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
}: MapControlsProps) {
  return (
    <>
      {/* Location button */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={onCenterUser}
          disabled={isLoading}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200 hover:bg-gray-50 active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700",
            isLoading && "cursor-not-allowed opacity-50",
            hasPosition && "ring-2 ring-blue-500 ring-offset-2"
          )}
          title="Centrer sur ma position"
        >
          <Locate
            className={cn(
              "h-5 w-5",
              hasPosition
                ? "text-blue-500"
                : "text-gray-600 dark:text-gray-300",
              isLoading && "animate-pulse"
            )}
          />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000] md:left-auto md:right-4 md:max-w-xs">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-lg dark:border-red-800 dark:bg-red-900/50">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Hunt count badge */}
      <div className="absolute left-4 top-4 z-[1000]">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-gray-800/90">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold text-white">
            6
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Chasses disponibles
          </span>
        </div>
      </div>
    </>
  );
}
