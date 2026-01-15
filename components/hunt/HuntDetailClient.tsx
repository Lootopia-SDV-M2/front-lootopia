"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Users,
  Trophy,
  Shovel,
  Lock,
  Unlock,
  CheckCircle,
  Navigation,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { Alert, VictoryModal } from "@/components/shared";
import { useGeolocationStore, usePlayerStore } from "@/lib/stores";
import {
  getHuntById,
  getDifficultyLabel,
  calculateDistance,
} from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";
import type { Hunt, HuntStep, CompletedHunt } from "@/types";

interface HuntDetailClientProps {
  huntId: string;
}

export function HuntDetailClient({ huntId }: HuntDetailClientProps) {
  const router = useRouter();
  const hunt = getHuntById(huntId);
  const {
    position,
    requestGeolocation,
    isLoading: geoLoading,
  } = useGeolocationStore();
  const { completeHunt } = usePlayerStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [distance, setDistance] = useState<number | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [isDigging, setIsDigging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = hunt?.steps?.[currentStepIndex];
  const isWithinRange =
    distance !== null && distance < (currentStep?.radius || 20);
  const allStepsCompleted = hunt?.steps?.every((s) => completedSteps.has(s.id));

  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  useEffect(() => {
    if (position && currentStep) {
      const dist = calculateDistance(
        position.latitude,
        position.longitude,
        currentStep.latitude,
        currentStep.longitude
      );
      setDistance(Math.round(dist));
    }
  }, [position, currentStep]);

  if (!hunt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Alert variant="error" title="Chasse introuvable">
          Cette chasse au trésor n'existe pas ou a été supprimée.
        </Alert>
        <div className="mt-4">
          <Link href="/map">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" /> Retour à la carte
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDig = async () => {
    if (!currentStep || !isWithinRange) {
      setError("Vous êtes trop loin ! Approchez-vous pour valider l'étape.");
      return;
    }
    setIsDigging(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCompletedSteps((prev) => new Set([...prev, currentStep.id]));

    const isLastStep = currentStepIndex === (hunt.steps?.length || 0) - 1;
    if (isLastStep) {
      const completedHuntData: CompletedHunt = {
        huntId: hunt.id,
        huntTitle: hunt.title,
        completedAt: new Date().toISOString(),
        xpEarned: hunt.reward,
        duration: hunt.duration,
        difficulty: hunt.difficulty,
      };
      completeHunt(completedHuntData);
      setShowVictory(true);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
    setIsDigging(false);
  };

  const handleVictoryContinue = () => {
    setShowVictory(false);
    router.push("/profile");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/map">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-brand-light font-heading text-2xl font-bold">
            {hunt.title}
          </h1>
          <div className="mt-1 flex items-center gap-4">
            <Badge>{getDifficultyLabel(hunt.difficulty)}</Badge>
            <span className="text-brand-muted flex items-center gap-1.5 text-sm">
              <Clock size={14} />
              {hunt.duration}
            </span>
            <span className="text-brand-muted flex items-center gap-1.5 text-sm">
              <Users size={14} />
              {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
          </div>
        </div>
      </div>

      <Card variant="glass" className="mb-6 p-5">
        <p className="text-brand-muted mb-4">{hunt.description}</p>
        <div className="text-brand-primary flex items-center gap-2 font-heading font-bold">
          <Trophy size={16} />
          <span>{hunt.reward} XP</span>
        </div>
      </Card>

      <div className="mb-8">
        <h2 className="text-brand-light mb-3 font-heading text-lg font-bold">
          Progression
        </h2>
        <div className="flex w-full items-center gap-2">
          {hunt.steps?.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                completedSteps.has(step.id) || index < currentStepIndex
                  ? "bg-brand-primary"
                  : "bg-brand-surface"
              )}
            />
          ))}
        </div>
      </div>

      {currentStep && !allStepsCompleted && (
        <Card variant="default" className="mb-6 overflow-hidden">
          <div className="bg-brand-surface p-5">
            <h3 className="text-brand-light font-heading text-xl font-bold">
              Étape {currentStep.order}: {currentStep.title}
            </h3>
          </div>
          <div className="space-y-6 p-5">
            <p className="text-brand-muted">{currentStep.description}</p>

            <div className="bg-brand-surface flex items-center gap-4 rounded-xl p-4">
              <Navigation
                className={cn(
                  "h-8 w-8",
                  isWithinRange ? "text-brand-accent" : "text-brand-muted"
                )}
              />
              <div>
                <p className="text-brand-muted text-sm font-bold uppercase">
                  Distance
                </p>
                <p
                  className={cn(
                    "font-heading text-2xl font-bold",
                    isWithinRange ? "text-brand-accent" : "text-brand-light"
                  )}
                >
                  {distance !== null ? `${distance}m` : "Calcul..."}
                </p>
              </div>
              {isWithinRange && (
                <Badge variant="primary" className="ml-auto animate-pulse">
                  À Portée !
                </Badge>
              )}
            </div>

            <div>
              <h4 className="text-brand-muted mb-2 font-heading text-sm font-bold uppercase tracking-wider">
                Indices
              </h4>
              <div className="space-y-2">
                {currentStep.clues.map((clue) => (
                  <div
                    key={clue.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3",
                      clue.unlocked
                        ? "border-brand-primary/20 bg-brand-primary/10 text-brand-light"
                        : "bg-brand-dark/50 text-brand-muted border-border"
                    )}
                  >
                    {clue.unlocked ? (
                      <Unlock size={16} className="text-brand-primary" />
                    ) : (
                      <Lock size={16} />
                    )}
                    <span className="text-sm">
                      {clue.unlocked ? clue.text : "Indice verrouillé"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {error && <Alert variant="warning">{error}</Alert>}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleDig}
              disabled={!isWithinRange || isDigging || geoLoading}
              isLoading={isDigging}
            >
              {isDigging ? (
                "Fouille..."
              ) : (
                <>
                  <Shovel />
                  {currentStepIndex === (hunt.steps?.length || 0) - 1
                    ? "Creuser le Trésor"
                    : "Valider l'Étape"}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {allStepsCompleted && (
        <Card variant="glass" className="p-8 text-center">
          <CheckCircle className="text-brand-success mx-auto mb-4 h-16 w-16" />
          <h3 className="text-brand-light font-heading text-2xl font-bold">
            Chasse Terminée !
          </h3>
          <p className="text-brand-muted my-2">
            Félicitations, vous avez complété cette aventure !
          </p>
          <Link href="/profile">
            <Button variant="primary">Voir mon Profil</Button>
          </Link>
        </Card>
      )}

      <VictoryModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        huntTitle={hunt.title}
        xpEarned={hunt.reward}
        onContinue={handleVictoryContinue}
      />
    </div>
  );
}
