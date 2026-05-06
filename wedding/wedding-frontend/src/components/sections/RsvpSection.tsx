"use client";

import type { InvitationSection } from "@/types";

interface Props {
  section: InvitationSection;
  isEditing?: boolean;
}

export default function RsvpSection({ section, isEditing }: Props) {
  return (
    <div className="py-12 px-6 text-center">
      <h2 className="text-2xl font-serif font-semibold text-[#5C3D2E] mb-4">
        Xác nhận tham dự
      </h2>
      {isEditing ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-gray-400 text-sm">
          Form RSVP sẽ hiển thị trên trang thiệp public
        </div>
      ) : (
        <div className="max-w-sm mx-auto space-y-3">
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]"
            placeholder="Họ và tên"
          />
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]"
            placeholder="Số điện thoại"
          />
          <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#C9956C]">
            <option value="Attending">Tôi sẽ tham dự</option>
            <option value="NotAttending">Tôi không thể tham dự</option>
            <option value="Maybe">Có thể tham dự</option>
          </select>
          <button className="w-full bg-[#C9956C] hover:bg-[#b8845b] text-white font-semibold py-2.5 rounded-lg transition-colors">
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
}
