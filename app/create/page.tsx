"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Check,
  MapPin,
  FileText,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { StepOneForm, StepTwoForm } from "@/components/create";
import { useCreateHuntStore } from "@/lib/stores";
import { cn } from "@/lib/utils";

// Dynamic import for CreatorMap (Leaflet requires client-side only)
const CreatorMap = dynamic(
  () => import("@/components/create/CreatorMap").then((mod) => mod.CreatorMap),
  {
    ssr: false,
    loading: () => (
      <div className="bg-brand-surface h-80 animate-pulse rounded-2xl" />
    ),
  }
);

/**
 * Step indicator component
 */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "Informations", icon: FileText },
    { number: 2, label: "Parcours", icon: MapPin },
  ];

  return (
    <div className="mb-12">
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
                    "flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                    isCompleted
                      ? "border-brand-success bg-brand-success/10 text-brand-success"
                      : isCurrent
                        ? "border-brand-primary text-brand-primary shadow-glow-primary"
                        : "text-brand-muted border-border"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-7 w-7" />
                  ) : (
                    <Icon className="h-7 w-7" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 font-heading text-sm font-bold uppercase tracking-wider",
                    isCurrent ? "text-brand-light" : "text-brand-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-1 w-16 rounded-full transition-all",
                    isCompleted ? "bg-brand-success" : "bg-border"
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

/**
 * Success screen shown after hunt creation
 */
function SuccessScreen({ onReset }: { onReset: () => void }) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="bg-brand-success mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-lg">
        <Sparkles className="h-12 w-12 text-white" />
      </div>
      <h2 className="text-brand-light font-heading text-3xl font-bold">
        Chasse Créée !
      </h2>
      <p className="text-brand-muted mt-3">
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
          <h1 className="text-brand-light font-heading text-2xl font-bold">
            Créer une Chasse
          </h1>
          <p className="text-brand-muted text-sm">Espace Partenaire</p>
        </div>
      </div>

      <Card variant="glass" className="mb-8 p-4">
        <div className="flex items-center gap-4">
          <div className="bg-brand-accent/10 text-brand-accent flex h-12 w-12 items-center justify-center rounded-lg">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <p className="text-brand-light font-heading font-bold">
              Mode Partenaire
            </p>
            <p className="text-brand-muted text-sm">
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
              <label className="text-brand-light mb-3 block font-heading text-lg font-bold">
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
              onSubmit={handleSubmit}
              expandedStepId={expandedStepId}
              setExpandedStepId={setExpandedStepId}
            />
          </div>
        )}
      </Card>

      <p className="text-brand-muted mt-6 text-center text-sm">
        Besoin d&apos;aide ?{" "}
        <a href="#" className="text-brand-accent hover:underline">
          Consultez notre guide
        </a>
      </p>
    </div>
  );
}
