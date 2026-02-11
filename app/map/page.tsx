"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import DynamicMap from "@/components/map/DynamicMap";
import { HuntPopup } from "@/components/map/HuntPopup";
import { ActiveHuntPanel } from "@/components/map/ActiveHuntPanel";
import { VictoryModal } from "@/components/shared";
import {
  useAuthStore,
  useParticipationStore,
  usePlayerStore,
  useGeolocationStore,
} from "@/lib/stores";
import {
  huntApi,
  type HuntSummaryDTO,
  type HuntResponseDTO,
} from "@/lib/api/hunt-api";
import type { Hunt, HuntDifficulty, HuntStep } from "@/types";

function mapSummaryToHunt(dto: HuntSummaryDTO): Hunt {
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    difficulty: (dto.difficulty?.toLowerCase() as HuntDifficulty) || "medium",
    latitude: dto.latitude ?? 0,
    longitude: dto.longitude ?? 0,
    reward: dto.rewardsCount,
    duration: dto.duration,
    participantsCount: 0,
    maxParticipants: dto.maxParticipants,
    createdAt: dto.createdAt,
  };
}

function mapResponseToHunt(dto: HuntResponseDTO): Hunt {
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    difficulty: (dto.difficulty?.toLowerCase() as HuntDifficulty) || "medium",
    latitude: dto.steps?.[0]?.latitude ?? 0,
    longitude: dto.steps?.[0]?.longitude ?? 0,
    reward: dto.rewards?.length ?? 0,
    duration: dto.duration,
    participantsCount: 0,
    maxParticipants: dto.maxParticipants,
    createdAt: dto.createdAt,
    steps: dto.steps?.map(
      (s): HuntStep => ({
        id: String(s.id),
        order: s.orderIndex,
        title: s.title,
        description: s.description,
        latitude: s.latitude,
        longitude: s.longitude,
        radius: s.radius,
        completed: false,
        clues: [],
      })
    ),
    rewards: dto.rewards?.map((r) => ({
      id: String(r.id),
      name: r.name,
      imageUrl: r.imageUrl,
      winnerId: r.winnerId ? String(r.winnerId) : null,
    })),
  };
}

export default function MapPage() {
  const user = useAuthStore((s) => s.user);
  const isPartner = user?.role === "partner";
  const position = useGeolocationStore((s) => s.position);
  const [hunts, setHunts] = useState<Hunt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryData, setVictoryData] = useState({ title: "", xp: 0 });

  const {
    activeParticipationId,
    getActiveParticipation,
    joinHunt,
    validateStep,
    abandonHunt,
  } = useParticipationStore();
  const completeHunt = usePlayerStore((s) => s.completeHunt);

  const activeParticipation = getActiveParticipation();
  const mode =
    activeParticipation && activeParticipation.status === "EN_COURS"
      ? "participation"
      : "discovery";

  useEffect(() => {
    const fetchHunts = async () => {
      try {
        const data = isPartner
          ? await huntApi.getMyHunts()
          : await huntApi.getPublishedHunts();
        setHunts(data.map(mapSummaryToHunt));
      } catch {
        setHunts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHunts();
  }, [isPartner]);

  const handleHuntSelect = useCallback(async (hunt: Hunt) => {
    // Fetch full hunt details with steps
    try {
      const fullDto = await huntApi.getHuntById(Number(hunt.id));
      const fullHunt = mapResponseToHunt(fullDto);
      setSelectedHunt(fullHunt);
    } catch {
      // Fallback: use the summary data (may not have steps)
      setSelectedHunt(hunt);
    }
  }, []);

  const handleAcceptHunt = useCallback(
    async (hunt: Hunt) => {
      if (!hunt.steps || hunt.steps.length === 0) {
        alert("Cette chasse n'a pas d'etapes configurees.");
        return;
      }
      await joinHunt(hunt);
      setSelectedHunt(null);
    },
    [joinHunt]
  );

  const handleValidateStep = useCallback(async () => {
    if (!activeParticipation) return;
    const isCompleted = await validateStep(activeParticipation.id);
    if (isCompleted) {
      setVictoryData({
        title: activeParticipation.huntTitle,
        xp: activeParticipation.huntReward,
      });
      completeHunt({
        huntId: activeParticipation.huntId,
        huntTitle: activeParticipation.huntTitle,
        completedAt: new Date().toISOString(),
        xpEarned: activeParticipation.huntReward,
        duration: activeParticipation.huntDuration,
        difficulty: activeParticipation.huntDifficulty,
      });
      setShowVictory(true);
    }
  }, [activeParticipation, validateStep, completeHunt]);

  const handleAbandon = useCallback(async () => {
    if (!activeParticipation) return;
    await abandonHunt(activeParticipation.id);
  }, [activeParticipation, abandonHunt]);

  return (
    <div className="fixed inset-0 pb-16 pt-16 md:pb-0 md:pt-16">
      <div className="h-full w-full p-3">
        <DynamicMap
          className="shadow-2xl"
          hunts={loading ? undefined : hunts}
          isPartner={isPartner}
          mode={mode}
          activeParticipation={activeParticipation}
          onHuntSelect={handleHuntSelect}
        />
      </div>

      {/* Hunt detail popup (discovery mode) */}
      {selectedHunt && mode === "discovery" && (
        <HuntPopup
          hunt={selectedHunt}
          onAccept={handleAcceptHunt}
          onClose={() => setSelectedHunt(null)}
        />
      )}

      {/* Active hunt panel (participation mode) */}
      {mode === "participation" && activeParticipation && (
        <ActiveHuntPanel
          participation={activeParticipation}
          userPosition={position}
          onValidateStep={handleValidateStep}
          onAbandon={handleAbandon}
        />
      )}

      {/* Victory modal */}
      <VictoryModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
        huntTitle={victoryData.title}
        xpEarned={victoryData.xp}
        onContinue={() => setShowVictory(false)}
      />

      {/* Floating create button for partners */}
      {isPartner && mode === "discovery" && (
        <Link
          href="/create"
          className="absolute bottom-20 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-gradient-to-r from-primary via-gold-500 to-primary px-6 py-3 font-heading font-semibold text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-strong active:translate-y-0 md:bottom-6"
        >
          <Plus className="h-5 w-5" />
          Creer une chasse
        </Link>
      )}
    </div>
  );
}
