import { apiClient } from "./api-client";

export interface NotificationItem {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  huntId?: number;
  huntTitle?: string;
  createdAt: string;
}

export const notificationsApi = {
  async getNotifications(): Promise<NotificationItem[]> {
    return apiClient.get<NotificationItem[]>("/api/notifications");
  },

  async markRead(id: number): Promise<void> {
    await apiClient.put(`/api/notifications/${id}/read`, {});
  },
};
