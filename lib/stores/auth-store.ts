import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Player } from "@/types";

// Dummy storage for SSR
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: "player" | "partner" | "admin";
  createdAt: string;
}

interface AuthState {
  /** Current authenticated user */
  user: AuthUser | null;
  /** JWT token (simulated) */
  token: string | null;
  /** Whether auth is being checked */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Auth error message */
  error: string | null;

  // Actions
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

/**
 * Generate a fake JWT token for simulation
 */
function generateFakeToken(user: AuthUser): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  );
  const signature = btoa("fake-signature-" + user.id);
  return `${header}.${payload}.${signature}`;
}

/**
 * Simulate user database for demo
 */
const mockUsers: Map<string, { user: AuthUser; password: string }> = new Map();

// Add a demo user
mockUsers.set("demo@lootopia.fr", {
  user: {
    id: "user-demo-001",
    username: "Aventurier",
    email: "demo@lootopia.fr",
    role: "player",
    createdAt: "2026-01-01T00:00:00Z",
  },
  password: "Demo123!",
});

// Add a partner demo user
mockUsers.set("partenaire@lootopia.fr", {
  user: {
    id: "partner-demo-001",
    username: "Musée Demo",
    email: "partenaire@lootopia.fr",
    role: "partner",
    createdAt: "2026-01-01T00:00:00Z",
  },
  password: "Partner123!",
});

/**
 * Auth store for managing authentication state.
 * Simulates JWT authentication for development.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check mock users
        const userRecord = mockUsers.get(email.toLowerCase());

        if (!userRecord || userRecord.password !== password) {
          set({
            isLoading: false,
            error: "Email ou mot de passe incorrect",
          });
          return false;
        }

        const token = generateFakeToken(userRecord.user);

        set({
          user: userRecord.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Set cookie for middleware
        if (typeof document !== "undefined") {
          document.cookie = `lootopia-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        }

        return true;
      },

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if user already exists
        if (mockUsers.has(email.toLowerCase())) {
          set({
            isLoading: false,
            error: "Cet email est déjà utilisé",
          });
          return false;
        }

        // Create new user
        const newUser: AuthUser = {
          id: `user-${Date.now()}`,
          username,
          email: email.toLowerCase(),
          role: "player",
          createdAt: new Date().toISOString(),
        };

        // Add to mock database
        mockUsers.set(email.toLowerCase(), {
          user: newUser,
          password,
        });

        const token = generateFakeToken(newUser);

        set({
          user: newUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Set cookie for middleware
        if (typeof document !== "undefined") {
          document.cookie = `lootopia-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
        }

        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });

        // Clear cookie
        if (typeof document !== "undefined") {
          document.cookie =
            "lootopia-auth-token=; path=/; max-age=0; SameSite=Strict";
        }
      },

      checkAuth: () => {
        // This function is problematic in SSR and its logic is mostly handled by the middleware.
        // For client-side rehydration, the persist middleware is enough.
        // We can simplify or remove this. For now, just ensure it's client-side.
        if (typeof window === "undefined") {
          return get().isAuthenticated;
        }
        // The rest of the logic is for client-side checks, which is fine.
        return get().isAuthenticated;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "lootopia-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
