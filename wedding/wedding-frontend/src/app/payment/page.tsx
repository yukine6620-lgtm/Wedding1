"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentStore } from "@/store/paymentStore";
import { useInvitationStore } from "@/store/invitationStore";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invitationId = searchParams.get("invitationId");

  const { initiatePayment, isLoading, error } = usePaymentStore();
  const { fetchById, current } = useInvitationStore();

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (invitationId) {
      fetchById(invitationId);
    }
  }, [invitationId, fetchById]);

  const handlePay = async () => {
    if (!invitationId) return;

    const returnUrl = `${window.location.origin}/payment/result?invitationId=${invitationId}`;

    try {
      setRedirecting(true);
      const result = await initiatePayment(invitationId, returnUrl);
      // Redirect to MoMo payment page
      window.location.href = result.payUrl;
    } catch {
      setRedirecting(false);
    }
  };

  if (!invitationId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy thiệp.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-[#EADBC8] p-6 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-[#FDF0E8] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💍</span>
          </div>

          <h1 className="text-xl font-serif font-semibold text-[#5C3D2E] mb-1">
            Publish thiệp cưới
          </h1>

          {current && (
            <p className="text-sm text-gray-500 mb-4">
              {current.title}
            </p>
          )}

          {/* Price */}
          <div className="bg-[#FDF0E8] rounded-xl p-4 mb-5">
            <p className="text-xs text-gray-500 mb-1">Phí publish thiệp</p>
            <p className="text-3xl font-bold text-[#C9956C]">99.000₫</p>
            <p className="text-xs text-gray-400 mt-1">Thanh toán một lần, dùng mãi mãi</p>
          </div>

          {/* Features */}
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            {[
              "Link thiệp riêng (yourname.wedding)",
              "Nhận RSVP từ khách mời",
              "Không giới hạn lượt xem",
              "Hỗ trợ chia sẻ mạng xã hội",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={isLoading || redirecting}
            className="w-full bg-[#C9956C] hover:bg-[#b8845b] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {redirecting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Đang chuyển đến MoMo...
              </>
            ) : (
              "Thanh toán qua MoMo"
            )}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
