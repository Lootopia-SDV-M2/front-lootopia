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
import { huntApi, type HuntResponseDTO } from "@/lib/api/hunt-api";
import {
  DEMO_USER_POSITION_HUNT_ID,
  createDemoUserPositionHunt,
  getHuntById,
  getDifficultyLabel,
  calculateDistance,
} from "@/lib/data/mock-hunts";
import { cn } from "@/lib/utils";
import type { Hunt, HuntStep, CompletedHunt, HuntDifficulty } from "@/types";

function mapResponseToHunt(dto: HuntResponseDTO): Hunt {
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    difficulty: (dto.difficulty?.toLowerCase() as HuntDifficulty) || "medium",
    latitude: 0,
    longitude: 0,
    reward: dto.rewards?.length ?? 0,
    duration: dto.duration,
    participantsCount: 0,
    maxParticipants: dto.maxParticipants,
    createdAt: dto.createdAt,
    steps: dto.steps.map((s) => ({
      id: String(s.id),
      order: s.orderIndex,
      title: s.title,
      description: s.description,
      latitude: s.latitude,
      longitude: s.longitude,
      radius: s.radius,
      completed: false,
      clues: [],
    })),
    rewards: dto.rewards.map((r) => ({
      id: String(r.id),
      name: r.name,
      imageUrl: r.imageUrl,
      winnerId: r.winnerId ? String(r.winnerId) : null,
    })),
  };
}

interface HuntDetailClientProps {
  huntId: string;
}

export function HuntDetailClient({ huntId }: HuntDetailClientProps) {
  const router = useRouter();
  const [hunt, setHunt] = useState<Hunt | null>(() =>
    huntId === DEMO_USER_POSITION_HUNT_ID
      ? createDemoUserPositionHunt()
      : (getHuntById(huntId) ?? null)
  );
  const [loading, setLoading] = useState(
    huntId !== DEMO_USER_POSITION_HUNT_ID && !getHuntById(huntId)
  );
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
    if (huntId === DEMO_USER_POSITION_HUNT_ID) {
      setLoading(false);
      return;
    }

    if (!hunt) {
      const numId = parseInt(huntId, 10);
      if (!isNaN(numId)) {
        huntApi
          .getHuntById(numId)
          .then((dto) => {
            setHunt(mapResponseToHunt(dto));
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [hunt, huntId]);

  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  useEffect(() => {
    if (huntId === DEMO_USER_POSITION_HUNT_ID && position) {
      setHunt(
        createDemoUserPositionHunt(position.latitude, position.longitude)
      );
    }
  }, [huntId, position]);

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

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-text-muted">Chargement de la chasse...</p>
        </div>
      </div>
    );
  }

  if (!hunt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Alert variant="error" title="Chasse introuvable">
          Cette chasse au trésor n&apos;existe pas ou a été supprimée.
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
          <h1 className="font-heading text-2xl font-bold text-text-heading">
            {hunt.title}
          </h1>
          <div className="mt-1 flex items-center gap-4">
            <Badge>{getDifficultyLabel(hunt.difficulty)}</Badge>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Clock size={14} />
              {hunt.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Users size={14} />
              {hunt.participantsCount}/{hunt.maxParticipants}
            </span>
          </div>
        </div>
      </div>

      <Card variant="glass" className="mb-6 p-5">
        <p className="mb-4 text-text-body">{hunt.description}</p>
        <div className="flex items-center gap-2 font-heading font-bold text-primary">
          <Trophy size={16} />
          <span>{hunt.reward} XP</span>
        </div>
      </Card>

      <div className="mb-8">
        <h2 className="mb-3 font-heading text-lg font-bold text-text-heading">
          Progression
        </h2>
        <div className="flex w-full items-center gap-2">
          {hunt.steps?.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-2 flex-1 rounded-full transition-all duration-500",
                completedSteps.has(step.id) || index < currentStepIndex
                  ? "bg-gradient-to-r from-primary to-gold-600"
                  : "bg-background-surface-alt"
              )}
            />
          ))}
        </div>
      </div>

      {currentStep && !allStepsCompleted && (
        <Card variant="default" className="mb-6 overflow-hidden">
          <div className="border-b border-black/[0.06] bg-background-surface-alt p-5">
            <h3 className="font-heading text-xl font-bold text-text-heading">
              Étape {currentStep.order}: {currentStep.title}
            </h3>
          </div>
          <div className="space-y-6 p-5">
            <p className="text-text-body">{currentStep.description}</p>

            <div className="flex items-center gap-4 rounded-xl border border-black/[0.06] bg-background-surface-alt p-4">
              <Navigation
                className={cn(
                  "h-8 w-8",
                  isWithinRange ? "text-primary" : "text-text-muted"
                )}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Distance
                </p>
                <p
                  className={cn(
                    "font-heading text-2xl font-bold",
                    isWithinRange ? "text-primary" : "text-text-heading"
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
              <h4 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-text-muted">
                Indices
              </h4>
              <div className="space-y-2">
                {currentStep.clues.map((clue) => (
                  <div
                    key={clue.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3",
                      clue.unlocked
                        ? "border-primary/20 bg-primary/[0.06] text-text-heading"
                        : "border-black/[0.06] bg-background-surface-alt text-text-muted"
                    )}
                  >
                    {clue.unlocked ? (
                      <Unlock size={16} className="text-primary" />
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
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-status-success" />
          <h3 className="font-heading text-2xl font-bold text-text-heading">
            Chasse Terminée !
          </h3>
          <p className="my-2 text-text-muted">
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
