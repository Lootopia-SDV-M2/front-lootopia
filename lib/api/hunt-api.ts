import { apiClient } from "./api-client";

export interface HuntResponseDTO {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  theme: string | null;
  maxParticipants: number;
  status: string;
  creatorName: string;
  createdAt: string;
  steps: {
    id: number;
    orderIndex: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    radius: number;
  }[];
  rewards: {
    id: number;
    name: string;
    imageUrl: string | null;
    winnerId: number | null;
  }[];
}

export interface HuntSummaryDTO {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  theme: string | null;
  maxParticipants: number;
  status: string;
  creatorName: string;
  stepsCount: number;
  rewardsCount: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface CreateHuntData {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  theme: string;
  maxParticipants: number;
  steps: {
    orderIndex: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    radius: number;
  }[];
  rewards: {
    name: string;
  }[];
}

export const huntApi = {
  async createHunt(
    data: CreateHuntData,
    rewardImages: File[]
  ): Promise<HuntResponseDTO> {
    const formData = new FormData();
    formData.append(
      "hunt",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    rewardImages.forEach((image) => {
      formData.append("images", image);
    });

    return apiClient.postMultipart<HuntResponseDTO>("/api/hunts", formData);
  },

  async getPublishedHunts(): Promise<HuntSummaryDTO[]> {
    return apiClient.get<HuntSummaryDTO[]>("/api/hunts");
  },

  async getHuntById(id: number): Promise<HuntResponseDTO> {
    return apiClient.get<HuntResponseDTO>(`/api/hunts/${id}`);
  },

  async getMyHunts(): Promise<HuntSummaryDTO[]> {
    return apiClient.get<HuntSummaryDTO[]>("/api/hunts/mine");
  },

  async publishHunt(id: number): Promise<HuntResponseDTO> {
    return apiClient.put<HuntResponseDTO>(`/api/hunts/${id}/publish`);
  },
};
