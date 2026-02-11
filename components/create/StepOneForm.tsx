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

export function StepOneForm({ onNext }: StepOneFormProps) {
  const { draft, updateDraft } = useCreateHuntStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
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
          <p className="mt-1 text-xs text-status-error">Minimum 3 caractères</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
          Description *
        </label>
        <textarea
          placeholder="Décrivez votre chasse au trésor en quelques phrases..."
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          rows={4}
          className={cn(
            "flex w-full rounded-xl border bg-background-surface-alt px-4 py-3 text-sm text-text-heading transition-all duration-300",
            "resize-none placeholder:text-text-muted",
            "focus-visible:border-primary/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20",
            draft.description.length > 0 && draft.description.length < 20
              ? "border-status-error/50"
              : "border-black/[0.06] hover:border-black/[0.08]"
          )}
        />
        <div className="mt-1 flex justify-between text-xs">
          {draft.description.length > 0 && draft.description.length < 20 ? (
            <p className="text-status-error">Minimum 20 caractères</p>
          ) : (
            <span />
          )}
          <span className="text-text-muted">
            {draft.description.length} / 1000
          </span>
        </div>
      </div>

      {/* Theme selection */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
          Thème
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {huntThemes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => updateDraft({ theme: theme.value })}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-left transition-all duration-300",
                draft.theme === theme.value
                  ? "border-primary/30 bg-primary/[0.06] shadow-glow-sm"
                  : "border-black/[0.06] hover:border-black/[0.08]"
              )}
            >
              <span className="text-lg">{theme.icon}</span>
              <span className="text-sm font-medium text-text-heading">
                {theme.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
          Difficulté *
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {difficultyOptions.map((option) => {
            const isSelected = draft.difficulty === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateDraft({ difficulty: option.value })}
                className={cn(
                  "relative overflow-hidden rounded-xl border p-3 text-center transition-all duration-300",
                  isSelected
                    ? "border-primary/30 bg-primary/[0.06] shadow-glow-sm"
                    : "border-black/[0.06] hover:border-black/[0.08]"
                )}
              >
                <div className="relative">
                  <p className="font-heading text-sm font-bold text-text-heading">
                    {option.label}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-text-muted">
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
          <label className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            Durée *
          </label>
          <Input
            type="time"
            value={draft.duration}
            onChange={(e) => updateDraft({ duration: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-text-muted">
            <Trophy className="h-3.5 w-3.5" />
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
          <label className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-text-muted">
            <Users className="h-3.5 w-3.5" />
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
