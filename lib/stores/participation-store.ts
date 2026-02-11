import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Hunt, Participation } from "@/types";

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface ParticipationState {
  participations: Participation[];
  activeParticipationId: string | null;

  joinHunt: (hunt: Hunt) => void;
  validateStep: (participationId: string) => boolean;
  abandonHunt: (participationId: string) => void;
  setActiveParticipation: (id: string | null) => void;
  getActiveParticipation: () => Participation | null;
  getParticipationByHuntId: (huntId: string) => Participation | undefined;
  getCompletedParticipations: () => Participation[];
  getInProgressParticipations: () => Participation[];
  getAbandonedParticipations: () => Participation[];
}

export const useParticipationStore = create<ParticipationState>()(
  persist(
    (set, get) => ({
      participations: [],
      activeParticipationId: null,

      joinHunt: (hunt: Hunt) => {
        const existing = get().participations.find(
          (p) => p.huntId === hunt.id && p.status === "EN_COURS"
        );
        if (existing) {
          set({ activeParticipationId: existing.id });
          return;
        }

        const participation: Participation = {
          id: `participation-${Date.now()}`,
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
      },

      validateStep: (participationId: string) => {
        const { participations } = get();
        const participation = participations.find(
          (p) => p.id === participationId
        );
        if (!participation || participation.status !== "EN_COURS") return false;

        const nextIndex = participation.currentStepIndex + 1;
        const isLastStep = nextIndex >= participation.steps.length;

        set((state) => ({
          participations: state.participations.map((p) =>
            p.id === participationId
              ? {
                  ...p,
                  currentStepIndex: isLastStep ? p.currentStepIndex : nextIndex,
                  status: isLastStep ? "TERMINE" : "EN_COURS",
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
      },

      abandonHunt: (participationId: string) => {
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
