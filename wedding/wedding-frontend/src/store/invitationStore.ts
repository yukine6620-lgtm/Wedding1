import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  InvitationDto,
  CreateInvitationRequest,
  UpdateInvitationRequest,
} from "@/types";

interface InvitationState {
  invitations: InvitationDto[];
  current: InvitationDto | null;
  isLoading: boolean;
  error: string | null;

  fetchMyInvitations: () => Promise<void>;
  fetchBySlug: (slug: string) => Promise<InvitationDto | null>;
  fetchById: (id: string) => Promise<InvitationDto | null>;
  create: (data: CreateInvitationRequest) => Promise<InvitationDto>;
  update: (id: string, data: UpdateInvitationRequest) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setCurrent: (invitation: InvitationDto | null) => void;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invitations: [],
  current: null,
  isLoading: false,
  error: null,

  fetchMyInvitations: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<InvitationDto[]>("/api/invitations");
      set({ invitations: res.data, isLoading: false });
    } catch {
      set({ error: "Không thể tải danh sách thiệp", isLoading: false });
    }
  },

  fetchBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<InvitationDto>(`/api/invitations/${slug}`);
      set({ current: res.data, isLoading: false });
      return res.data;
    } catch {
      set({ error: "Không tìm thấy thiệp", isLoading: false });
      return null;
    }
  },

  fetchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get<InvitationDto>(`/api/invitations/${id}`);
      set({ current: res.data, isLoading: false });
      return res.data;
    } catch {
      set({ error: "Không tìm thấy thiệp", isLoading: false });
      return null;
    }
  },

  create: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post<InvitationDto>("/api/invitations", data);
      set((state) => ({
        invitations: [res.data, ...state.invitations],
        isLoading: false,
      }));
      return res.data;
    } catch {
      set({ error: "Không thể tạo thiệp", isLoading: false });
      throw new Error("Không thể tạo thiệp");
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put<InvitationDto>(`/api/invitations/${id}`, data);
      set((state) => ({
        invitations: state.invitations.map((inv) =>
          inv.id === id ? res.data : inv
        ),
        current: state.current?.id === id ? res.data : state.current,
      }));
    } catch {
      set({ error: "Không thể cập nhật thiệp" });
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`/api/invitations/${id}`);
      set((state) => ({
        invitations: state.invitations.filter((inv) => inv.id !== id),
      }));
    } catch {
      set({ error: "Không thể xóa thiệp" });
    }
  },

  setCurrent: (invitation) => set({ current: invitation }),
}));
