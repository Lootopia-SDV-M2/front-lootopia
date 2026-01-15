import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Player, CompletedHunt, PlayerLevel } from "@/types";
import { XP_PER_LEVEL } from "@/types";

// Dummy storage for SSR
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface PlayerState {
  player: Player | null;
  isLoading: boolean;

  // Actions
  initializePlayer: (username: string, email: string) => void;
  addXp: (amount: number) => void;
  completeHunt: (hunt: CompletedHunt) => void;
  updateAvatar: (avatarUrl: string) => void;
  getXpProgress: () => {
    current: number;
    required: number;
    percentage: number;
  };
  getNextLevelXp: () => number;
}

/**
 * Calculate level from total XP
 */
function calculateLevel(totalXp: number): PlayerLevel {
  const levels: PlayerLevel[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  for (const level of levels) {
    if (totalXp >= XP_PER_LEVEL[level]) {
      return level;
    }
  }
  return 1;
}

/**
 * Player store for managing user profile and progression.
 * Persisted to localStorage.
 */
export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      player: null,
      isLoading: false,

      initializePlayer: (username, email) => {
        const existingPlayer = get().player;
        if (existingPlayer) return;

        set({
          player: {
            id: `player-${Date.now()}`,
            username,
            email,
            level: 1,
            currentXp: 0,
            totalXp: 0,
            huntsCompleted: 0,
            huntsInProgress: 0,
            completedHunts: [],
            createdAt: new Date().toISOString(),
          },
        });
      },

      addXp: (amount) => {
        const { player } = get();
        if (!player) return;

        const newTotalXp = player.totalXp + amount;
        const newLevel = calculateLevel(newTotalXp);
        const currentLevelXp = XP_PER_LEVEL[newLevel];
        const nextLevelXp =
          newLevel < 10
            ? XP_PER_LEVEL[(newLevel + 1) as PlayerLevel]
            : XP_PER_LEVEL[10];
        const currentXp = newTotalXp - currentLevelXp;

        set({
          player: {
            ...player,
            totalXp: newTotalXp,
            currentXp,
            level: newLevel,
          },
        });
      },

      completeHunt: (hunt) => {
        const { player, addXp } = get();
        if (!player) return;

        // Add the completed hunt to history
        set({
          player: {
            ...player,
            huntsCompleted: player.huntsCompleted + 1,
            completedHunts: [hunt, ...player.completedHunts].slice(0, 50), // Keep last 50
          },
        });

        // Add XP
        addXp(hunt.xpEarned);
      },

      updateAvatar: (avatarUrl) => {
        const { player } = get();
        if (!player) return;

        set({
          player: {
            ...player,
            avatarUrl,
          },
        });
      },

      getXpProgress: () => {
        const { player } = get();
        if (!player) return { current: 0, required: 100, percentage: 0 };

        const currentLevelXp = XP_PER_LEVEL[player.level];
        const nextLevelXp =
          player.level < 10
            ? XP_PER_LEVEL[(player.level + 1) as PlayerLevel]
            : XP_PER_LEVEL[10];

        const required = nextLevelXp - currentLevelXp;
        const current = player.totalXp - currentLevelXp;
        const percentage = Math.min(
          100,
          Math.round((current / required) * 100)
        );

        return { current, required, percentage };
      },

      getNextLevelXp: () => {
        const { player } = get();
        if (!player || player.level >= 10) return 0;

        const nextLevelXp = XP_PER_LEVEL[(player.level + 1) as PlayerLevel];
        return nextLevelXp - player.totalXp;
      },
    }),
    {
      name: "lootopia-player",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : dummyStorage
      ),
    }
  )
);
