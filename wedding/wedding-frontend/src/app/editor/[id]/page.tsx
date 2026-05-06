"use client";

import { useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Cookies from "js-cookie";
import { useEditorStore } from "@/store/editorStore";
import { useInvitationStore } from "@/store/invitationStore";
import SortableSection from "@/components/editor/SortableSection";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorToolbar from "@/components/editor/EditorToolbar";
import type { InvitationSchema } from "@/types";

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { sections, theme, setSections, setTheme, reorderSections, undo, redo, canUndo, canRedo } =
    useEditorStore();
  const { fetchById, update } = useInvitationStore();

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  // Auth guard
  useEffect(() => {
    if (!Cookies.get("token")) router.push("/auth/login");
  }, [router]);

  // Load invitation data
  useEffect(() => {
    const load = async () => {
      const inv = await fetchById(id);
      if (!inv) return;

      try {
        const schema: InvitationSchema = JSON.parse(inv.jsonData);
        // Use store directly to avoid triggering history on initial load
        useEditorStore.setState({
          sections: schema.sections ?? [],
          theme: schema.theme ?? { primaryColor: "#EADBC8", font: "Playfair Display" },
          history: [],
          future: [],
        });
        isInitializedRef.current = true;
      } catch {
        isInitializedRef.current = true;
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-save debounce (1.5s)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      const jsonData = JSON.stringify({ version: "1.0", theme, sections });
      await update(id, { jsonData });
    }, 1500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [sections, theme, id, update]);

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [undo, redo]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderSections(String(active.id), String(over.id));
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <EditorToolbar
        invitationId={id}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm min-h-[600px] p-6"
            style={{ fontFamily: theme.font }}
          >
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-center text-sm">
                  Thêm section từ thanh bên phải để bắt đầu
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section) => (
                    <SortableSection key={section.id} section={section} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <EditorSidebar />
      </div>
    </div>
  );
}
