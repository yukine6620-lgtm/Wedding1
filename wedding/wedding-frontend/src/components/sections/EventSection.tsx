"use client";

import { useEditorStore } from "@/store/editorStore";
import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function EventSection({ section, isEditing }: Props) {
  const { updateSection, selectSection, selectedId } = useEditorStore();
  const isSelected = selectedId === section.id;
  const data = section.data as {
    time?: string;
    location?: string;
    mapUrl?: string;
  };

  const wrapperClass = isEditing
    ? `relative cursor-pointer rounded-lg transition-all ${
        isSelected
          ? "ring-2 ring-[#C9956C] ring-offset-2"
          : "hover:ring-2 hover:ring-[#C9956C]/40 hover:ring-offset-1"
      }`
    : "";

  return (
    <div
      className={wrapperClass}
      onClick={() => isEditing && selectSection(section.id)}
    >
      <div className="py-12 px-6 text-center bg-white rounded-2xl my-4">
        <h2 className="text-2xl font-serif font-semibold text-[#5C3D2E] mb-6">
          Thông tin tiệc cưới
        </h2>
        {isEditing && isSelected ? (
          <div className="space-y-3 max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-xl">🕐</span>
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
                value={data.time ?? ""}
                onChange={(e) =>
                  updateSection(section.id, { time: e.target.value })
                }
                placeholder="18:00, Thứ 7, 12/12/2026"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
                value={data.location ?? ""}
                onChange={(e) =>
                  updateSection(section.id, { location: e.target.value })
                }
                placeholder="Tên địa điểm, địa chỉ"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
                value={data.mapUrl ?? ""}
                onChange={(e) =>
                  updateSection(section.id, { mapUrl: e.target.value })
                }
                placeholder="Link Google Maps"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">🕐 {data.time || "Thời gian"}</p>
            <p className="text-gray-600">📍 {data.location || "Địa điểm"}</p>
            {data.mapUrl && (
              <a
                href={data.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-[#C9956C] hover:underline"
              >
                Xem bản đồ →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
