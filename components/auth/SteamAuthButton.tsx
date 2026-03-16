"use client";

import { useEffect, useState } from "react";

type MeResponse = { ok: boolean; steamId: string | null };

export function SteamAuthButton() {
  const [steamId, setSteamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = (await res.json()) as MeResponse;
      setSteamId(data.steamId ?? null);
    } catch {
      setSteamId(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10">
        Loading...
      </button>
    );
  }

  if (!steamId) {
    return (
      <a
        href="/api/auth/steam"
        className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15 hover:text-white transition"
      >
        Login with Steam
      </a>
    );
  }

  return (
    <a
      href="/api/auth/logout"
      className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 hover:bg-white/15 hover:text-white transition"
      title={steamId}
    >
      Logout
    </a>
  );
}
