import { create } from "zustand";
import { api } from "@/lib/api";
import type { GenerateInvitationRequest, GenerateInvitationResponse } from "@/types";

interface AIState {
  isLoading: boolean;
  error: string | null;
  lastResult: GenerateInvitationResponse | null;

  generate: (data: GenerateInvitationRequest) => Promise<GenerateInvitationResponse>;
  reset: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isLoading: false,
  error: null,
  lastResult: null,

  generate: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<GenerateInvitationResponse>("/api/ai/generate", data);
      set({ lastResult: res.data, isLoading: false });
      return res.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể tạo thiệp bằng AI";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  reset: () => set({ isLoading: false, error: null, lastResult: null }),
}));
