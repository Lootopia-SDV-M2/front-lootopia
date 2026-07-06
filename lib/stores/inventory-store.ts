import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Artefact, Wallet } from "@/types";
import { artefactApi } from "@/lib/api/artefact-api";
import { marketplaceApi } from "@/lib/api/marketplace-api";

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface InventoryState {
  artefacts: Artefact[];
  wallet: Wallet | null;
  isLoading: boolean;
  error: string | null;

  loadInventory: () => Promise<void>;
  setWallet: (wallet: Wallet) => void;
  setBalancePol: (balancePol: number) => void;
  creditPol: (amount: number) => void;
  debitPol: (amount: number) => boolean;
  addArtefact: (artefact: Artefact) => void;
  removeArtefact: (artefactId: string) => void;
  buyListing: (listingId: string) => Promise<boolean>;
  getBalancePol: () => number;
  clearInventory: () => void;
  clearError: () => void;
}

function createFallbackWallet(balancePol = 0): Wallet {
  return {
    userId: "local-player",
    balancePol,
    updatedAt: new Date().toISOString(),
  };
}

function updateWalletBalance(
  wallet: Wallet | null,
  balancePol: number
): Wallet {
  return {
    ...(wallet ?? createFallbackWallet()),
    balancePol: Math.max(0, balancePol),
    updatedAt: new Date().toISOString(),
  };
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      artefacts: [],
      wallet: null,
      isLoading: false,
      error: null,

      loadInventory: async () => {
        set({ isLoading: true, error: null });

        try {
          const [artefacts, wallet] = await Promise.all([
            artefactApi.getMyArtefacts(),
            artefactApi.getWallet(),
          ]);

          set({
            artefacts,
            wallet,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Impossible de charger l'inventaire",
          });
        }
      },

      setWallet: (wallet) => set({ wallet }),

      setBalancePol: (balancePol) =>
        set((state) => ({
          wallet: updateWalletBalance(state.wallet, balancePol),
        })),

      creditPol: (amount) => {
        if (amount <= 0) return;

        set((state) => ({
          wallet: updateWalletBalance(
            state.wallet,
            (state.wallet?.balancePol ?? 0) + amount
          ),
        }));
      },

      debitPol: (amount) => {
        if (amount <= 0) return true;

        const balancePol = get().wallet?.balancePol ?? 0;
        if (balancePol < amount) return false;

        set((state) => ({
          wallet: updateWalletBalance(
            state.wallet,
            (state.wallet?.balancePol ?? 0) - amount
          ),
        }));
        return true;
      },

      addArtefact: (artefact) =>
        set((state) => ({
          artefacts: [
            artefact,
            ...state.artefacts.filter((item) => item.id !== artefact.id),
          ],
        })),

      removeArtefact: (artefactId) =>
        set((state) => ({
          artefacts: state.artefacts.filter((item) => item.id !== artefactId),
        })),

      buyListing: async (listingId) => {
        set({ isLoading: true, error: null });

        try {
          const result = await marketplaceApi.buyListing(listingId);

          set((state) => ({
            wallet: result.wallet,
            artefacts: [
              result.artefact,
              ...state.artefacts.filter(
                (item) => item.id !== result.artefact.id
              ),
            ],
            isLoading: false,
            error: null,
          }));
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Impossible d'acheter cette annonce",
          });
          return false;
        }
      },

      getBalancePol: () => get().wallet?.balancePol ?? 0,

      clearInventory: () =>
        set({
          artefacts: [],
          wallet: null,
          isLoading: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "lootopia-inventory",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        artefacts: state.artefacts,
        wallet: state.wallet,
      }),
    }
  )
);
