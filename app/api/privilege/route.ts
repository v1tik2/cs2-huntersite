import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setPrivilegeBySteamId, getPrivilegeBySteamId, type PrivilegeTier } from "@/lib/server/privilegeStore";

export const runtime = "nodejs";

function getSteamIdFromCookie() {
  const steamCookie = cookies().get("steam")?.value;
  if (!steamCookie) return null;
  return steamCookie.split(".")[0] ?? null;
}

export async function GET() {
  const steamId = getSteamIdFromCookie();
  if (!steamId) return NextResponse.json(null, { status: 401 });

  const privilege = await getPrivilegeBySteamId(steamId);
  return NextResponse.json(privilege);
}

export async function POST(req: Request) {
  const steamId = getSteamIdFromCookie();
  if (!steamId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | {
        tier?: PrivilegeTier;
        titleUk?: string;
        titleEn?: string;
        durationUk?: string;
        durationEn?: string;
      }
    | null;

  if (!body?.tier || !body.titleUk || !body.titleEn || !body.durationUk || !body.durationEn) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!["lite", "premium", "elite"].includes(body.tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const saved = await setPrivilegeBySteamId(steamId, {
    tier: body.tier,
    titleUk: body.titleUk,
    titleEn: body.titleEn,
    durationUk: body.durationUk,
    durationEn: body.durationEn,
    activatedAt: Date.now(),
  });

  return NextResponse.json(saved);
}
