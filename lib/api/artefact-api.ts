import type { Artefact, Wallet } from "@/types";
import {
  getMockArtefactById,
  getMockInventory,
  getMockWallet,
} from "@/lib/data/mock-marketplace";
import { apiClient } from "./api-client";

function isAuthError(error: unknown): boolean {
  return error instanceof Error && /\b(401|403)\b/.test(error.message);
}

function emptyWallet(): Wallet {
  return {
    userId: "anonymous",
    balancePol: 0,
    updatedAt: new Date().toISOString(),
  };
}

export const artefactApi = {
  async getMyArtefacts(): Promise<Artefact[]> {
    try {
      return await apiClient.get<Artefact[]>("/api/artefacts/mine");
    } catch (error) {
      if (isAuthError(error)) return [];
      return getMockInventory();
    }
  },

  async getArtefactById(id: string): Promise<Artefact | null> {
    try {
      return await apiClient.get<Artefact>(`/api/artefacts/${id}`);
    } catch {
      return getMockArtefactById(id);
    }
  },

  async getWallet(): Promise<Wallet> {
    try {
      return await apiClient.get<Wallet>("/api/wallet/me");
    } catch (error) {
      if (isAuthError(error)) return emptyWallet();
      return getMockWallet();
    }
  },
};
