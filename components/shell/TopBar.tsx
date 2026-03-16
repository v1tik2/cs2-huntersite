"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserMenu } from "@/components/shell/UserMenu";

type Lang = "uk" | "en";

type User = {
  id?: string;
  name?: string;
  avatarUrl?: string;
  balance?: number;
};

type Friend = {
  steamId: string;
  name: string;
  avatar: string;
  game: string | null;
  server: string | null;
  steamServerName?: string | null;
  steamServerAddress?: string | null;
  siteServerName?: string | null;
  siteServerAddress?: string | null;
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

export function TopBar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [friendsOpen, setFriendsOpen] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const onlineFriends = friends.filter((f) =>
    Boolean(f.server || f.steamServerAddress || f.siteServerAddress)
  );

  const loadUser = async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  };

  const loadFriends = async () => {
    setFriendsLoading(true);
    try {
      const res = await fetch("/api/auth/steam/friends", { cache: "no-store" });
      if (!res.ok) {
        setFriends([]);
        return;
      }
      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch {
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (sp.get("login") === "1") {
      router.replace(pathname);
      loadUser();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, router, pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!friendsOpen) return;
      const t = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(t)) {
        setFriendsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [friendsOpen]);

  useEffect(() => {
    if (friendsOpen) loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendsOpen]);

  if (!ready) return null;

  if (!user) {
    return (
      <a
        href={`/api/auth/steam?next=/${lang}/servers`}
        className="rounded-full bg-[#1b2838] px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-[#243447]"
      >
        {lang === "uk" ? "Увійти через Steam" : "Sign in with Steam"}
      </a>
    );
  }

  const balance = user.balance ?? 760;
  const avatarUrl = user.avatarUrl ?? FALLBACK_AVATAR;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-black/30 text-[11px] font-bold text-[#f3c969] ring-1 ring-white/10">
          C
        </div>

        <div className="text-sm font-semibold text-white">{balance}</div>

        <button
          type="button"
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/15 transition hover:scale-110 hover:bg-white/20"
        >
          +
        </button>
      </div>

      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setFriendsOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-sm text-white ring-1 ring-white/10 transition hover:bg-white/10"
          title={lang === "uk" ? "Друзі" : "Friends"}
        >
          FR
        </button>

        {friendsOpen && (
          <div className="absolute right-0 mt-3 w-[340px] rounded-xl bg-[#0b1220]/95 p-3 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-white">
                {lang === "uk" ? "Друзі онлайн" : "Friends online"}
              </div>

              <button
                type="button"
                onClick={loadFriends}
                className="rounded-md px-2 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
                title={lang === "uk" ? "Оновити" : "Refresh"}
              >
                {friendsLoading ? (lang === "uk" ? "Завантаження..." : "Loading...") : "Refresh"}
              </button>
            </div>

            {friendsLoading && friends.length === 0 && (
              <div className="rounded-lg bg-white/5 px-3 py-6 text-center text-xs text-white/50 ring-1 ring-white/10">
                {lang === "uk" ? "Завантажую друзів..." : "Loading friends..."}
              </div>
            )}

            {!friendsLoading && onlineFriends.length === 0 && (
              <div className="rounded-lg bg-white/5 px-3 py-6 text-center text-xs text-white/50 ring-1 ring-white/10">
                {lang === "uk" ? "Ніхто не онлайн" : "No friends online"}
              </div>
            )}

            <div className="max-h-72 overflow-y-auto">
              {onlineFriends.map((f) => {
                const serverName =
                  f.siteServerName ||
                  f.steamServerName ||
                  (lang === "uk" ? "Поза сервером" : "Not on server");

                const connectAddress =
                  f.siteServerAddress || f.steamServerAddress || f.server;

                return (
                  <button
                    key={f.steamId}
                    type="button"
                    onClick={() => router.push(`/${lang}/profile/${f.steamId}`)}
                    className="mt-1 flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition hover:bg-white/8"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={f.avatar || FALLBACK_AVATAR}
                        className="h-9 w-9 rounded-md object-cover"
                        alt={f.name}
                      />

                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">{f.name}</div>
                        <div className="truncate text-[11px] text-white/60">{serverName}</div>
                        {f.privilege && (
                          <div className="mt-1 inline-flex rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-100 ring-1 ring-blue-300/35">
                            {lang === "uk"
                              ? `${f.privilege.titleUk ?? "Привілегія"} • ${f.privilege.durationUk ?? ""}`
                              : `${f.privilege.titleEn ?? "Privilege"} • ${f.privilege.durationEn ?? ""}`}
                          </div>
                        )}
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
                      <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/40 ring-1 ring-white/10">
                        {lang === "uk" ? "Недоступно" : "Unavailable"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xs text-white ring-1 ring-white/10 transition hover:bg-white/10"
        title={lang === "uk" ? "Сповіщення" : "Notifications"}
      >
        NT
      </button>

      <UserMenu lang={lang} avatarUrl={avatarUrl} />
    </div>
  );
}
