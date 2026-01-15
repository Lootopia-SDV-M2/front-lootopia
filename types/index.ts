// Global TypeScript types for the application

import type { ReactNode } from "react";

export type NavigationTab = "home" | "map" | "profile";

export interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Geolocation types
export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

// Hunt types
export type HuntDifficulty = "easy" | "medium" | "hard" | "expert";

export interface HuntClue {
  id: string;
  order: number;
  text: string;
  unlocked: boolean;
}

export interface HuntStep {
  id: string;
  order: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number; // meters required to validate
  completed: boolean;
  clues: HuntClue[];
}

export interface Hunt {
  id: string;
  title: string;
  description: string;
  difficulty: HuntDifficulty;
  latitude: number;
  longitude: number;
  reward: number;
  duration: string;
  distance?: number;
  participantsCount: number;
  maxParticipants: number;
  createdAt: string;
  startsAt?: string;
  imageUrl?: string;
  steps?: HuntStep[];
}

export interface HuntMarkerProps {
  hunt: Hunt;
  onClick?: (hunt: Hunt) => void;
}

// Player types
export type PlayerLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface CompletedHunt {
  huntId: string;
  huntTitle: string;
  completedAt: string;
  xpEarned: number;
  duration: string;
  difficulty: HuntDifficulty;
}

export interface Player {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  level: PlayerLevel;
  currentXp: number;
  totalXp: number;
  huntsCompleted: number;
  huntsInProgress: number;
  completedHunts: CompletedHunt[];
  createdAt: string;
}

// XP required for each level
export const XP_PER_LEVEL: Record<PlayerLevel, number> = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2100,
  8: 2800,
  9: 3600,
  10: 4500,
};
