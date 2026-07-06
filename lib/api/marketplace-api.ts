import type {
  BuyListingResult,
  CreateListingInput,
  MarketListing,
  MarketplaceFilters,
} from "@/types";
import {
  buyMockListing,
  createMockListing,
  getMockListingById,
  getMockListings,
} from "@/lib/data/mock-marketplace";
import { apiClient } from "./api-client";

function buildMarketplaceQuery(filters: MarketplaceFilters = {}): string {
  const params = new URLSearchParams();

  if (filters.rarity) params.set("rarity", filters.rarity);
  if (filters.category) params.set("category", filters.category);
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.maxPricePol) {
    params.set("maxPricePol", filters.maxPricePol.toString());
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export const marketplaceApi = {
  async getListings(
    filters: MarketplaceFilters = {}
  ): Promise<MarketListing[]> {
    try {
      const query = buildMarketplaceQuery(filters);
      return await apiClient.get<MarketListing[]>(`/api/marketplace${query}`);
    } catch {
      return getMockListings(filters);
    }
  },

  async getListingById(id: string): Promise<MarketListing | null> {
    try {
      return await apiClient.get<MarketListing>(`/api/marketplace/${id}`);
    } catch {
      return getMockListingById(id);
    }
  },

  async createListing(input: CreateListingInput): Promise<MarketListing> {
    try {
      return await apiClient.post<MarketListing>(
        "/api/marketplace/list",
        input
      );
    } catch {
      return createMockListing(input);
    }
  },

  async buyListing(id: string): Promise<BuyListingResult> {
    try {
      return await apiClient.post<BuyListingResult>(
        `/api/marketplace/${id}/buy`,
        {}
      );
    } catch {
      return buyMockListing(id);
    }
  },
};
