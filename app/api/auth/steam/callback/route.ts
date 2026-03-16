import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export const runtime = "nodejs";

function extractSteamId(claimedId: string) {
  const m = claimedId.match(/\/openid\/id\/(\d+)$/);
  return m?.[1] ?? null;
}

function safeNextPath(raw: string | null | undefined) {
  const fallback = "/uk/servers";
  const next = raw || fallback;
  if (!next.startsWith("/") || next.startsWith("//")) return fallback;
  return next;
}

function getCookieFromHeader(rawCookie: string | null, name: string) {
  if (!rawCookie) return null;
  const parts = rawCookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part) continue;
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    if (key !== name) continue;
    return decodeURIComponent(part.slice(eq + 1));
  }
  return null;
}

async function handle(
  params: URLSearchParams,
  origin: string,
  existingRegisteredAt: string | null
) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "AUTH_SECRET missing" },
      { status: 500 }
    );
  }

  // ✅ В DEV не чіпаємо NEXT_PUBLIC_BASE_URL щоб не було localhost vs 127.0.0.1
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL || origin
      : origin;

  // validate OpenID response with Steam
  params.set("openid.mode", "check_authentication");

  const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const text = await verifyRes.text();
  const isValid = text.includes("is_valid:true");

  if (!isValid) return NextResponse.redirect(new URL("/?login=failed", baseUrl));

  const claimedId = params.get("openid.claimed_id") || "";
  const steamId = extractSteamId(claimedId);
  if (!steamId) return NextResponse.redirect(new URL("/?login=failed", baseUrl));

  // signed cookie: steamId + hmac
  const sigHex = createHmac("sha256", secret).update(steamId).digest("hex");

  const next = safeNextPath(params.get("next"));
  const target = new URL(next, baseUrl);
  target.searchParams.set("login", "1");

  const res = NextResponse.redirect(target);

  res.cookies.set("steam", `${steamId}.${sigHex}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // First successful login timestamp = registration date on this site.
  res.cookies.set("site_registered_at", existingRegisteredAt || new Date().toISOString(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 5,
  });

  return res;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const existingRegisteredAt = getCookieFromHeader(
    req.headers.get("cookie"),
    "site_registered_at"
  );
  return handle(
    new URLSearchParams(url.searchParams),
    url.origin,
    existingRegisteredAt
  );
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = await req.text();
  const existingRegisteredAt = getCookieFromHeader(
    req.headers.get("cookie"),
    "site_registered_at"
  );
  return handle(new URLSearchParams(body), url.origin, existingRegisteredAt);
}
