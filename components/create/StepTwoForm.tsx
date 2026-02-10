"use client";

import { useCreateHuntStore } from "@/lib/stores";
import { Input, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { MapPin, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { HuntStepFormData } from "@/lib/validations";

interface StepTwoFormProps {
  onBack: () => void;
  onSubmit: () => void;
  expandedStepId: string | null;
  setExpandedStepId: (id: string | null) => void;
}

interface StepEditorProps {
  step: HuntStepFormData;
  onUpdate: (data: Partial<HuntStepFormData>) => void;
  onDelete: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function StepEditor({
  step,
  onUpdate,
  onDelete,
  isExpanded,
  onToggle,
}: StepEditorProps) {
  return (
    <Card
      variant="default"
      className={cn(
        "overflow-hidden border transition-all duration-300",
        isExpanded ? "border-primary/30 shadow-glow-sm" : "border-black/[0.06]"
      )}
    >
      <div
        className="flex cursor-pointer items-center gap-3 p-4"
        onClick={onToggle}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-gold-600 text-sm font-bold text-primary-foreground">
          {step.order}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading font-bold text-text-heading">
            {step.title || `Étape ${step.order}`}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-2 text-text-muted hover:bg-status-error/10 hover:text-status-error"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-black/[0.06] p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
                Titre de l&apos;étape
              </label>
              <Input
                type="text"
                placeholder="Ex: Le point de départ"
                value={step.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
                Description / Indice
              </label>
              <textarea
                placeholder="Instructions pour cette étape..."
                value={step.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-black/[0.06] bg-background-surface-alt p-3 text-sm text-text-heading placeholder:text-text-muted focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-text-muted">
                Rayon de validation (en mètres)
              </label>
              <Input
                type="number"
                min={5}
                max={100}
                value={step.radius}
                onChange={(e) =>
                  onUpdate({ radius: parseInt(e.target.value) || 20 })
                }
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function StepTwoForm({
  onBack,
  onSubmit,
  expandedStepId,
  setExpandedStepId,
}: StepTwoFormProps) {
  const { draft, updateStep, removeStep } = useCreateHuntStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.steps.length < 2) return;
    onSubmit();
  };

  const isFormValid = draft.steps.length >= 2;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {draft.steps.length > 0 ? (
        <div className="space-y-3">
          {draft.steps.map((step) => (
            <StepEditor
              key={step.id}
              step={step}
              onUpdate={(data) => updateStep(step.id, data)}
              onDelete={() => removeStep(step.id)}
              isExpanded={expandedStepId === step.id}
              onToggle={() =>
                setExpandedStepId(expandedStepId === step.id ? null : step.id)
              }
            />
          ))}
        </div>
      ) : (
        <Card
          variant="default"
          className="border-2 border-dashed border-black/[0.06] p-8 text-center"
        >
          <MapPin className="mx-auto mb-3 h-12 w-12 text-text-muted" />
          <p className="font-bold text-text-heading">Aucune étape ajoutée</p>
          <p className="mt-1 text-sm text-text-muted">
            Cliquez sur la carte pour ajouter la première étape.
          </p>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

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
