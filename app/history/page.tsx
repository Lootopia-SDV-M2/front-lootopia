"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { History, Trophy, Play, Ban, Map } from "lucide-react";
import { PageContainer, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui";
import { useParticipationStore, usePlayerStore } from "@/lib/stores";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/data/mock-hunts";
import type { Participation } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tab = "completed" | "in_progress" | "abandoned";

function ParticipationCard({
  participation,
  onResume,
}: {
  participation: Participation;
  onResume?: () => void;
}) {
  const statusLabels = {
    TERMINE: "Terminee",
    EN_COURS: "En cours",
    ABANDONNE: "Abandonnee",
  };

  const statusColors = {
    TERMINE:
      "text-status-success bg-status-success/10 border-status-success/20",
    EN_COURS: "text-primary bg-primary/10 border-primary/20",
    ABANDONNE: "text-status-error bg-status-error/10 border-status-error/20",
  };

  return (
    <div className="rounded-2xl border border-black/[0.06] bg-background-surface/60 p-4 transition-all duration-300 hover:border-primary/15">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-sm font-semibold text-text-heading">
            {participation.huntTitle}
          </h3>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full bg-gradient-to-r px-2 py-0.5 text-xs font-medium text-white ${getDifficultyColor(participation.huntDifficulty)}`}
            >
              {getDifficultyLabel(participation.huntDifficulty)}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium",
                statusColors[participation.status]
              )}
            >
              {statusLabels[participation.status]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{participation.huntDuration}</span>
            <span>{participation.huntReward} XP</span>
            <span>
              {new Date(participation.startedAt).toLocaleDateString("fr-FR")}
            </span>
          </div>

          {participation.status === "EN_COURS" && (
            <p className="mt-1 text-xs text-text-muted">
              Etape {participation.currentStepIndex + 1}/
              {participation.steps.length}
            </p>
          )}
        </div>

        {participation.status === "EN_COURS" && onResume && (
          <Button variant="primary" size="sm" onClick={onResume}>
            <Play className="h-3 w-3" />
            Reprendre
          </Button>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("completed");
  const router = useRouter();
  const {
    getCompletedParticipations,
    getInProgressParticipations,
    getAbandonedParticipations,
    setActiveParticipation,
  } = useParticipationStore();

  const completedParticipations = getCompletedParticipations();
  const inProgressParticipations = getInProgressParticipations();
  const abandonedParticipations = getAbandonedParticipations();

  const tabs: { id: Tab; label: string; count: number }[] = [
    {
      id: "completed",
      label: "Terminees",
      count: completedParticipations.length,
    },
    {
      id: "in_progress",
      label: "En cours",
      count: inProgressParticipations.length,
    },
    {
      id: "abandoned",
      label: "Abandonnees",
      count: abandonedParticipations.length,
    },
  ];

  const currentParticipations =
    activeTab === "completed"
      ? completedParticipations
      : activeTab === "in_progress"
        ? inProgressParticipations
        : abandonedParticipations;

  const handleResume = (participation: Participation) => {
    setActiveParticipation(participation.id);
    router.push("/map");
  };

  return (
    <div className="min-h-screen pb-20 pt-20 md:pb-8">
      <PageContainer
        title="Historique des Chasses"
        subtitle="Toutes vos aventures passees et en cours"
      >
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-black/[0.06] bg-black/[0.02] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-background text-text-heading shadow-sm"
                  : "text-text-muted hover:text-text-body"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {currentParticipations.length > 0 ? (
          <div className="flex flex-col gap-3">
            {currentParticipations.map((p) => (
              <ParticipationCard
                key={p.id}
                participation={p}
                onResume={
                  p.status === "EN_COURS" ? () => handleResume(p) : undefined
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              activeTab === "completed" ? (
                <Trophy className="h-8 w-8 text-text-muted" />
              ) : activeTab === "in_progress" ? (
                <History className="h-8 w-8 text-text-muted" />
              ) : (
                <Ban className="h-8 w-8 text-text-muted" />
              )
            }
            title={
              activeTab === "completed"
                ? "Aucune chasse terminee"
                : activeTab === "in_progress"
                  ? "Aucune chasse en cours"
                  : "Aucune chasse abandonnee"
            }
            description={
              activeTab === "completed"
                ? "Completez votre premiere chasse pour la voir ici !"
                : activeTab === "in_progress"
                  ? "Lancez-vous dans une nouvelle aventure !"
                  : "Vous n'avez abandonne aucune chasse."
            }
            action={
              activeTab !== "abandoned" ? (
                <Link href="/map">
                  <Button variant="primary" size="md">
                    <Map className="h-4 w-4" />
                    Explorer la carte
                  </Button>
                </Link>
              ) : undefined
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
