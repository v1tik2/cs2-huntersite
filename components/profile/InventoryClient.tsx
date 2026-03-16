"use client";

import { useEffect, useMemo, useState } from "react";
import {
  claimInventoryReward,
  getActivePrivilege,
  purgeExpiredPendingRewards,
  type InventoryReward,
  type PrivilegeTier,
  REWARDS_CHANGED_EVENT,
  setActivePrivilege,
  tierTitleUk,
} from "@/lib/rewardsStorage";

type Lang = "uk" | "en";

const EXPIRE_MS = 7 * 24 * 60 * 60 * 1000;

function tierColor(tier: PrivilegeTier) {
  if (tier === "elite") return "ring-amber-300/35 text-amber-100";
  if (tier === "premium") return "ring-blue-300/35 text-blue-100";
  return "ring-slate-200/25 text-slate-100";
}

function formatDate(ts: number, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "uk" ? "uk-UA" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
}

function formatRemaining(ms: number, lang: Lang) {
  const safe = Math.max(0, ms);
  const totalSec = Math.floor(safe / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (lang === "uk") return `${d}д ${h}г ${m}хв ${s}с`;
  return `${d}d ${h}h ${m}m ${s}s`;
}

export function InventoryClient({ lang }: { lang: Lang }) {
  const [items, setItems] = useState<InventoryReward[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTierUk, setActiveTierUk] = useState<string | null>(null);
  const [tab, setTab] = useState<"pending" | "claimed">("pending");
  const [now, setNow] = useState(Date.now());

  const load = () => {
    const fresh = purgeExpiredPendingRewards(EXPIRE_MS);
    setItems(fresh);
    const active = getActivePrivilege();
    setActiveTierUk(active ? active.titleUk : null);
  };

  useEffect(() => {
    load();

    const onUpdate = () => load();
    window.addEventListener(REWARDS_CHANGED_EVENT, onUpdate);

    const tick = window.setInterval(() => {
      setNow(Date.now());
      load();
    }, 1000);

    return () => {
      window.removeEventListener(REWARDS_CHANGED_EVENT, onUpdate);
      window.clearInterval(tick);
    };
  }, []);

  const title = useMemo(() => (lang === "uk" ? "Інвентар" : "Inventory"), [lang]);

  const pendingItems = items.filter((i) => !i.claimedAt);
  const claimedItems = items.filter((i) => Boolean(i.claimedAt));
  const visibleItems = tab === "pending" ? pendingItems : claimedItems;

  if (!items.length) {
    return (
      <div className="rounded-2xl bg-white/5 p-6 text-white/70 ring-1 ring-white/10">
        {lang === "uk" ? "Інвентар порожній." : "Inventory is empty."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="text-xl font-bold text-white">{title}</div>

        <div className="mt-3 inline-flex items-center rounded-xl bg-black/25 p-1 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setTab("pending")}
            className={[
              "rounded-lg px-4 py-2 text-xs font-semibold transition",
              tab === "pending" ? "bg-white/15 text-white ring-1 ring-white/15" : "text-white/65 hover:text-white",
            ].join(" ")}
          >
            {lang === "uk" ? `Інвентар (${pendingItems.length})` : `Inventory (${pendingItems.length})`}
          </button>

          <div className="mx-2 h-5 w-px bg-white/15" />

          <button
            type="button"
            onClick={() => setTab("claimed")}
            className={[
              "rounded-lg px-4 py-2 text-xs font-semibold transition",
              tab === "claimed" ? "bg-white/15 text-white ring-1 ring-white/15" : "text-white/65 hover:text-white",
            ].join(" ")}
          >
            {lang === "uk" ? `Отримано (${claimedItems.length})` : `Claimed (${claimedItems.length})`}
          </button>
        </div>

        {activeTierUk && (
          <div className="mt-2 text-sm text-[#9cc0ff]">
            {lang === "uk" ? "Активна привілегія:" : "Active privilege:"} {activeTierUk}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {!visibleItems.length && (
          <div className="rounded-2xl bg-white/5 p-5 text-sm text-white/60 ring-1 ring-white/10">
            {tab === "claimed"
              ? lang === "uk"
                ? "У вкладці «Отримано» поки немає предметів."
                : "No claimed items yet."
              : lang === "uk"
              ? "У вкладці «Інвентар» немає предметів."
              : "No inventory items."}
          </div>
        )}

        {visibleItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const isClaimed = Boolean(item.claimedAt);
          const remainingMs = EXPIRE_MS - (now - item.receivedAt);

          return (
            <div key={item.id} className={`rounded-2xl bg-black/20 p-5 ring-1 ${tierColor(item.tier)}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-white">{lang === "uk" ? item.titleUk : item.titleEn}</div>
                  <div className="text-sm text-white/60">
                    {lang === "uk" ? "Вибито з кейса" : "Dropped from case"}: {item.sourceCase}
                  </div>

                  {isClaimed && item.claimedAt && (
                    <div className="mt-1 text-xs text-emerald-200/90">
                      {lang === "uk" ? "Отримано:" : "Claimed:"} {formatDate(item.claimedAt, lang)}
                    </div>
                  )}

                  {!isClaimed && (
                    <div className="mt-1 text-xs text-amber-200/90">
                      {lang === "uk" ? "Зникне через:" : "Expires in:"} {formatRemaining(remainingMs, lang)}
                    </div>
                  )}
                </div>

                <div className="text-xs uppercase text-white/50">{item.rarity}</div>
              </div>

              {item.tier && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={isClaimed}
                    onClick={() => {
                      (async () => {
                        const claimed = claimInventoryReward(item.id);
                        if (!claimed) return;

                        const payload = {
                          tier: claimed.tier,
                          titleUk: tierTitleUk(claimed.tier),
                          titleEn:
                            claimed.tier === "elite" ? "Elite" : claimed.tier === "premium" ? "Premium" : "Lite",
                          durationUk: claimed.durationUk,
                          durationEn: claimed.durationEn,
                        };

                        try {
                          await fetch("/api/privilege", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          });
                        } catch {}

                        setActivePrivilege({
                          ...payload,
                          activatedAt: Date.now(),
                        });

                        setTab("claimed");
                        load();
                      })();
                    }}
                    className={[
                      "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                      isClaimed
                        ? "cursor-not-allowed bg-white/5 text-white/35 ring-1 ring-white/10"
                        : "bg-white text-black hover:brightness-110",
                    ].join(" ")}
                  >
                    {isClaimed ? (lang === "uk" ? "Отримано" : "Claimed") : lang === "uk" ? "Отримати" : "Claim"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedId((v) => (v === item.id ? null : item.id))}
                    className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
                  >
                    {lang === "uk" ? "Детальніше" : "Details"}
                  </button>
                </div>
              )}

              {isExpanded && (
                <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white/80 ring-1 ring-white/10">
                  {lang === "uk" ? item.descriptionUk : item.descriptionEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
