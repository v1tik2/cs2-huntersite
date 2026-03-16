import { NextResponse } from "next/server";
import { topPlayersMock, type ModeKey } from "@/lib/topPlayersMock";
import { getPrivilegesBySteamIds } from "@/lib/server/privilegeStore";

export const runtime = "nodejs";

function isModeKey(value: string): value is ModeKey {
  return value === "dm" || value === "1x1" || value === "5x5";
}

function isTopPlayersShape(value: any): value is {
  dm: Array<{ steamId: string } & Record<string, unknown>>;
  "1x1": Array<{ steamId: string } & Record<string, unknown>>;
  "5x5": Array<{ steamId: string } & Record<string, unknown>>;
} {
  if (!value || typeof value !== "object") return false;
  const keys: ModeKey[] = ["dm", "1x1", "5x5"];
  return keys.every(
    (k) => Array.isArray(value[k]) && value[k].every((r: any) => r && typeof r.steamId === "string")
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");
  const lang = searchParams.get("lang") || "uk";

  const baseUrl = process.env.TOP_PLAYERS_SERVER_URL || process.env.STATS_SERVER_URL;
  if (baseUrl) {
    try {
      const upstream = new URL("/stats/top-players", baseUrl);
      if (mode && isModeKey(mode)) upstream.searchParams.set("mode", mode);
      upstream.searchParams.set("lang", lang);

      const res = await fetch(upstream.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (isTopPlayersShape(data)) {
          const ids = Object.values(data).flatMap((rows) => rows.map((r) => r.steamId));
          const privilegeMap = await getPrivilegesBySteamIds(ids);
          const enriched = {
            dm: data.dm.map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
            "1x1": data["1x1"].map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
            "5x5": data["5x5"].map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
          };
          return NextResponse.json(enriched);
        }
        return NextResponse.json(data);
      }
    } catch {
      // fallback to local mock below
    }
  }

  // TODO: replace with real leaderboard provider when backend is ready.
  const enrich = async (data: typeof topPlayersMock) => {
    const ids = (Object.values(data).flatMap((rows) => rows.map((r) => r.steamId)));
    const privilegeMap = await getPrivilegesBySteamIds(ids);
    const out = {
      dm: data.dm.map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
      "1x1": data["1x1"].map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
      "5x5": data["5x5"].map((p) => ({ ...p, privilege: privilegeMap[p.steamId] ?? null })),
    };
    return out;
  };

  if (mode && isModeKey(mode)) {
    const enriched = await enrich(topPlayersMock);
    return NextResponse.json({ [mode]: enriched[mode] });
  }

  return NextResponse.json(await enrich(topPlayersMock));
}
