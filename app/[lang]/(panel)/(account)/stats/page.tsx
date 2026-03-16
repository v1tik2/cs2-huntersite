import Link from "next/link";
import { cookies } from "next/headers";
import { StatsClient } from "@/components/profile/StatsClient";

type Lang = "uk" | "en";

type PlayerSummary = {
  steamid: string;
  personaname: string;
  avatarfull: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadPlayer(steamId: string): Promise<PlayerSummary | null> {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey || !steamId) return null;

  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return (data?.response?.players?.[0] as PlayerSummary | undefined) ?? null;
  } catch {
    return null;
  }
}

export default async function StatsPage({
  params,
  searchParams,
}: {
  params: { lang: Lang };
  searchParams?: { steamId?: string };
}) {
  const lang = params.lang;
  const targetSteamId = searchParams?.steamId?.trim() || "";

  const steam = cookies().get("steam");
  if (!steam) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <a
          href={`/api/auth/steam?next=/${lang}/stats${targetSteamId ? `?steamId=${encodeURIComponent(targetSteamId)}` : ""}`}
          className="rounded-full bg-[#1b2838] px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-[#243447]"
        >
          {lang === "uk" ? "Увійти через Steam" : "Sign in with Steam"}
        </a>
      </div>
    );
  }

  const title = lang === "uk" ? "Статистика" : "Statistics";
  const subtitle =
    lang === "uk"
      ? "Дані беруться з твого сервера (поки fallback на mock)."
      : "Data is taken from your server (currently mock fallback).";
  const topPlayers = lang === "uk" ? "Топ гравців" : "Top players";

  const viewedPlayer = targetSteamId ? await loadPlayer(targetSteamId) : null;
  const avatar =
    viewedPlayer?.avatarfull ||
    "https://avatars.fastly.steamstatic.com/0000000000000000000000000000000000000000_full.jpg";

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-transparent ring-1 ring-white/10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            {viewedPlayer ? (
              <img
                src={avatar}
                alt={viewedPlayer.personaname}
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-black/30 ring-1 ring-white/10">
                📊
              </div>
            )}

            <div>
              <div className="text-2xl font-semibold text-white">{title}</div>
              <div className="mt-1 text-sm text-white/60">
                {viewedPlayer
                  ? lang === "uk"
                    ? `Гравець: ${viewedPlayer.personaname}`
                    : `Player: ${viewedPlayer.personaname}`
                  : subtitle}
              </div>
            </div>
          </div>

          <Link
            href={`/${lang}/top-players`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-white/15 active:scale-[0.98]"
            title={topPlayers}
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-black/30 ring-1 ring-white/10">
              🏆
            </span>
            {topPlayers}
            <span className="text-white/60">→</span>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-black/20 p-4 ring-1 ring-white/10 backdrop-blur sm:p-6">
        <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="transition">
          <StatsClient lang={lang} steamId={targetSteamId || undefined} />
        </div>
      </div>
    </div>
  );
}
