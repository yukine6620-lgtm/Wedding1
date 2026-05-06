import { create } from "zustand";
import type { InvitationSection, InvitationTheme } from "@/types";

interface EditorState {
  // Current editing state
  sections: InvitationSection[];
  theme: InvitationTheme;
  selectedId: string | null;

  // History for undo/redo
  history: InvitationSection[][];
  future: InvitationSection[][];

  // Actions
  setSections: (sections: InvitationSection[]) => void;
  setTheme: (theme: InvitationTheme) => void;
  addSection: (section: InvitationSection) => void;
  updateSection: (id: string, data: Partial<InvitationSection["data"]>) => void;
  removeSection: (id: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  selectSection: (id: string | null) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Helpers
  reset: () => void;
}

const DEFAULT_THEME: InvitationTheme = {
  primaryColor: "#EADBC8",
  secondaryColor: "#FFF",
  font: "Playfair Display",
};

export const useEditorStore = create<EditorState>((set, get) => ({
  sections: [],
  theme: DEFAULT_THEME,
  selectedId: null,
  history: [],
  future: [],

  setSections: (sections) => {
    const current = get().sections;
    set({
      sections,
      history: [...get().history, current],
      future: [],
    });
  },

  setTheme: (theme) => set({ theme }),

  addSection: (section) => {
    const current = get().sections;
    set({
      sections: [...current, section],
      history: [...get().history, current],
      future: [],
    });
  },

  updateSection: (id, data) => {
    const current = get().sections;
    set({
      sections: current.map((s) =>
        s.id === id ? { ...s, data: { ...s.data, ...data } } : s
      ),
      history: [...get().history, current],
      future: [],
    });
  },

  removeSection: (id) => {
    const current = get().sections;
    set({
      sections: current.filter((s) => s.id !== id),
      history: [...get().history, current],
      future: [],
      selectedId: get().selectedId === id ? null : get().selectedId,
    });
  },

  reorderSections: (activeId, overId) => {
    const current = get().sections;
    const oldIndex = current.findIndex((s) => s.id === activeId);
    const newIndex = current.findIndex((s) => s.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...current];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    set({
      sections: reordered,
      history: [...get().history, current],
      future: [],
    });
  },

  selectSection: (id) => set({ selectedId: id }),

  undo: () => {
    const { history, sections } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      sections: previous,
      history: newHistory,
      future: [sections, ...get().future],
    });
  },

  redo: () => {
    const { future, sections } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      sections: next,
      history: [...get().history, sections],
      future: newFuture,
    });
  },

  canUndo: () => get().history.length > 0,
  canRedo: () => get().future.length > 0,

  reset: () =>
    set({
      sections: [],
      theme: DEFAULT_THEME,
      selectedId: null,
      history: [],
      future: [],
    }),
}));
