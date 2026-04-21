import { create } from "zustand";
import { marketplaceApi, type MarketListingResponse } from "@/lib/api/marketplace-api";
import { useToastStore } from "@/lib/stores/toast-store";

interface MarketplaceState {
  listings: MarketListingResponse[];
  myListings: MarketListingResponse[];
  loading: boolean;
  error: string | null;
  fetchListings: () => Promise<void>;
  fetchMyListings: () => Promise<void>;
  buyListing: (id: number) => Promise<void>;
  listArtefact: (
    artefactId: number,
    price: number,
    type: "VENTE_DIRECTE" | "ENCHERE"
  ) => Promise<void>;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  listings: [],
  myListings: [],
  loading: false,
  error: null,

  fetchListings: async () => {
    set({ loading: true, error: null });
    try {
      const listings = await marketplaceApi.getListings();
      set({ listings, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erreur lors du chargement des offres.",
        loading: false,
      });
    }
  },

  fetchMyListings: async () => {
    set({ loading: true, error: null });
    try {
      const myListings = await marketplaceApi.getMyListings();
      set({ myListings, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erreur lors du chargement de vos ventes.",
        loading: false,
      });
    }
  },

  buyListing: async (id: number) => {
    const toast = useToastStore.getState().addToast;
    try {
      const result = await marketplaceApi.buyListing(id);
      set((state) => ({
        listings: state.listings.map((l) =>
          l.id === id ? { ...l, status: "VENDU" as const } : l
        ),
      }));
      toast(result.message, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur lors de l'achat.", "error");
      throw err;
    }
  },

  listArtefact: async (
    artefactId: number,
    price: number,
    type: "VENTE_DIRECTE" | "ENCHERE"
  ) => {
    const toast = useToastStore.getState().addToast;
    try {
      const newListing = await marketplaceApi.listArtefact({ artefactId, price, type });
      set((state) => ({
        myListings: [newListing, ...state.myListings],
      }));
      toast("Artefact mis en vente !", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur lors de la mise en vente.", "error");
      throw err;
    }
  },
}));
