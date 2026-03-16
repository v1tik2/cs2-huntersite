"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

type Lang = "uk" | "en";

type Friend = {
  steamId: string;
  name: string;
  avatar: string;
  game: string | null;
  isOnlineOnSteam: boolean;
  isRegisteredOnSite: boolean;
  isOnlineOnSite: boolean;
  lastSeenOnSite: string | null;
  siteServerName: string | null;
  siteServerAddress: string | null;
  steamServerName: string | null;
  steamServerAddress: string | null;
  profileUrl: string;
  privilege?: {
    tier?: "lite" | "premium" | "elite";
    titleUk?: string;
    titleEn?: string;
    durationUk?: string;
    durationEn?: string;
  } | null;
};

const FALLBACK_AVATAR =
  "https://avatars.fastly.steamstatic.com/0000000000000000000000000000000000000000_full.jpg";

export default function FriendsPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const lang = params.lang;
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/steam/friends?all=1", { cache: "no-store" });
        const data = res.ok ? await res.json() : [];
        if (active) setFriends(Array.isArray(data) ? data : []);
      } catch {
        if (active) setFriends([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const registered = useMemo(() => friends.filter((f) => f.isRegisteredOnSite), [friends]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registered;
    return registered.filter((f) => f.name.toLowerCase().includes(q));
  }, [registered, query]);

  const registeredOnline = useMemo(() => filtered.filter((f) => f.isOnlineOnSite), [filtered]);
  const registeredOffline = useMemo(() => filtered.filter((f) => !f.isOnlineOnSite), [filtered]);

  return (
    <div className="space-y-4">
      <Section
        title={lang === "uk" ? "Друзі зі Steam, зареєстровані на сайті" : "Steam friends registered on site"}
        subtitle={
          lang === "uk"
            ? `Показано: ${filtered.length} з ${registered.length}`
            : `Showing: ${filtered.length} of ${registered.length}`
        }
        lang={lang}
        loading={loading}
        empty={lang === "uk" ? "Поки немає друзів, зареєстрованих на сайті." : "No friends registered on site yet."}
      >
        <div className="mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "uk" ? "Пошук по ніку..." : "Search by nickname..."}
            className="w-full rounded-lg bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none transition focus:ring-white/20"
          />
        </div>

        <Group
          title={lang === "uk" ? "Онлайн на сайті" : "Online on site"}
          count={registeredOnline.length}
          lang={lang}
        >
          {registeredOnline.map((friend) => (
            <FriendCard key={`reg-on-${friend.steamId}`} friend={friend} lang={lang} />
          ))}
        </Group>

        <Group
          title={lang === "uk" ? "Не в мережі" : "Offline"}
          count={registeredOffline.length}
          lang={lang}
        >
          {registeredOffline.map((friend) => (
            <FriendCard key={`reg-off-${friend.steamId}`} friend={friend} lang={lang} />
          ))}
        </Group>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  lang,
  loading,
  empty,
  children,
}: {
  title: string;
  subtitle: string;
  lang: Lang;
  loading: boolean;
  empty: string;
  children: React.ReactNode;
}) {
  const hasItems = Array.isArray(children) ? children.some(Boolean) : Boolean(children);

  return (
    <section className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
        <p className="mt-1 text-xs text-white/60">{subtitle}</p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-black/20 px-4 py-5 text-sm text-white/60 ring-1 ring-white/10">
          {lang === "uk" ? "Завантаження..." : "Loading..."}
        </div>
      ) : hasItems ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <div className="rounded-xl bg-black/20 px-4 py-5 text-sm text-white/60 ring-1 ring-white/10">{empty}</div>
      )}
    </section>
  );
}

function Group({
  title,
  count,
  lang,
  children,
}: {
  title: string;
  count: number;
  lang: Lang;
  children: React.ReactNode;
}) {
  const rows = Array.isArray(children) ? children : [children];
  if (!count) return null;

  return (
    <div className="rounded-xl bg-black/20 p-3 ring-1 ring-white/10">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-white/80">{title}</div>
        <div className="text-[11px] text-white/50">
          {lang === "uk" ? "Кількість" : "Count"}: {count}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">{rows}</div>
    </div>
  );
}

function FriendCard({ friend, lang }: { friend: Friend; lang: Lang }) {
  const connectAddress = friend.siteServerAddress || friend.steamServerAddress;
  const serverName =
    friend.siteServerName ||
    friend.steamServerName ||
    (lang === "uk" ? "Зараз не на сервері" : "Not on a server now");

  const openProfile = () => {
    window.location.href = `/${lang}/profile/${friend.steamId}`;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProfile();
        }
      }}
      className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2.5 py-2 ring-1 ring-white/10 transition hover:bg-white/10"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src={friend.avatar || FALLBACK_AVATAR}
          alt={friend.name}
          className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/15"
        />

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{friend.name}</div>
          <div className="truncate text-[11px] text-white/65">{serverName}</div>
          {friend.privilege && (
            <div className="mt-1 inline-flex rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-100 ring-1 ring-blue-300/35">
              {lang === "uk"
                ? `${friend.privilege.titleUk ?? "Привілегія"} • ${friend.privilege.durationUk ?? ""}`
                : `${friend.privilege.titleEn ?? "Privilege"} • ${friend.privilege.durationEn ?? ""}`}
            </div>
          )}
          <div className="truncate text-[11px] text-white/50">
            {lang === "uk" ? "Останній вхід" : "Last seen"}: {formatLastSeen(friend.lastSeenOnSite, friend.isOnlineOnSite, lang)}
          </div>
        </div>
      </div>

      {connectAddress ? (
        <a
          href={`steam://connect/${connectAddress}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 rounded-md bg-green-600/20 px-2.5 py-1 text-[11px] font-semibold text-green-300 ring-1 ring-green-500/30 transition hover:bg-green-600/30"
        >
          {lang === "uk" ? "Підключитись" : "Connect"}
        </a>
      ) : (
        <span className="shrink-0 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-white/40 ring-1 ring-white/10">
          {lang === "uk" ? "Недоступно" : "Unavailable"}
        </span>
      )}
    </div>
  );
}

function formatLastSeen(value: string | null, isOnline: boolean, lang: Lang) {
  if (isOnline) return lang === "uk" ? "зараз онлайн" : "online now";
  if (!value) return lang === "uk" ? "немає даних" : "no data";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return lang === "uk" ? "немає даних" : "no data";

  return new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
