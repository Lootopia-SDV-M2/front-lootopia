import { apiClient } from "@/lib/api/api-client";

export interface VoucherResponse {
  id: number;
  code: string;
  active: boolean;
  rewardName: string;
  rewardImageUrl: string | null;
  huntTitle: string;
  obtainedAt: string;
}

export interface RedeemResponse {
  message: string;
  voucherCode: string;
  rewardName: string;
}

export const vouchersApi = {
  async getMyVouchers(): Promise<VoucherResponse[]> {
    return apiClient.get<VoucherResponse[]>("/api/vouchers/mine");
  },

  async redeemVoucher(code: string): Promise<RedeemResponse> {
    return apiClient.post<RedeemResponse>("/api/vouchers/redeem", { code });
  },
};
