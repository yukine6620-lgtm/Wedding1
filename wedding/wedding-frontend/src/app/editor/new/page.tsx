"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditorStore } from "@/store/editorStore";
import { useInvitationStore } from "@/store/invitationStore";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";
import type { InvitationSection } from "@/types";

function NewEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const { user } = useAuthStore();
  const { create } = useInvitationStore();
  const { setSections, setTheme } = useEditorStore();

  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tên thiệp");
      return;
    }

    setIsCreating(true);
    try {
      // Default sections cho template
      const defaultSections: InvitationSection[] = [
        {
          id: crypto.randomUUID(),
          type: "hero",
          data: { title: title, subtitle: "Trân trọng kính mời", date: "" },
        },
        {
          id: crypto.randomUUID(),
          type: "story",
          data: { content: "Câu chuyện tình yêu của chúng tôi..." },
        },
        {
          id: crypto.randomUUID(),
          type: "event",
          data: { time: "", location: "", mapUrl: "" },
        },
        {
          id: crypto.randomUUID(),
          type: "rsvp",
          data: { enabled: true },
        },
      ];

      const jsonData = JSON.stringify({
        version: "1.0",
        theme: {
          primaryColor: "#EADBC8",
          secondaryColor: "#FFF",
          font: "Playfair Display",
        },
        sections: defaultSections,
      });

      const invitation = await create({
        templateId: templateId ?? "template_romantic_beige",
        title,
        jsonData,
      });

      router.push(`/editor/${invitation.id}`);
    } catch (err) {
      alert("Không thể tạo thiệp. Vui lòng thử lại.");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-serif font-bold text-[#5C3D2E] mb-6 text-center">
          Tạo thiệp mới
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thiệp (vd: Nam & Linh Wedding)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9956C] text-sm"
              placeholder="Nhập tên cặp đôi hoặc tên sự kiện"
              autoFocus
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full bg-[#C9956C] hover:bg-[#b8845b] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isCreating ? "Đang tạo..." : "Tạo thiệp"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">Đang tải...</div>}>
      <NewEditorContent />
    </Suspense>
  );
}
