import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  const next = url.searchParams.get("next") || "/uk/servers";
  const safeNext = next.startsWith("/") ? next : "/uk/servers";

  const returnTo = `${baseUrl}/api/auth/steam/callback?next=${encodeURIComponent(safeNext)}`;
  const realm = baseUrl;

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });

  return NextResponse.redirect(
    `https://steamcommunity.com/openid/login?${params.toString()}`
  );
}
