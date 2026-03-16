"use client";

import { useEffect, useState } from "react";

type MeResponse = { ok: boolean; steamId: string | null };

export function SteamAuthGate({
  loggedOut,
  loggedIn,
}: {
  loggedOut: React.ReactNode;
  loggedIn: (steamId: string) => React.ReactNode;
}) {
  const [steamId, setSteamId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        const data = (await res.json()) as MeResponse;
        setSteamId(data.steamId ?? null);
      } catch {
        setSteamId(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // щоб не мигало: поки не готово — нічого не показуємо
  if (!ready) return null;

  if (!steamId) return <>{loggedOut}</>;

  return <>{loggedIn(steamId)}</>;
}
