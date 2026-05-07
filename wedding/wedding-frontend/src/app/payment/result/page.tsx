"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInvitationStore } from "@/store/invitationStore";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get("invitationId");
  const resultCode = searchParams.get("resultCode"); // MoMo returns this

  const { fetchById, current } = useInvitationStore();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    const check = async () => {
      if (!invitationId) {
        setStatus("failed");
        return;
      }

      // Poll invitation status (MoMo webhook may take a moment)
      let attempts = 0;
      const maxAttempts = 5;

      const poll = async () => {
        const inv = await fetchById(invitationId);
        if (inv?.status === "Paid") {
          setStatus("success");
          return;
        }
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1500);
        } else {
          // resultCode 0 = success from MoMo redirect
          setStatus(resultCode === "0" ? "success" : "failed");
        }
      };

      await poll();
    };

    check();
  }, [invitationId, resultCode, fetchById]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-[#C9956C] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-500 text-sm">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#EADBC8] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h1 className="text-xl font-serif font-semibold text-[#5C3D2E] mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Thiệp cưới của bạn đã được publish. Chia sẻ link với khách mời ngay nhé!
          </p>

          {current?.slug && (
            <div className="bg-[#FDF0E8] rounded-lg px-4 py-3 mb-5 text-sm font-mono text-[#C9956C] break-all">
              {typeof window !== "undefined" ? window.location.origin : ""}/{current.slug}
            </div>
          )}

          <div className="space-y-2">
            {current?.slug && (
              <button
                onClick={() => router.push(`/${current.slug}`)}
                className="w-full bg-[#C9956C] hover:bg-[#b8845b] text-white font-semibold py-2.5 rounded-xl transition-colors"
              >
                Xem thiệp
              </button>
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors"
            >
              Về Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#EADBC8] p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">😔</span>
        </div>
        <h1 className="text-xl font-serif font-semibold text-[#5C3D2E] mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Giao dịch không thành công. Vui lòng thử lại.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => router.back()}
            className="w-full bg-[#C9956C] hover:bg-[#b8845b] text-white font-semibold py-2.5 rounded-xl transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors"
          >
            Về Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
