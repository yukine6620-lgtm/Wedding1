import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "@/lib/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

interface AuthState {
  user: { id: string; email: string } | null;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<AuthResponse>("/api/auth/login", data);
      Cookies.set("token", res.data.token, { expires: 1 }); // 1 day
      set({ user: res.data.user, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Đăng nhập thất bại";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<AuthResponse>("/api/auth/register", data);
      Cookies.set("token", res.data.token, { expires: 1 });
      set({ user: res.data.user, isLoading: false });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Đăng ký thất bại";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
