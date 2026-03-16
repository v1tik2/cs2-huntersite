import type React from "react";
import AccountTabs from "@/components/profile/AccountTabs";
import { cookies, headers } from "next/headers";

type Lang = "uk" | "en";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const lang = params.lang;
  const locale = lang === "uk" ? "uk-UA" : "en-US";

  const steam = cookies().get("steam");
  if (!steam) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <a
          href={`/api/auth/steam?next=/${lang}/account/stats`}
          className="rounded-full bg-[#1b2838] px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-[#243447]"
        >
          {lang === "uk" ? "Увійти через Steam" : "Sign in with Steam"}
        </a>
      </div>
    );
  }

  const hdrs = headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");

  let user: {
    id?: string;
    name?: string;
    avatarUrl?: string;
    steamUrl?: string;
    faceitUrl?: string;
    isOnline?: boolean;
    registeredAt?: string | null;
    lastSeenAt?: string | null;
  } | null = null;

  let stats: {
    level?: number;
    playHours?: number;
    kills?: number;
  } | null = null;

  if (baseUrl) {
    const cookieHeader = cookies().toString();

    const res = await fetch(`${baseUrl}/api/me`, {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    });

    user = res.ok ? await res.json() : null;

    if (user?.id) {
      const statsRes = await fetch(
        `${baseUrl}/api/profile-stats?lang=${lang}&steamId=${user.id}`,
        {
          cache: "no-store",
          headers: {
            Cookie: cookieHeader,
          },
        }
      );
      stats = statsRes.ok ? await statsRes.json() : null;
    }
  }

  const nickname = user?.name || user?.id || "Player";
  const avatar =
    user?.avatarUrl ||
    "https://avatars.fastly.steamstatic.com/0000000000000000000000000000000000000000_full.jpg";

  const steamUrl =
    user?.steamUrl ||
    (user?.id ? `https://steamcommunity.com/profiles/${user.id}` : "#");
  const faceitUrl =
    user?.faceitUrl ||
    `https://www.faceit.com/en/players?query=${encodeURIComponent(nickname)}`;

  const statusText = user?.isOnline
    ? lang === "uk"
      ? "Онлайн"
      : "Online"
    : user?.lastSeenAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(user.lastSeenAt))
    : lang === "uk"
    ? "немає даних"
    : "no data";

  const level = stats?.level ?? 0;
  const xpMax = Math.max(1000, (level || 1) * 4000);
  const xpRaw = (stats?.playHours ?? 0) * 120 + (stats?.kills ?? 0) * 2;
  const xp = Math.max(0, Math.min(xpMax, xpRaw % xpMax));
  const xpPct = Math.max(0, Math.min(100, Math.round((xp / xpMax) * 100)));
  const formatNum = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#111821] to-[#0b1118] ring-1 ring-white/10">
        <div className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt={user?.name ? `${user.name} avatar` : "Steam avatar"}
                className="h-16 w-16 rounded-2xl bg-white/10 object-cover ring-1 ring-white/15"
              />

              <div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-semibold text-white">{nickname}</div>
                  <div className="text-xs text-white/60">
                    {lang === "uk" ? "Був(ла) в грі" : "Last seen"} • {statusText}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="h-2 w-[420px] max-w-[70vw] overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                    <div className="h-full rounded-full bg-white/70" style={{ width: `${xpPct}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-white/70">
                    <span className="font-semibold text-white">{formatNum(xp)}</span> / {formatNum(xpMax)} XP{" "}
                    <span className="text-white/50">
                      ({lang === "uk" ? "Рівень" : "Level"} {level})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-wrap items-center justify-end gap-2">
              <a
                href={steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
              >
                {lang === "uk" ? "Профіль Steam" : "Steam profile"}
              </a>

              <a
                href={faceitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
              >
                {lang === "uk" ? "Профіль Faceit" : "Faceit profile"}
              </a>
              </div>
              <div className="text-xs text-white/60">
                {lang === "uk" ? "Дата реєстрації" : "Registration date"}:{" "}
                {user?.registeredAt
                  ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                      new Date(user.registeredAt)
                    )
                  : lang === "uk"
                  ? "немає даних"
                  : "no data"}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/10 px-4 py-3">
          <AccountTabs lang={lang} />
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
