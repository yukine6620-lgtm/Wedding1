"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/store/editorStore";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
}

export default function SortableSection({ section }: Props) {
  const { removeSection, selectedId } = useEditorStore();
  const isSelected = selectedId === section.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group mb-2">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-opacity z-10"
        title="Kéo để sắp xếp"
      >
        ⠿
      </div>

      {/* Delete button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeSection(section.id);
          }}
          className="absolute right-2 top-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
          title="Xóa section"
        >
          ×
        </button>
      )}

      <SectionRenderer section={section} isEditing />
    </div>
  );
}
