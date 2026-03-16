import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPrivilegeBySteamId } from "@/lib/server/privilegeStore";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.STEAM_API_KEY;
  const steamCookie = cookies().get("steam")?.value;
  const siteRegisteredAt = cookies().get("site_registered_at")?.value ?? null;

  if (!apiKey || !steamCookie) {
    return NextResponse.json(null, { status: 401 });
  }

  const steamId = steamCookie.split(".")[0];

  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
  );

  const data = await res.json();
  const player = data?.response?.players?.[0];

  if (!player) {
    return NextResponse.json(null, { status: 404 });
  }
  const privilege = await getPrivilegeBySteamId(player.steamid);

  let faceitUrl: string | null = null;
  const faceitApiKey = process.env.FACEIT_API_KEY;
  const authHeaders = faceitApiKey
    ? {
        Authorization: `Bearer ${faceitApiKey}`,
        Accept: "application/json",
      }
    : null;

  const pickFaceitUrl = (value: any): string | null => {
    if (!value) return null;
    if (typeof value === "string" && value.includes("faceit.com")) return value;
    if (typeof value === "object") {
      if (typeof value.faceit === "string" && value.faceit.includes("faceit.com")) {
        return value.faceit;
      }
      if (typeof value.cs2 === "string" && value.cs2.includes("faceit.com")) {
        return value.cs2;
      }
      if (typeof value.csgo === "string" && value.csgo.includes("faceit.com")) {
        return value.csgo;
      }
    }
    return null;
  };

  // Try to resolve Faceit profile by SteamID if FACEIT_API_KEY is configured.
  if (authHeaders) {
    const tryFaceit = async (game: "cs2" | "csgo") => {
      const url = `https://open.faceit.com/data/v4/players?game=${game}&game_player_id=${steamId}`;
      const resp = await fetch(url, {
        headers: authHeaders,
        cache: "no-store",
      });

      if (!resp.ok) return null;
      const json = await resp.json();
      return (
        pickFaceitUrl(json?.faceit_url) ||
        pickFaceitUrl(json?.faceitUrl) ||
        null
      );
    };

    try {
      faceitUrl = (await tryFaceit("cs2")) || (await tryFaceit("csgo"));
    } catch {
      faceitUrl = null;
    }
  }

  // Fallback: find player by nickname in Faceit search, then resolve exact profile url.
  if (!faceitUrl && authHeaders) {
    try {
      const q = encodeURIComponent(player.personaname || "");
      const searchRes = await fetch(
        `https://open.faceit.com/data/v4/search/players?nickname=${q}&offset=0&limit=20`,
        {
          headers: authHeaders,
          cache: "no-store",
        }
      );

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        const items = Array.isArray(searchJson?.items) ? searchJson.items : [];
        const nicknameLower = String(player.personaname || "").toLowerCase();

        const exact =
          items.find(
            (it: any) => String(it?.nickname || "").toLowerCase() === nicknameLower
          ) || items[0];

        const playerId = exact?.player_id;
        if (playerId) {
          const byIdRes = await fetch(
            `https://open.faceit.com/data/v4/players/${playerId}`,
            {
              headers: authHeaders,
              cache: "no-store",
            }
          );

          if (byIdRes.ok) {
            const byIdJson = await byIdRes.json();
            faceitUrl =
              pickFaceitUrl(byIdJson?.faceit_url) ||
              pickFaceitUrl(byIdJson?.faceitUrl) ||
              `https://www.faceit.com/en/players/${encodeURIComponent(
                byIdJson?.nickname || player.personaname || player.steamid
              )}`;
          }
        }
      }
    } catch {
      faceitUrl = null;
    }
  }

  // Final fallback to Faceit search page by nickname.
  if (!faceitUrl) {
    faceitUrl = `https://www.faceit.com/en/players?query=${encodeURIComponent(
      player.personaname || player.steamid
    )}`;
  }

  return NextResponse.json({
    id: player.steamid,
    name: player.personaname,
    avatarUrl: player.avatarfull,
    steamUrl: player.profileurl || `https://steamcommunity.com/profiles/${player.steamid}`,
    faceitUrl,
    isOnline: (player.personastate ?? 0) > 0,
    registeredAt: siteRegisteredAt,
    lastSeenAt:
      typeof player.lastlogoff === "number" && player.lastlogoff > 0
        ? new Date(player.lastlogoff * 1000).toISOString()
        : null,
    countryCode: player.loccountrycode ?? null,
    balance: 760,
    privilege,
  });
}
