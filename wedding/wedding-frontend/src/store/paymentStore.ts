import { create } from "zustand";
import { api } from "@/lib/api";
import type { PaymentResponse } from "@/types";

interface PaymentState {
  isLoading: boolean;
  error: string | null;

  initiatePayment: (invitationId: string, returnUrl: string) => Promise<PaymentResponse>;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isLoading: false,
  error: null,

  initiatePayment: async (invitationId, returnUrl) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<PaymentResponse>("/api/payments/momo", {
        invitationId,
        returnUrl,
      });
      set({ isLoading: false });
      return res.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể khởi tạo thanh toán";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
}));
