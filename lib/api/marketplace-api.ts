import { apiClient } from "./api-client";

export interface MarketListingResponse {
  id: number;
  artefact: {
    id: number;
    name: string;
    imageUrl: string | null;
    rarity: string;
  };
  sellerName: string;
  price: number;
  type: "VENTE_DIRECTE" | "ENCHERE";
  status: "ACTIF" | "VENDU" | "EXPIRE" | "ANNULE";
  createdAt: string;
}

export interface ListArtefactRequest {
  artefactId: number;
  price: number;
  type: "VENTE_DIRECTE" | "ENCHERE";
}

export interface BuyResponse {
  message: string;
  transactionId: number;
}

export interface ArtefactDTO {
  id: number;
  name: string;
  imageUrl: string | null;
  rarity: string;
  obtainedAt: string;
}

export const marketplaceApi = {
  async getListings(): Promise<MarketListingResponse[]> {
    return apiClient.get<MarketListingResponse[]>("/api/marketplace");
  },

  async getMyListings(): Promise<MarketListingResponse[]> {
    return apiClient.get<MarketListingResponse[]>("/api/marketplace/mine");
  },

  async listArtefact(data: ListArtefactRequest): Promise<MarketListingResponse> {
    return apiClient.post<MarketListingResponse>("/api/marketplace/list", data);
  },

  async buyListing(id: number): Promise<BuyResponse> {
    return apiClient.post<BuyResponse>(`/api/marketplace/${id}/buy`, {});
  },

  async getMyArtefacts(): Promise<ArtefactDTO[]> {
    return apiClient.get<ArtefactDTO[]>("/api/artefacts/mine");
  },
};
