import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { InvitationDto, InvitationSchema } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5185";

async function getInvitation(slug: string): Promise<InvitationDto | null> {
  try {
    const res = await fetch(`${API_URL}/api/invitations/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation) return { title: "Thiệp cưới" };
  return {
    title: invitation.title,
    description: `Bạn được mời tham dự ${invitation.title}`,
    openGraph: {
      title: invitation.title,
      description: `Bạn được mời tham dự ${invitation.title}`,
    },
  };
}

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  if (!invitation) notFound();

  let schema: InvitationSchema | null = null;
  try {
    schema = JSON.parse(invitation.jsonData);
  } catch {
    schema = null;
  }

  const theme = schema?.theme ?? { primaryColor: "#EADBC8", font: "Playfair Display" };
  const sections = schema?.sections ?? [];

  return (
    <main
      className="min-h-screen"
      style={{
        fontFamily: theme.font,
        backgroundColor: theme.primaryColor + "22",
      }}
    >
      <div className="max-w-2xl mx-auto py-12 px-4">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: theme.primaryColor }}>
              {invitation.title}
            </h1>
            <p className="text-gray-500">Thiệp đang được chuẩn bị...</p>
          </div>
        ) : (
          sections.map((section) => (
            <PublicSectionRenderer key={section.id} section={section} theme={theme} />
          ))
        )}
      </div>

      {/* Viral loop branding */}
      <div className="text-center py-6 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-400">
          Thiệp được tạo bởi{" "}
          <a href="/" className="text-[#C9956C] hover:underline font-medium">
            WeddingCard
          </a>
          {" · "}
          <a href="/templates" className="text-[#C9956C] hover:underline">
            Tạo thiệp giống vậy →
          </a>
        </p>
      </div>
    </main>
  );
}

function PublicSectionRenderer({
  section,
  theme,
}: {
  section: InvitationSchema["sections"][0];
  theme: InvitationSchema["theme"];
}) {
  const data = section.data;

  switch (section.type) {
    case "hero":
      return (
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold mb-3" style={{ color: theme.primaryColor }}>
            {String(data.title ?? "")}
          </h1>
          <p className="text-xl text-gray-600 mb-3">{String(data.subtitle ?? "")}</p>
          {data.date != null && data.date !== "" && (
            <p className="text-lg font-medium text-gray-500">{String(data.date)}</p>
          )}
        </div>
      );

    case "story":
      return (
        <div className="py-10 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Câu chuyện của chúng tôi
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
            {String(data.content ?? "")}
          </p>
        </div>
      );

    case "event":
      return (
        <div className="py-10 text-center bg-white rounded-2xl px-6 my-4 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Thông tin tiệc cưới
          </h2>
          {data.time != null && data.time !== "" && <p className="text-gray-600 mb-2">🕐 {String(data.time)}</p>}
          {data.location != null && data.location !== "" && <p className="text-gray-600 mb-2">📍 {String(data.location)}</p>}
          {data.mapUrl != null && data.mapUrl !== "" && (
            <a
              href={String(data.mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#C9956C] hover:underline"
            >
              Xem bản đồ →
            </a>
          )}
        </div>
      );

    case "gallery": {
      const images = Array.isArray(data.images) ? data.images as string[] : [];
      return images.length > 0 ? (
        <div className="py-10">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
            Khoảnh khắc của chúng tôi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null;
    }

    case "rsvp":
      return (
        <div className="py-10 text-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Xác nhận tham dự
          </h2>
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
              <option>Tôi sẽ tham dự</option>
              <option>Tôi không thể tham dự</option>
              <option>Có thể tham dự</option>
            </select>
            <button
              className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}
