"use client";

import { useEffect, useMemo, useState } from "react";
import type { KnifeFinish } from "@/lib/skinchangerMock";

export function KnifeSkinsModal({
  open,
  knifeName,
  finishes,
  onClose,
  onInstall,
}: {
  open: boolean;
  knifeName: string;
  finishes: KnifeFinish[];
  onClose: () => void;
  onInstall: (finish: KnifeFinish) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelectedId(null);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return finishes.filter((f) => !q || f.name.toLowerCase().includes(q));
  }, [query, finishes]);

  const selected = useMemo(
    () => finishes.find((f) => f.id === selectedId),
    [selectedId, finishes]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#0b1118] p-5 ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Скіни для: {knifeName}</div>
            <div className="mt-1 text-sm text-white/60">
              Обери фініш і натисни “Встановити”
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/70 ring-1 ring-white/10 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Пошук фінішу…"
            className="w-full rounded-xl bg-black/20 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-white/20 lg:w-[320px]"
          />

          <button
            disabled={!selected}
            onClick={() => selected && onInstall(selected)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              selected
                ? "bg-white text-black hover:brightness-110"
                : "bg-white/15 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            Встановити
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((f) => {
            const active = f.id === selectedId;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={[
                  "rounded-2xl bg-black/20 p-4 text-left ring-1 transition",
                  active
                    ? "ring-white/35 bg-black/30"
                    : "ring-white/10 hover:bg-black/30 hover:ring-white/20",
                ].join(" ")}
              >
                <div className="text-sm font-semibold">{f.name}</div>
                <div className="mt-1 text-xs text-white/60">Finish</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
