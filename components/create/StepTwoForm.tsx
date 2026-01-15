"use client";

import { useCreateHuntStore } from "@/lib/stores";
import { Input, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { MapPin, Trash2, ChevronLeft, Check } from "lucide-react";
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
        "overflow-hidden border transition-all",
        isExpanded ? "border-brand-primary" : "border-border"
      )}
    >
      <div
        className="flex cursor-pointer items-center gap-3 p-4"
        onClick={onToggle}
      >
        <div className="bg-brand-primary text-brand-dark flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
          {step.order}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-brand-light truncate font-heading font-bold">
            {step.title || `Étape ${step.order}`}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-brand-muted hover:bg-brand-danger/10 hover:text-brand-danger rounded-lg p-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-4">
          <div className="space-y-4">
            <div>
              <label className="text-brand-light mb-2 block text-sm font-medium">
                Titre de l'étape
              </label>
              <Input
                type="text"
                placeholder="Ex: Le point de départ"
                value={step.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-brand-light mb-2 block text-sm font-medium">
                Description / Indice
              </label>
              <textarea
                placeholder="Instructions pour cette étape..."
                value={step.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={2}
                className="bg-brand-dark text-brand-light focus:ring-brand-accent w-full rounded-xl border-none p-3 text-sm focus:ring-2"
              />
            </div>

            <div>
              <label className="text-brand-light mb-2 block text-sm font-medium">
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
  const { draft, updateStep, removeStep, isSubmitting } = useCreateHuntStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.steps.length === 0) return;
    onSubmit();
  };

  const isFormValid = draft.steps.length >= 1;

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
          className="border-2 border-dashed border-border p-8 text-center"
        >
          <MapPin className="text-brand-muted mx-auto mb-3 h-12 w-12" />
          <p className="text-brand-light font-bold">Aucune étape ajoutée</p>
          <p className="text-brand-muted mt-1 text-sm">
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
