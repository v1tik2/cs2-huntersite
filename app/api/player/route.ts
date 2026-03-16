import { NextResponse } from "next/server";
import { getPrivilegeBySteamId } from "@/lib/server/privilegeStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const apiKey = process.env.STEAM_API_KEY;
  const { searchParams } = new URL(req.url);
  const steamId = searchParams.get("steamId");

  if (!apiKey || !steamId) {
    return NextResponse.json(null, { status: 400 });
  }

  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return NextResponse.json(null, { status: 502 });
  }

  const data = await res.json();
  const player = data?.response?.players?.[0];

  if (!player) {
    return NextResponse.json(null, { status: 404 });
  }
  const privilege = await getPrivilegeBySteamId(player.steamid);

  return NextResponse.json({
    id: player.steamid,
    name: player.personaname,
    avatarUrl: player.avatarfull,
    steamUrl: player.profileurl || `https://steamcommunity.com/profiles/${player.steamid}`,
    // Faceit for foreign profile: keep deterministic fallback.
    faceitUrl: `https://www.faceit.com/en/players?query=${encodeURIComponent(
      player.personaname || player.steamid
    )}`,
    isOnline: (player.personastate ?? 0) > 0,
    // Registration date on this site is unknown here without DB linkage.
    registeredAt: null,
    lastSeenAt:
      typeof player.lastlogoff === "number" && player.lastlogoff > 0
        ? new Date(player.lastlogoff * 1000).toISOString()
        : null,
    countryCode: player.loccountrycode ?? null,
    privilege,
  });
}
