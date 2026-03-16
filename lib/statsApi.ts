import type { ProfileStats } from "@/lib/statsMock";

/**
 * Тут ти потім підставиш свій сервер.
 * Приклад: https://api.mydomain.com
 */
const SERVER_BASE_URL = process.env.STATS_SERVER_URL || "";

/**
 * Який ідентифікатор користувача передаємо.
 * У тебе, скоріше за все, буде SteamID64.
 */
export async function fetchProfileStatsFromServer(params: {
  lang: "uk" | "en";
  steamId: string;
}): Promise<ProfileStats> {
  if (!SERVER_BASE_URL) {
    throw new Error("STATS_SERVER_URL is not set");
  }

  const url = new URL("/stats/profile", SERVER_BASE_URL);
  url.searchParams.set("steamId", params.steamId);
  url.searchParams.set("lang", params.lang);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Accept": "application/json",
      // Якщо треба буде токен:
      // "Authorization": `Bearer ${process.env.STATS_SERVER_TOKEN}`,
    },
    // щоб не кешувало поки розробка
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Stats server error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as ProfileStats;
  return data;
}
