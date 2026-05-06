import Link from "next/link";

// Hardcoded templates cho Phase 1 — sẽ load từ API ở Phase 2
const TEMPLATES = [
  {
    id: "template_romantic_beige",
    name: "Romantic Beige",
    thumbnail: "/templates/romantic-beige.jpg",
    isPremium: false,
    primaryColor: "#EADBC8",
  },
  {
    id: "template_modern_minimal",
    name: "Modern Minimal",
    thumbnail: "/templates/modern-minimal.jpg",
    isPremium: false,
    primaryColor: "#F5F5F5",
  },
  {
    id: "template_floral_garden",
    name: "Floral Garden",
    thumbnail: "/templates/floral-garden.jpg",
    isPremium: false,
    primaryColor: "#E8F5E9",
  },
  {
    id: "template_luxury_gold",
    name: "Luxury Gold",
    thumbnail: "/templates/luxury-gold.jpg",
    isPremium: true,
    primaryColor: "#FFF8E1",
  },
  {
    id: "template_dark_romance",
    name: "Dark Romance",
    thumbnail: "/templates/dark-romance.jpg",
    isPremium: true,
    primaryColor: "#1A1A2E",
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-[#5C3D2E] mb-2">
            Chọn template
          </h1>
          <p className="text-gray-500">
            Chọn một mẫu thiệp để bắt đầu. Bạn có thể chỉnh sửa mọi thứ sau.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail placeholder */}
              <div
                className="h-48 flex items-center justify-center text-4xl"
                style={{ backgroundColor: t.primaryColor }}
              >
                💍
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#5C3D2E]">{t.name}</h3>
                  {t.isPremium && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                </div>
                <Link
                  href={`/editor/new?templateId=${t.id}`}
                  className="block w-full text-center bg-[#C9956C] hover:bg-[#b8845b] text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                >
                  Dùng template này
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
