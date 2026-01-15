"use client";

import { useCreateHuntStore } from "@/lib/stores";
import { Input, Button, Card } from "@/components/ui";
import { difficultyOptions, huntThemes } from "@/lib/validations";
import { getDifficultyColor } from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";
import { Clock, Users, Trophy, ChevronRight, AlertCircle } from "lucide-react";

interface StepOneFormProps {
  onNext: () => void;
}

/**
 * Step 1: General hunt information form
 * Collects: title, description, difficulty, duration, reward, participants, theme
 */
export function StepOneForm({ onNext }: StepOneFormProps) {
  const { draft, updateDraft } = useCreateHuntStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !draft.title ||
      !draft.description ||
      !draft.difficulty ||
      !draft.duration
    ) {
      return;
    }

    onNext();
  };

  const isFormValid =
    draft.title.length >= 3 &&
    draft.description.length >= 20 &&
    draft.difficulty &&
    draft.duration;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom de la chasse *
        </label>
        <Input
          type="text"
          placeholder="Ex: Le Trésor du Marais"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          error={draft.title.length > 0 && draft.title.length < 3}
        />
        {draft.title.length > 0 && draft.title.length < 3 && (
          <p className="mt-1 text-sm text-red-500">Minimum 3 caractères</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description *
        </label>
        <textarea
          placeholder="Décrivez votre chasse au trésor en quelques phrases..."
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          rows={4}
          className={cn(
            "flex w-full rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200",
            "placeholder:text-muted-foreground resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            draft.description.length > 0 && draft.description.length < 20
              ? "border-destructive"
              : "border-input"
          )}
        />
        <div className="mt-1 flex justify-between text-sm">
          {draft.description.length > 0 && draft.description.length < 20 ? (
            <p className="text-red-500">Minimum 20 caractères</p>
          ) : (
            <span />
          )}
          <span className="text-gray-400">
            {draft.description.length} / 1000
          </span>
        </div>
      </div>

      {/* Theme selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Thème
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {huntThemes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => updateDraft({ theme: theme.value })}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                draft.theme === theme.value
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/50"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              )}
            >
              <span className="text-xl">{theme.icon}</span>
              <span className="text-sm font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Difficulté *
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {difficultyOptions.map((option) => {
            const gradientColor = getDifficultyColor(option.value);
            const isSelected = draft.difficulty === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateDraft({ difficulty: option.value })}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-3 text-center transition-all",
                  isSelected
                    ? "border-transparent ring-2 ring-offset-2"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                )}
                style={{
                  ...(isSelected && {
                    boxShadow: `0 4px 14px rgba(245, 158, 11, 0.25)`,
                  }),
                }}
              >
                {isSelected && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-20`}
                  />
                )}
                <div className="relative">
                  <p className="font-semibold">{option.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration, Reward, Participants */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            Durée *
          </label>
          <Input
            type="text"
            placeholder="Ex: 1h30"
            value={draft.duration}
            onChange={(e) => updateDraft({ duration: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Trophy className="h-4 w-4" />
            Récompense (XP)
          </label>
          <Input
            type="number"
            min={10}
            max={5000}
            value={draft.reward}
            onChange={(e) =>
              updateDraft({ reward: parseInt(e.target.value) || 100 })
            }
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="h-4 w-4" />
            Participants max
          </label>
          <Input
            type="number"
            min={1}
            max={100}
            value={draft.maxParticipants}
            onChange={(e) =>
              updateDraft({ maxParticipants: parseInt(e.target.value) || 10 })
            }
          />
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid}
        >
          Continuer
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
