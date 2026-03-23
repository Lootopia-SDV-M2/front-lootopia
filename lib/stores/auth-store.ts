import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/lib/api/api-client";
import { usePlayerStore } from "./player-store";

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
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    role?: "CHERCHEUR" | "ORGANISATEUR"
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

interface AuthApiResponse {
  token: string;
  role: string;
  username: string;
}

function mapBackendRole(role: string): "player" | "partner" | "admin" {
  switch (role) {
    case "ORGANISATEUR":
      return "partner";
    case "ADMIN":
      return "admin";
    default:
      return "player";
  }
}

function generateFakeToken(user: AuthUser): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      username: user.username,
      role:
        user.role === "partner"
          ? "ORGANISATEUR"
          : user.role === "admin"
            ? "ADMIN"
            : "CHERCHEUR",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    })
  );
  const signature = btoa("fake-signature-" + user.id);
  return `${header}.${payload}.${signature}`;
}

const mockUsers: Map<string, { user: AuthUser; password: string }> = new Map();

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

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `lootopia-auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
  }
}

function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie =
      "lootopia-auth-token=; path=/; max-age=0; SameSite=Strict";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<AuthApiResponse>(
            "/api/auth/login",
            { username: email, password }
          );

          const user: AuthUser = {
            id: response.username,
            username: response.username,
            email,
            role: mapBackendRole(response.role),
            createdAt: new Date().toISOString(),
          };

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          usePlayerStore.getState().initializePlayer(user.username, email);
          setAuthCookie(response.token);
          return true;
        } catch {
          // Fallback to mock users if backend is unreachable
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

          usePlayerStore
            .getState()
            .initializePlayer(userRecord.user.username, userRecord.user.email);
          setAuthCookie(token);
          return true;
        }
      },

      register: async (username, email, password, role = "CHERCHEUR") => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<AuthApiResponse>(
            "/api/auth/register",
            { username, email, password, role }
          );

          const user: AuthUser = {
            id: response.username,
            username: response.username,
            email,
            role: mapBackendRole(response.role),
            createdAt: new Date().toISOString(),
          };

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          usePlayerStore.getState().initializePlayer(user.username, email);
          setAuthCookie(response.token);
          return true;
        } catch {
          // Fallback to mock
          if (mockUsers.has(email.toLowerCase())) {
            set({
              isLoading: false,
              error: "Cet email est déjà utilisé",
            });
            return false;
          }

          const frontendRole = mapBackendRole(role);
          const newUser: AuthUser = {
            id: `user-${Date.now()}`,
            username,
            email: email.toLowerCase(),
            role: frontendRole,
            createdAt: new Date().toISOString(),
          };

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

          usePlayerStore
            .getState()
            .initializePlayer(newUser.username, newUser.email);
          setAuthCookie(token);
          return true;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        clearAuthCookie();
      },

      checkAuth: () => {
        const { token, isAuthenticated } = get();
        if (!isAuthenticated || !token) return false;
        if (isTokenExpired(token)) {
          get().logout();
          return false;
        }
        return true;
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
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.logout();
        }
      },
    }
  )
);
