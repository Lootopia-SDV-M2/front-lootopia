import { create } from "zustand";

type NavigationTab =
  | "home"
  | "map"
  | "profile"
  | "create"
  | "hunts"
  | "inventory";

interface AppState {
  /** Currently active navigation tab */
  activeTab: NavigationTab;
  /** Set the active navigation tab */
  setActiveTab: (tab: NavigationTab) => void;
}

/**
 * Global application store for shared state.
 * Uses Zustand for lightweight, scalable state management.
 */
export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
