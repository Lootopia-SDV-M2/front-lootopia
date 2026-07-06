import type { MarketplaceTransaction } from "@/types";
import {
  getMockTransactionById,
  getMockTransactions,
} from "@/lib/data/mock-marketplace";
import { apiClient } from "./api-client";

export const transactionApi = {
  async getMyTransactions(): Promise<MarketplaceTransaction[]> {
    try {
      return await apiClient.get<MarketplaceTransaction[]>(
        "/api/transactions/mine"
      );
    } catch {
      return getMockTransactions();
    }
  },

  async getTransactionById(id: string): Promise<MarketplaceTransaction | null> {
    try {
      return await apiClient.get<MarketplaceTransaction>(
        `/api/transactions/${id}`
      );
    } catch {
      return getMockTransactionById(id);
    }
  },
};
