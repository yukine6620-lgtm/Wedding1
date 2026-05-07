"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAIStore } from "@/store/aiStore";
import { useInvitationStore } from "@/store/invitationStore";
import type { GenerateInvitationRequest } from "@/types";

const STYLES = [
  { value: "romantic", label: "Lãng mạn", emoji: "🌸" },
  { value: "modern", label: "Hiện đại", emoji: "✨" },
  { value: "traditional", label: "Truyền thống", emoji: "🏮" },
  { value: "minimalist", label: "Tối giản", emoji: "🤍" },
] as const;

export default function AIGeneratePage() {
  const router = useRouter();
  const { generate, isLoading, error } = useAIStore();
  const { create } = useInvitationStore();

  const [form, setForm] = useState<GenerateInvitationRequest>({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingTime: "17:00",
    venue: "",
    style: "romantic",
    additionalInfo: "",
  });

  const [warning, setWarning] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWarning(null);

    try {
      const result = await generate(form);

      if (result.warning) setWarning(result.warning);

      // Create invitation with AI-generated JSON
      const invitation = await create({
        templateId: "ai-generated",
        title: `${form.groomName} & ${form.brideName}`,
        jsonData: result.jsonData,
      });

      router.push(`/editor/${invitation.id}`);
    } catch {
      // error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✨</div>
          <h1 className="text-2xl font-serif font-semibold text-[#5C3D2E]">
            Tạo thiệp bằng AI
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Nhập thông tin cặp đôi, AI sẽ tạo thiệp cho bạn trong vài giây
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#EADBC8] p-6 space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên chú rể *</label>
              <input
                name="groomName"
                value={form.groomName}
                onChange={handleChange}
                required
                placeholder="Nguyễn Văn Nam"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tên cô dâu *</label>
              <input
                name="brideName"
                value={form.brideName}
                onChange={handleChange}
                required
                placeholder="Trần Thị Linh"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ngày cưới *</label>
              <input
                type="date"
                name="weddingDate"
                value={form.weddingDate}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Giờ tổ chức</label>
              <input
                type="time"
                name="weddingTime"
                value={form.weddingTime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Địa điểm *</label>
            <input
              name="venue"
              value={form.venue}
              onChange={handleChange}
              required
              placeholder="Nhà hàng Tiệc Cưới Hoa Hồng, 123 Nguyễn Huệ, TP.HCM"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C]"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Phong cách</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, style: s.value }))}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg border text-xs transition-colors ${
                    form.style === s.value
                      ? "border-[#C9956C] bg-[#FDF0E8] text-[#C9956C] font-medium"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg mb-0.5">{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional info */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Thông tin thêm <span className="text-gray-400">(tuỳ chọn)</span>
            </label>
            <textarea
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleChange}
              rows={2}
              placeholder="Ví dụ: tiệc ngoài trời, chủ đề hoa cưới màu trắng..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C9956C] resize-none"
            />
          </div>

          {/* Warning */}
          {warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
              ⚠️ {warning}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C9956C] hover:bg-[#b8845b] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI đang tạo thiệp...
              </>
            ) : (
              "✨ Tạo thiệp ngay"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Bạn có thể chỉnh sửa thiệp sau khi AI tạo xong
        </p>
      </div>
    </div>
  );
}
