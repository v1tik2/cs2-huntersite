import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPrivilegesBySteamIds } from "@/lib/server/privilegeStore";

export const runtime = "nodejs";

type SteamFriend = { steamid: string; friend_since?: number };

type SteamPlayer = {
  steamid: string;
  personaname: string;
  avatarfull: string;
  personastate?: number;
  gameextrainfo?: string;
  gameserverip?: string;
};

type SiteServer = { address: string; name: string };

const SITE_SERVERS: SiteServer[] = [
  { address: "128.140.44.12:27015", name: "Lobby / Hub" },
  { address: "65.21.92.33:27016", name: "DM Warmup" },
  { address: "157.90.129.5:27015", name: "Competitive 5v5" },
];

function hashSteamId(steamId: string) {
  let h = 0;
  for (let i = 0; i < steamId.length; i += 1) {
    h = (h * 31 + steamId.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildSitePresence(steamId: string) {
  const hash = hashSteamId(steamId);
  const isRegisteredOnSite = hash % 3 === 0;

  if (!isRegisteredOnSite) {
    return {
      isRegisteredOnSite,
      isOnlineOnSite: false,
      lastSeenOnSite: null as string | null,
      siteServerName: null as string | null,
      siteServerAddress: null as string | null,
    };
  }

  const isOnlineOnSite = hash % 5 === 0;
  const hoursAgo = (hash % 72) + 1;
  const lastSeenOnSite = isOnlineOnSite
    ? new Date().toISOString()
    : new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  const siteServer = isOnlineOnSite ? SITE_SERVERS[hash % SITE_SERVERS.length] : null;

  return {
    isRegisteredOnSite,
    isOnlineOnSite,
    lastSeenOnSite,
    siteServerName: siteServer?.name ?? null,
    siteServerAddress: siteServer?.address ?? null,
  };
}

function buildSteamServer(p: SteamPlayer) {
  if (!p.gameserverip) {
    return { steamServerName: null as string | null, steamServerAddress: null as string | null };
  }

  return {
    steamServerName: p.gameextrainfo ? `${p.gameextrainfo} server` : "Steam server",
    steamServerAddress: p.gameserverip,
  };
}

export async function GET(req: Request) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "STEAM_API_KEY missing" }, { status: 500 });
  }

  const steamCookie = cookies().get("steam")?.value;
  if (!steamCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";

  const steamId = steamCookie.split(".")[0];

  const friendsRes = await fetch(
    `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apiKey}&steamid=${steamId}&relationship=friend`,
    { cache: "no-store" }
  );

  const friendsData = await friendsRes.json();
  const friends = (friendsData?.friendslist?.friends ?? []) as SteamFriend[];

  if (!friends.length) {
    return NextResponse.json([]);
  }

  const friendSinceById = new Map<string, number>();
  for (const friend of friends) {
    friendSinceById.set(friend.steamid, friend.friend_since ?? 0);
  }

  const ids = friends.map((f) => f.steamid).join(",");

  const playersRes = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${ids}`,
    { cache: "no-store" }
  );

  const playersData = await playersRes.json();
  const players = (playersData?.response?.players ?? []) as SteamPlayer[];

  const allFriends = players.map((p) => {
    const presence = buildSitePresence(p.steamid);
    const steamServer = buildSteamServer(p);

    return {
      steamId: p.steamid,
      name: p.personaname,
      avatar: p.avatarfull,
      game: p.gameextrainfo ?? null,
      isOnlineOnSteam: (p.personastate ?? 0) > 0,
      friendSince: friendSinceById.get(p.steamid) ?? null,
      profileUrl: `https://steamcommunity.com/profiles/${p.steamid}`,
      server: steamServer.steamServerAddress,
      ...steamServer,
      ...presence,
    };
  });

  const privilegeMap = await getPrivilegesBySteamIds(allFriends.map((f) => f.steamId));
  const withPrivilege = allFriends.map((f) => ({
    ...f,
    privilege: privilegeMap[f.steamId] ?? null,
  }));

  if (all) {
    return NextResponse.json(withPrivilege);
  }

  const online = withPrivilege.filter((f) => f.isOnlineOnSteam);
  return NextResponse.json(online);
}
