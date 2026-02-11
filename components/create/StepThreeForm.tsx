"use client";

import { useCreateHuntStore } from "@/lib/stores";
import { Button, Card } from "@/components/ui";
import {
  Gift,
  Upload,
  Trash2,
  ImagePlus,
  Plus,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useRef } from "react";
import type { RewardDraft } from "@/lib/stores/create-hunt-store";

interface StepThreeFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

function RewardCard({
  reward,
  index,
  onUpdate,
  onDelete,
}: {
  reward: RewardDraft;
  index: number;
  onUpdate: (data: Partial<RewardDraft>) => void;
  onDelete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onUpdate({ imageFile: file, imagePreview: preview });
    }
  };

  return (
    <Card variant="default" className="border border-black/[0.06] p-4">
      <div className="flex items-start gap-4">
        {/* Image upload area */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-black/[0.06] bg-background-surface-alt transition-all hover:border-primary/20 hover:bg-primary/[0.04]"
        >
          {reward.imagePreview ? (
            <img
              src={reward.imagePreview}
              alt={reward.name || `Cadeau ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-text-muted transition-colors group-hover:text-primary" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </button>

        {/* Name input and delete */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 flex-shrink-0 text-text-muted" />
            <span className="text-xs font-medium tracking-wider text-text-muted">
              Cadeau {index + 1}
            </span>
          </div>
          <input
            type="text"
            placeholder="Nom du cadeau..."
            value={reward.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full rounded-xl border border-black/[0.06] bg-background-surface-alt px-3 py-2 text-sm text-text-heading placeholder:text-text-muted focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={onDelete}
          className="flex-shrink-0 rounded-lg p-2 text-text-muted transition-colors hover:bg-status-error/10 hover:text-status-error"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

export function StepThreeForm({ onBack, onSubmit }: StepThreeFormProps) {
  const { draft, addReward, removeReward, updateReward, isSubmitting, error } =
    useCreateHuntStore();

  const requiredCount = draft.maxParticipants;
  const currentCount = draft.rewards.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCount !== requiredCount) return;
    const allNamed = draft.rewards.every((r) => r.name.trim().length >= 2);
    if (!allNamed) return;
    onSubmit();
  };

  const isFormValid =
    currentCount === requiredCount &&
    draft.rewards.every((r) => r.name.trim().length >= 2);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with counter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-text-heading">
            Cadeaux de la chasse
          </h3>
          <p className="text-sm text-text-muted">
            Ajoutez un cadeau pour chaque participant
          </p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-background-surface-alt px-4 py-2 text-sm font-medium">
          <span
            className={
              currentCount === requiredCount
                ? "text-status-success"
                : "text-primary"
            }
          >
            {currentCount}
          </span>
          <span className="text-text-muted"> cadeaux sur </span>
          <span className="text-text-heading">{requiredCount}</span>
          <span className="text-text-muted"> requis</span>
        </div>
      </div>

      {/* Rewards list */}
      {draft.rewards.length > 0 ? (
        <div className="space-y-3">
          {draft.rewards.map((reward, index) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              index={index}
              onUpdate={(data) => updateReward(reward.id, data)}
              onDelete={() => removeReward(reward.id)}
            />
          ))}
        </div>
      ) : (
        <Card
          variant="default"
          className="border-2 border-dashed border-black/[0.06] p-8 text-center"
        >
          <Gift className="mx-auto mb-3 h-12 w-12 text-text-muted" />
          <p className="font-bold text-text-heading">Aucun cadeau ajouté</p>
          <p className="mt-1 text-sm text-text-muted">
            Ajoutez {requiredCount} cadeau{requiredCount > 1 ? "x" : ""} pour
            vos participants.
          </p>
        </Card>
      )}

      {/* Add reward button */}
      {currentCount < requiredCount && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={addReward}
        >
          <Plus className="h-4 w-4" />
          Ajouter un cadeau
        </Button>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-status-error/20 bg-status-error/[0.06] px-4 py-3 text-sm text-status-error">
          {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          isLoading={isSubmitting}
        >
          <Check className="h-4 w-4" />
          Créer la chasse
        </Button>
      </div>
    </form>
  );
}
