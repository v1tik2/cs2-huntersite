import { cookies } from "next/headers";
import { SkinchangerClient } from "@/components/skinchanger/SkinchangerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SkinchangerPage({
  params,
}: {
  params: { lang: "uk" | "en" };
}) {
  const lang = params.lang;

  // ✅ auth guard
  const steam = cookies().get("steam");
  if (!steam) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <a
          href={`/api/auth/steam?next=/${lang}/skinchanger`}
          className="rounded-full bg-[#1b2838] px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-[#243447]"
        >
          {lang === "uk" ? "Увійти через Steam" : "Sign in with Steam"}
        </a>
      </div>
    );
  }

  return <SkinchangerClient />;
}
