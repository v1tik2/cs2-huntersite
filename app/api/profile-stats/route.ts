import { NextResponse } from "next/server";
import { fetchProfileStatsFromServer } from "@/lib/statsApi";
import { statsMock } from "@/lib/statsMock";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const lang = (searchParams.get("lang") || "uk") as "uk" | "en";
  const steamId = searchParams.get("steamId") || "76561198320662800";

  try {
    const stats = await fetchProfileStatsFromServer({ lang, steamId });
    return NextResponse.json(stats);
  } catch (e) {
    // Поки сервер не готовий — повертаємо mock, щоб UI не ламався
    return NextResponse.json(statsMock, { status: 200 });
  }
}
