import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // куди повернути після logout
  const next = url.searchParams.get("next") || "/";

  // захист від зовнішніх редіректів: дозволяємо тільки внутрішні шляхи
  const safeNext = next.startsWith("/") ? next : "/";

  const res = NextResponse.redirect(new URL(safeNext, url.origin));

  // очищаємо cookie (як у тебе)
  res.cookies.set("steam", "", { path: "/", maxAge: 0 });

  return res;
}
