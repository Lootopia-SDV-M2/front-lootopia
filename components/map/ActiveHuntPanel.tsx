"use client";

import { MapPin, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import type { Participation, GeoPosition } from "@/types";
import { calculateDistance } from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";

interface ActiveHuntPanelProps {
  participation: Participation;
  userPosition: GeoPosition | null;
  onValidateStep: () => void;
  onAbandon: () => void;
}

export function ActiveHuntPanel({
  participation,
  userPosition,
  onValidateStep,
  onAbandon,
}: ActiveHuntPanelProps) {
  const currentStep = participation.steps[participation.currentStepIndex];
  if (!currentStep) return null;

  const totalSteps = participation.steps.length;
  const progressPercent = (participation.currentStepIndex / totalSteps) * 100;

  const distance = userPosition
    ? calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        currentStep.latitude,
        currentStep.longitude
      )
    : null;

  const isInRange = distance !== null && distance <= currentStep.radius;

  const formatDistance = (d: number) => {
    if (d < 1000) return `${Math.round(d)}m`;
    return `${(d / 1000).toFixed(1)}km`;
  };

  return (
    <div className="absolute bottom-20 left-3 right-3 z-[1000] md:bottom-4 md:left-auto md:right-4 md:w-[380px]">
      <div className="rounded-2xl border border-black/[0.06] bg-background/95 p-4 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold text-text-heading">
              {participation.huntTitle}
            </h3>
            <p className="text-xs text-text-muted">
              Etape {participation.currentStepIndex + 1}/{totalSteps}
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm("Abandonner cette chasse ?")) onAbandon();
            }}
            className="rounded-lg p-1.5 text-text-muted hover:bg-black/[0.04]"
            title="Abandonner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-gold-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Current step info */}
        <div className="mb-3 rounded-xl border border-black/[0.04] bg-background-surface/60 p-3">
          <p className="mb-1 text-sm font-semibold text-text-heading">
            {currentStep.title}
          </p>
          <p className="line-clamp-2 text-xs text-text-muted">
            {currentStep.description}
          </p>
        </div>

        {/* Distance */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin
              className={cn(
                "h-4 w-4",
                isInRange ? "text-status-success" : "text-text-muted"
              )}
            />
            {distance !== null ? (
              <span className="text-sm text-text-body">
                {formatDistance(distance)}
              </span>
            ) : (
              <span className="text-sm text-text-muted">
                Position GPS requise
              </span>
            )}
          </div>
          {isInRange && (
            <span className="flex items-center gap-1 rounded-lg bg-status-success/10 px-2 py-1 text-xs font-medium text-status-success">
              <CheckCircle className="h-3 w-3" />A portee !
            </span>
          )}
        </div>

        {/* Validate button */}
        <Button
          variant="primary"
          size="md"
          className="w-full"
          disabled={!isInRange}
          onClick={onValidateStep}
        >
          {isInRange ? "Valider l'etape" : "Rapprochez-vous du point"}
        </Button>
      </div>
    </div>
  );
}
