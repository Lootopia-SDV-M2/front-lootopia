import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Hunt, Participation, HuntStep, HuntDifficulty } from "@/types";
import {
  participationApi,
  type ParticipationDTO,
} from "@/lib/api/participation-api";

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function mapDtoToParticipation(dto: ParticipationDTO): Participation {
  return {
    id: String(dto.id),
    huntId: String(dto.huntId),
    huntTitle: dto.huntTitle,
    huntDifficulty:
      (dto.huntDifficulty?.toLowerCase() as HuntDifficulty) || "medium",
    huntDuration: dto.huntDuration,
    huntReward: dto.huntReward,
    creatorName: dto.creatorName,
    currentStepIndex: dto.currentStepIndex,
    status: dto.status as Participation["status"],
    startedAt: dto.startedAt,
    completedAt: dto.completedAt ?? undefined,
    steps: dto.steps.map(
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

interface ParticipationState {
  participations: Participation[];
  activeParticipationId: string | null;

  joinHunt: (hunt: Hunt) => Promise<void>;
  validateStep: (participationId: string) => Promise<boolean>;
  abandonHunt: (participationId: string) => Promise<void>;
  setActiveParticipation: (id: string | null) => void;
  getActiveParticipation: () => Participation | null;
  getParticipationByHuntId: (huntId: string) => Participation | undefined;
  getCompletedParticipations: () => Participation[];
  getInProgressParticipations: () => Participation[];
  getAbandonedParticipations: () => Participation[];
  fetchMyParticipations: () => Promise<void>;
}

export const useParticipationStore = create<ParticipationState>()(
  persist(
    (set, get) => ({
      participations: [],
      activeParticipationId: null,

      joinHunt: async (hunt: Hunt) => {
        // Check local state first
        const existing = get().participations.find(
          (p) => p.huntId === hunt.id && p.status === "EN_COURS"
        );
        if (existing) {
          set({ activeParticipationId: existing.id });
          return;
        }

        try {
          const dto = await participationApi.joinHunt(hunt.id);
          const participation = mapDtoToParticipation(dto);

          set((state) => ({
            participations: [participation, ...state.participations],
            activeParticipationId: participation.id,
          }));
        } catch {
          // Fallback to local-only participation if backend is unreachable
          const participation: Participation = {
            id: `local-${Date.now()}`,
            huntId: hunt.id,
            huntTitle: hunt.title,
            huntDifficulty: hunt.difficulty,
            huntDuration: hunt.duration,
            huntReward: hunt.reward,
            creatorName: "",
            currentStepIndex: 0,
            status: "EN_COURS",
            startedAt: new Date().toISOString(),
            steps: hunt.steps ?? [],
            rewards: hunt.rewards,
          };

          set((state) => ({
            participations: [participation, ...state.participations],
            activeParticipationId: participation.id,
          }));
        }
      },

      validateStep: async (participationId: string) => {
        const { participations } = get();
        const participation = participations.find(
          (p) => p.id === participationId
        );
        if (!participation || participation.status !== "EN_COURS") return false;

        const nextIndex = participation.currentStepIndex + 1;
        const isLastStep = nextIndex >= participation.steps.length;

        try {
          const dto = await participationApi.validateStep(participationId);
          const updated = mapDtoToParticipation(dto);

          set((state) => ({
            participations: state.participations.map((p) =>
              p.id === participationId ? updated : p
            ),
            activeParticipationId:
              updated.status === "TERMINE" ? null : state.activeParticipationId,
          }));

          return updated.status === "TERMINE";
        } catch {
          // Fallback to local update
          set((state) => ({
            participations: state.participations.map((p) =>
              p.id === participationId
                ? {
                    ...p,
                    currentStepIndex: isLastStep
                      ? p.currentStepIndex
                      : nextIndex,
                    status: isLastStep
                      ? ("TERMINE" as const)
                      : ("EN_COURS" as const),
                    completedAt: isLastStep
                      ? new Date().toISOString()
                      : undefined,
                  }
                : p
            ),
            activeParticipationId: isLastStep
              ? null
              : state.activeParticipationId,
          }));

          return isLastStep;
        }
      },

      abandonHunt: async (participationId: string) => {
        try {
          await participationApi.abandonHunt(participationId);
        } catch {
          // Continue with local update even if backend fails
        }

        set((state) => ({
          participations: state.participations.map((p) =>
            p.id === participationId
              ? { ...p, status: "ABANDONNE" as const }
              : p
          ),
          activeParticipationId:
            state.activeParticipationId === participationId
              ? null
              : state.activeParticipationId,
        }));
      },

      setActiveParticipation: (id: string | null) => {
        set({ activeParticipationId: id });
      },

      getActiveParticipation: () => {
        const { participations, activeParticipationId } = get();
        if (!activeParticipationId) return null;
        return (
          participations.find(
            (p) => p.id === activeParticipationId && p.status === "EN_COURS"
          ) ?? null
        );
      },

      getParticipationByHuntId: (huntId: string) => {
        return get().participations.find((p) => p.huntId === huntId);
      },

      getCompletedParticipations: () => {
        return get().participations.filter((p) => p.status === "TERMINE");
      },

      getInProgressParticipations: () => {
        return get().participations.filter((p) => p.status === "EN_COURS");
      },

      getAbandonedParticipations: () => {
        return get().participations.filter((p) => p.status === "ABANDONNE");
      },

      fetchMyParticipations: async () => {
        try {
          const dtos = await participationApi.getMyParticipations();
          const participations = dtos.map(mapDtoToParticipation);
          set({ participations });
        } catch {
          // Keep existing local state if API fails
        }
      },
    }),
    {
      name: "lootopia-participations",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        participations: state.participations,
        activeParticipationId: state.activeParticipationId,
      }),
    }
  )
);
