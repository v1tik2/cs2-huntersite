"use client";

import Link from "next/link";
import { skinUserMock } from "@/lib/skinchangerMock";

export function ProfileHeader({ lang }: { lang: "uk" | "en" }) {
  const u = skinUserMock;
  const isEn = lang === "en";

  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/10 ring-1 ring-white/10" />
          <div>
            <div className="text-2xl font-semibold">{u.displayId}</div>
            <div className="mt-1 text-sm text-white/60">{u.lastSeenLabel}</div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span>{isEn ? "Invite friends and get" : "Запроси друзів і отримуй"}</span>
              <span className="font-semibold text-white">500</span>
              <span>{isEn ? "coins." : "xcoins."}</span>

              <span className="ml-2 rounded-lg bg-black/30 px-2 py-1 text-xs ring-1 ring-white/10">
                {u.refLink}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-black/30 px-4 py-2 text-sm ring-1 ring-white/10">
            <span className="text-white/60">{isEn ? "Balance" : "Баланс"}:</span>{" "}
            <span className="font-semibold">{u.balance}</span>
          </div>

          <Link
            href={`/${lang}/premium`}
            className="rounded-xl bg-[#f3c969] px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110"
          >
            {isEn ? "Get Premium" : "Отримати Преміум"}
          </Link>
        </div>
      </div>
    </div>
  );
}
