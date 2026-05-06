import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto py-20">
        <h1 className="text-5xl font-serif font-bold text-[#5C3D2E] mb-4 leading-tight">
          Tạo thiệp cưới online
          <br />
          <span className="text-[#C9956C]">trong 3 phút</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Không cần kỹ năng thiết kế. Chỉ cần nhập tên và để AI làm phần còn lại.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/templates"
            className="bg-[#C9956C] hover:bg-[#b8845b] text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Tạo thiệp ngay
          </Link>
          <Link
            href="/demo"
            className="border border-[#C9956C] text-[#C9956C] hover:bg-[#C9956C] hover:text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Xem demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pb-20 w-full">
        {[
          {
            icon: "✨",
            title: "AI tạo nội dung",
            desc: "Chỉ nhập tên cặp đôi, AI sẽ viết toàn bộ nội dung thiệp",
          },
          {
            icon: "🎨",
            title: "Chỉnh sửa dễ dàng",
            desc: "Kéo thả, chỉnh màu sắc, font chữ theo ý muốn",
          },
          {
            icon: "🔗",
            title: "Chia sẻ qua link",
            desc: "Gửi link thiệp cho khách mời, không cần in ấn",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-6 shadow-sm text-center"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-[#5C3D2E] mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer branding */}
      <footer className="text-center text-gray-400 text-sm pb-8">
        © 2026 WeddingCard · Tạo thiệp cưới đẹp, nhanh, dễ
      </footer>
    </main>
  );
}
