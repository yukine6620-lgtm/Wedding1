"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  invitationId: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function EditorToolbar({
  invitationId,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Dashboard
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <span className="text-sm text-gray-400">Tự động lưu</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
          title="Hoàn tác (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
          title="Làm lại (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
        <div className="h-4 w-px bg-gray-200 mx-2" />
        <button
          onClick={() => {
            const slug = prompt("Nhập slug để xem thiệp (tạm thời):");
            if (slug) window.open(`/${slug}`, "_blank");
          }}
          className="px-4 py-1.5 text-sm border border-gray-200 hover:bg-gray-50 rounded transition-colors"
        >
          Xem trước
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-1.5 text-sm bg-[#C9956C] hover:bg-[#b8845b] text-white rounded transition-colors"
        >
          Hoàn tất
        </button>
      </div>
    </header>
  );
}
