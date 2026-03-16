import ProfilePageClient from "@/components/profile/ProfilePageClient";

export default function PlayerProfilePage({
  params,
}: {
  params: { lang: "uk" | "en"; steamId: string };
}) {
  return <ProfilePageClient lang={params.lang} steamId={params.steamId} />;
}

