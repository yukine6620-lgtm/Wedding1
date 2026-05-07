"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useInvitationStore } from "@/store/invitationStore";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { invitations, isLoading, fetchMyInvitations } = useInvitationStore();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchMyInvitations();
  }, [fetchMyInvitations, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-[#5C3D2E] text-xl">
          WeddingCard
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-[#5C3D2E]">
            Thiệp của tôi
          </h1>
          <div className="flex gap-2">
            <Link
              href="/editor/ai-generate"
              className="border border-[#C9956C] text-[#C9956C] hover:bg-[#FDF0E8] text-sm font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1"
            >
              ✨ Tạo bằng AI
            </Link>
            <Link
              href="/templates"
              className="bg-[#C9956C] hover:bg-[#b8845b] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
            >
              + Tạo thiệp mới
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Đang tải...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💌</div>
            <p className="text-gray-500 mb-4">Bạn chưa có thiệp nào</p>
            <Link
              href="/templates"
              className="text-[#C9956C] hover:underline font-medium"
            >
              Tạo thiệp đầu tiên →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#5C3D2E]">{inv.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">/{inv.slug}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inv.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : inv.status === "Paid"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inv.status === "Draft"
                      ? "Nháp"
                      : inv.status === "Published"
                      ? "Đã đăng"
                      : "Đã thanh toán"}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/editor/${inv.id}`}
                    className="flex-1 text-center text-sm border border-[#C9956C] text-[#C9956C] hover:bg-[#C9956C] hover:text-white py-1.5 rounded-lg transition-colors"
                  >
                    Chỉnh sửa
                  </Link>
                  <Link
                    href={`/${inv.slug}`}
                    target="_blank"
                    className="flex-1 text-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded-lg transition-colors"
                  >
                    Xem thiệp
                  </Link>
                  {inv.status !== "Paid" && (
                    <Link
                      href={`/payment?invitationId=${inv.id}`}
                      className="flex-1 text-center text-sm bg-[#C9956C] hover:bg-[#b8845b] text-white py-1.5 rounded-lg transition-colors"
                    >
                      Publish
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
