import { apiClient } from "./api-client";

export interface ParticipationDTO {
  id: number;
  huntId: number;
  huntTitle: string;
  huntDifficulty: string;
  huntDuration: string;
  huntReward: number;
  creatorName: string;
  currentStepIndex: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
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

export interface ArtefactDTO {
  id: number;
  name: string;
  imageUrl: string | null;
  rarity: string;
  obtainedAt: string;
}

export const participationApi = {
  async joinHunt(huntId: string): Promise<ParticipationDTO> {
    return apiClient.post<ParticipationDTO>(
      `/api/participations/${huntId}/join`,
      {}
    );
  },

  async validateStep(participationId: string): Promise<ParticipationDTO> {
    return apiClient.put<ParticipationDTO>(
      `/api/participations/${participationId}/validate-step`
    );
  },

  async abandonHunt(participationId: string): Promise<ParticipationDTO> {
    return apiClient.put<ParticipationDTO>(
      `/api/participations/${participationId}/abandon`
    );
  },

  async getMyParticipations(): Promise<ParticipationDTO[]> {
    return apiClient.get<ParticipationDTO[]>("/api/participations/mine");
  },

  async getMyArtefacts(): Promise<ArtefactDTO[]> {
    return apiClient.get<ArtefactDTO[]>("/api/artefacts/mine");
  },
};
