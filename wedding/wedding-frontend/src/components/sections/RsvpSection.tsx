"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { InvitationSection, RsvpRequest } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
  invitationId?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function RsvpSection({ section, isEditing, invitationId }: Props) {
  const [form, setForm] = useState<Omit<RsvpRequest, "invitationId">>({
    name: "",
    phone: "",
    status: "Attending",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId) return;

    setSubmitState("loading");
    try {
      await api.post("/api/rsvp", { ...form, invitationId });
      setSubmitState("success");
      setForm({ name: "", phone: "", status: "Attending", message: "" });
    } catch {
      setSubmitState("error");
    }
  };

  const title = (section.data?.title as string) || "Xác nhận tham dự";

  return (
    <div className="py-12 px-6 text-center">
      <h2 className="text-2xl font-serif font-semibold text-[#5C3D2E] mb-4">
        {title}
      </h2>

      {isEditing ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-gray-400 text-sm">
          Form RSVP sẽ hiển thị trên trang thiệp public
        </div>
      ) : submitState === "success" ? (
        <div className="max-w-sm mx-auto bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-green-700 font-medium">Cảm ơn bạn đã xác nhận!</p>
          <p className="text-green-600 text-sm mt-1">Chúng tôi rất mong được gặp bạn.</p>
          <button
            onClick={() => setSubmitState("idle")}
            className="mt-3 text-xs text-green-600 underline"
          >
            Gửi lại
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]"
            placeholder="Họ và tên *"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]"
            placeholder="Số điện thoại"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]"
          >
            <option value="Attending">Tôi sẽ tham dự</option>
            <option value="NotAttending">Tôi không thể tham dự</option>
            <option value="Maybe">Có thể tham dự</option>
          </select>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C] resize-none"
            placeholder="Lời nhắn (tuỳ chọn)"
          />

          {submitState === "error" && (
            <p className="text-xs text-red-500">Có lỗi xảy ra, vui lòng thử lại.</p>
          )}

          <button
            type="submit"
            disabled={submitState === "loading"}
            className="w-full bg-[#C9956C] hover:bg-[#b8845b] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {submitState === "loading" ? "Đang gửi..." : "Xác nhận"}
          </button>
        </form>
      )}
    </div>
  );
}
