"use client";

import { useEditorStore } from "@/store/editorStore";
import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function HeroSection({ section, isEditing }: Props) {
  const { updateSection, selectSection, selectedId } = useEditorStore();
  const isSelected = selectedId === section.id;
  const data = section.data as {
    title?: string;
    subtitle?: string;
    date?: string;
    backgroundImage?: string;
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
      <div
        className="text-center py-20 px-6 rounded-lg"
        style={{
          backgroundImage: data.backgroundImage
            ? `url(${data.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isEditing && isSelected ? (
          <>
            <input
              className="block w-full text-center text-4xl font-serif font-bold bg-transparent border-b border-[#C9956C] outline-none mb-3 text-[#5C3D2E]"
              value={data.title ?? ""}
              onChange={(e) =>
                updateSection(section.id, { title: e.target.value })
              }
              placeholder="Tên cặp đôi"
              onClick={(e) => e.stopPropagation()}
            />
            <input
              className="block w-full text-center text-xl bg-transparent border-b border-gray-300 outline-none mb-3 text-gray-600"
              value={data.subtitle ?? ""}
              onChange={(e) =>
                updateSection(section.id, { subtitle: e.target.value })
              }
              placeholder="Lời mời"
              onClick={(e) => e.stopPropagation()}
            />
            <input
              type="date"
              className="block mx-auto text-center bg-transparent border-b border-gray-300 outline-none text-gray-500"
              value={data.date ?? ""}
              onChange={(e) =>
                updateSection(section.id, { date: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-serif font-bold text-[#5C3D2E] mb-3">
              {data.title || "Tên cặp đôi"}
            </h1>
            <p className="text-xl text-gray-600 mb-3">
              {data.subtitle || "Trân trọng kính mời"}
            </p>
            {data.date && (
              <p className="text-gray-500 font-medium">{data.date}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
