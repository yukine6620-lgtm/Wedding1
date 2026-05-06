"use client";

import { useEditorStore } from "@/store/editorStore";
import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function GallerySection({ section, isEditing }: Props) {
  const { updateSection, selectSection, selectedId } = useEditorStore();
  const isSelected = selectedId === section.id;
  const data = section.data as { images?: string[] };

  const wrapperClass = isEditing
    ? `relative cursor-pointer rounded-lg transition-all ${
        isSelected
          ? "ring-2 ring-[#C9956C] ring-offset-2"
          : "hover:ring-2 hover:ring-[#C9956C]/40 hover:ring-offset-1"
      }`
    : "";

  const images = data.images ?? [];

  return (
    <div
      className={wrapperClass}
      onClick={() => isEditing && selectSection(section.id)}
    >
      <div className="py-12 px-6">
        <h2 className="text-2xl font-serif font-semibold text-[#5C3D2E] mb-6 text-center">
          Khoảnh khắc của chúng tôi
        </h2>
        {isEditing && isSelected ? (
          <div className="text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-500 mb-3">
              Upload ảnh sẽ được thêm ở Phase 2 (Cloudinary)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-3xl">
                +
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.length === 0 ? (
              <div className="col-span-2 md:col-span-3 text-center text-gray-400 py-10">
                Chưa có ảnh
              </div>
            ) : (
              images.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
