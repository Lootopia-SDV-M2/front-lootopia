"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Check,
  MapPin,
  FileText,
  Gift,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { StepOneForm, StepTwoForm, StepThreeForm } from "@/components/create";
import { useCreateHuntStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

const CreatorMap = dynamic(
  () => import("@/components/create/CreatorMap").then((mod) => mod.CreatorMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-80 animate-pulse rounded-xl bg-background-surface" />
    ),
  }
);

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Infos", icon: FileText },
    { number: 2, label: "Parcours", icon: MapPin },
    { number: 3, label: "Cadeaux", icon: Gift },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-500",
                    isCompleted
                      ? "border-status-success/30 bg-status-success/10 text-status-success"
                      : isCurrent
                        ? "border-primary/30 bg-primary/[0.06] text-primary shadow-glow-sm"
                        : "border-black/[0.06] text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium tracking-wider",
                    isCurrent ? "text-text-heading" : "text-text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-0.5 w-12 rounded-full transition-all duration-500",
                    isCompleted ? "bg-status-success/40" : "bg-black/[0.03]"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-status-success/10 shadow-[0_0_30px_rgba(52,211,153,0.15)]">
        <Sparkles className="h-10 w-10 text-status-success" />
      </div>
      <h2 className="font-heading text-3xl font-bold text-text-heading">
        Chasse Créée !
      </h2>
      <p className="mt-3 text-text-muted">
        Votre chasse au trésor est maintenant disponible pour les joueurs.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => router.push("/map")}
        >
          Voir sur la carte
        </Button>
        <Button variant="secondary" className="w-full" onClick={onReset}>
          Créer une autre chasse
        </Button>
      </div>
    </div>
  );
}

export default function CreateHuntPage() {
  const {
    currentStep,
    draft,
    isSuccess,
    nextStep,
    prevStep,
    addStep,
    resetForm,
    submitHunt,
  } = useCreateHuntStore();

  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const handleAddMapPoint = (lat: number, lng: number) => {
    const newStepId = `step-${Date.now()}`;
    addStep({
      id: newStepId,
      title: `Étape ${draft.steps.length + 1}`,
      description: "",
      latitude: lat,
      longitude: lng,
      radius: 20,
    });
    setExpandedStepId(newStepId);
  };

  const handleSubmit = async () => {
    await submitHunt();
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <SuccessScreen onReset={resetForm} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/map">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-heading">
            Créer une Chasse
          </h1>
          <p className="text-sm text-text-muted">Espace Partenaire</p>
        </div>
      </div>

      <Card variant="glass" className="mb-8 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/15 bg-secondary/[0.06]">
            <Rocket className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-text-heading">
              Mode Partenaire
            </p>
            <p className="text-xs text-text-muted">
              Interface simplifiée pour la création de parcours
            </p>
          </div>
        </div>
      </Card>

      <StepIndicator currentStep={currentStep} />

      <Card variant="default" className="p-6 md:p-8">
        {currentStep === 1 && <StepOneForm onNext={nextStep} />}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="mb-3 block font-heading text-lg font-bold text-text-heading">
                Placez vos étapes
              </label>
              <CreatorMap
                points={draft.steps.map((s) => ({
                  id: s.id,
                  latitude: s.latitude,
                  longitude: s.longitude,
                  order: s.order,
                }))}
                onAddPoint={handleAddMapPoint}
                onSelectPoint={setExpandedStepId}
                selectedPointId={expandedStepId}
                className="h-80"
              />
            </div>

            <StepTwoForm
              onBack={prevStep}
              onSubmit={nextStep}
              expandedStepId={expandedStepId}
              setExpandedStepId={setExpandedStepId}
            />
          </div>
        )}

        {currentStep === 3 && (
          <StepThreeForm onBack={prevStep} onSubmit={handleSubmit} />
        )}
      </Card>

      <p className="mt-6 text-center text-sm text-text-muted">
        Besoin d&apos;aide ?{" "}
        <a
          href="#"
          className="text-primary/70 hover:text-primary hover:underline"
        >
          Consultez notre guide
        </a>
      </p>
    </div>
  );
}
