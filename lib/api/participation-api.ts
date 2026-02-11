import { apiClient } from "./api-client";

/**
 * Participation API - prepared for future backend integration.
 * These endpoints are NOT yet available on the backend.
 * The frontend uses local Zustand state until they are ready.
 */
export const participationApi = {
  async joinHunt(huntId: string) {
    return apiClient.post(`/api/participations/${huntId}/join`, {});
  },

  async validateStep(participationId: string) {
    return apiClient.put(
      `/api/participations/${participationId}/validate-step`
    );
  },

  async abandonHunt(participationId: string) {
    return apiClient.put(`/api/participations/${participationId}/abandon`);
  },
};
