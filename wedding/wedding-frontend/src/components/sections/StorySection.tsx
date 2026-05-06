"use client";

import { useEditorStore } from "@/store/editorStore";
import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function StorySection({ section, isEditing }: Props) {
  const { updateSection, selectSection, selectedId } = useEditorStore();
  const isSelected = selectedId === section.id;
  const data = section.data as { content?: string };

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
      <div className="py-12 px-6 text-center">
        <h2 className="text-2xl font-serif font-semibold text-[#5C3D2E] mb-4">
          Câu chuyện của chúng tôi
        </h2>
        {isEditing && isSelected ? (
          <textarea
            className="w-full text-center text-gray-600 leading-relaxed bg-transparent border border-gray-200 rounded-lg p-3 outline-none focus:border-[#C9956C] resize-none"
            rows={5}
            value={data.content ?? ""}
            onChange={(e) =>
              updateSection(section.id, { content: e.target.value })
            }
            placeholder="Kể câu chuyện tình yêu của bạn..."
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
            {data.content || "Câu chuyện tình yêu của chúng tôi..."}
          </p>
        )}
      </div>
    </div>
  );
}
