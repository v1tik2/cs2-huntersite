"use client";

import { UserMenu } from "@/components/shell/UserMenu";

type Lang = "uk" | "en";

export function TopBarClient({ lang }: { lang: Lang }) {
  const balance = 760;
  const avatarUrl =
    "https://avatars.fastly.steamstatic.com/0000000000000000000000000000000000000000_full.jpg";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-black/30 ring-1 ring-white/10">
          C
        </div>

        <div className="text-sm font-semibold text-white">{balance}</div>

        <button
          type="button"
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20 hover:scale-110 ring-1 ring-white/15"
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
        title={lang === "uk" ? "Друзі" : "Friends"}
      >
        FR
      </button>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
        title={lang === "uk" ? "Сповіщення" : "Notifications"}
      >
        NT
      </button>

      <UserMenu lang={lang} avatarUrl={avatarUrl} />
    </div>
  );
}
