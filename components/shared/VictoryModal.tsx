"use client";

import { useEffect, useState } from "react";
import { Trophy, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  huntTitle: string;
  xpEarned: number;
  onContinue?: () => void;
}

/**
 * Victory modal displayed when a player successfully completes a hunt.
 * Shows celebration animation and XP earned.
 */
export function VictoryModal({
  isOpen,
  onClose,
  huntTitle,
  xpEarned,
  onContinue,
}: VictoryModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedXp, setAnimatedXp] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Animate XP counter
      const duration = 1500;
      const steps = 30;
      const stepValue = xpEarned / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= xpEarned) {
          setAnimatedXp(xpEarned);
          clearInterval(interval);
        } else {
          setAnimatedXp(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    } else {
      setShowConfetti(false);
      setAnimatedXp(0);
    }
  }, [isOpen, xpEarned]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Confetti effect */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: [
                  "#f59e0b",
                  "#22c55e",
                  "#3b82f6",
                  "#ef4444",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      {/* Modal content */}
      <div className="animate-bounce-in relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-1 shadow-2xl">
          <div className="relative rounded-[22px] bg-white p-8 text-center dark:bg-gray-900">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Trophy icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Trophy className="h-12 w-12 text-white" />
            </div>

            {/* Victory text */}
            <div className="mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Félicitations !
              </h2>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Vous avez terminé la chasse
              <br />
              <span className="font-semibold text-gray-900 dark:text-white">
                &quot;{huntTitle}&quot;
              </span>
            </p>

            {/* XP earned */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 dark:from-amber-950/50 dark:to-orange-950/50">
              <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                <Star className="h-6 w-6 fill-current" />
                <span className="text-4xl font-bold">+{animatedXp}</span>
                <span className="text-lg font-medium">XP</span>
              </div>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                Points d&apos;expérience gagnés
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onContinue || onClose}
              >
                Continuer l&apos;aventure
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                onClick={onClose}
              >
                Voir mon profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
