"use client";

import { useEditorStore } from "@/store/editorStore";
import type { InvitationSection } from "@/types";

const SECTION_TYPES: {
  type: InvitationSection["type"];
  label: string;
  icon: string;
  defaultData: Record<string, unknown>;
}[] = [
  {
    type: "hero",
    label: "Tiêu đề",
    icon: "💍",
    defaultData: { title: "Tên cặp đôi", subtitle: "Trân trọng kính mời", date: "" },
  },
  {
    type: "story",
    label: "Câu chuyện",
    icon: "💌",
    defaultData: { content: "Câu chuyện tình yêu của chúng tôi..." },
  },
  {
    type: "event",
    label: "Thông tin tiệc",
    icon: "📍",
    defaultData: { time: "", location: "", mapUrl: "" },
  },
  {
    type: "gallery",
    label: "Thư viện ảnh",
    icon: "🖼️",
    defaultData: { images: [] },
  },
  {
    type: "rsvp",
    label: "RSVP",
    icon: "✉️",
    defaultData: { enabled: true },
  },
];

const THEME_PRESETS = [
  { name: "Romantic Beige", primaryColor: "#EADBC8", font: "Playfair Display" },
  { name: "Sage Green", primaryColor: "#B2C9AD", font: "Georgia" },
  { name: "Dusty Rose", primaryColor: "#E8B4B8", font: "Playfair Display" },
  { name: "Navy Blue", primaryColor: "#2C3E6B", font: "Georgia" },
  { name: "Ivory White", primaryColor: "#F5F0E8", font: "Playfair Display" },
];

export default function EditorSidebar() {
  const { addSection, theme, setTheme, sections, selectedId } = useEditorStore();

  const handleAddSection = (type: InvitationSection["type"], defaultData: Record<string, unknown>) => {
    addSection({
      id: crypto.randomUUID(),
      type,
      data: defaultData,
    });
  };

  return (
    <aside className="w-64 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        {/* Add Sections */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Thêm section
          </h3>
          <div className="space-y-1.5">
            {SECTION_TYPES.map((s) => (
              <button
                key={s.type}
                onClick={() => handleAddSection(s.type, s.defaultData)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-[#FAF7F2] rounded-lg transition-colors text-left"
              >
                <span className="text-lg">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Màu sắc & Font
          </h3>
          <div className="space-y-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() =>
                  setTheme({
                    primaryColor: preset.primaryColor,
                    font: preset.font,
                    secondaryColor: "#FFF",
                  })
                }
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-sm ${
                  theme.primaryColor === preset.primaryColor
                    ? "ring-2 ring-[#C9956C]"
                    : "hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <span className="text-gray-700">{preset.name}</span>
              </button>
            ))}
          </div>

          {/* Custom color */}
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-gray-500">Màu tùy chỉnh:</label>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) =>
                setTheme({ ...theme, primaryColor: e.target.value })
              }
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
          </div>
        </div>

        {/* Section count */}
        <div className="text-xs text-gray-400 text-center">
          {sections.length} section{sections.length !== 1 ? "s" : ""}
        </div>
      </div>
    </aside>
  );
}
