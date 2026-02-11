"use client";

import { X, Clock, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/data/mock-hunts";
import type { Hunt } from "@/types";
import { cn } from "@/lib/utils";

interface HuntPopupProps {
  hunt: Hunt;
  onAccept: (hunt: Hunt) => void;
  onClose: () => void;
}

export function HuntPopup({ hunt, onAccept, onClose }: HuntPopupProps) {
  const availableRewards = hunt.rewards
    ? hunt.rewards.filter((r) => !r.winnerId).length
    : 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Mobile: bottom sheet / Desktop: side panel */}
      <div
        className={cn(
          "fixed z-[1200] overflow-y-auto rounded-t-3xl border border-black/[0.06] bg-background shadow-2xl",
          "bottom-0 left-0 right-0 max-h-[60vh] animate-slide-up",
          "md:animate-slide-left md:bottom-auto md:left-auto md:right-0 md:top-16 md:max-h-[calc(100vh-4rem)] md:w-[400px] md:rounded-l-3xl md:rounded-t-none"
        )}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full bg-black/10" />
        </div>

        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-text-muted hover:bg-background-surface-alt"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Difficulty badge */}
          <span
            className={`mb-3 inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${getDifficultyColor(hunt.difficulty)}`}
          >
            {getDifficultyLabel(hunt.difficulty)}
          </span>

          {/* Title */}
          <h2 className="mb-2 font-heading text-xl font-bold text-text-heading">
            {hunt.title}
          </h2>

          {/* Meta info */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {hunt.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-primary" />
              {hunt.reward} XP
            </span>
          </div>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-body">
            {hunt.description}
          </p>

          {/* Rewards info */}
          {hunt.rewards && hunt.rewards.length > 0 && (
            <div className="mb-6 rounded-xl border border-primary/10 bg-primary/[0.04] px-4 py-3">
              <p className="text-sm font-medium text-primary">
                {availableRewards} recompense{availableRewards > 1 ? "s" : ""}{" "}
                disponible{availableRewards > 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => onAccept(hunt)}
            >
              Accepter la chasse
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
