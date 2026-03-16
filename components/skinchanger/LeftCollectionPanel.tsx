"use client";

export function LeftCollectionPanel() {
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">Колекції</div>
        <button className="rounded-lg bg-black/30 px-2 py-1 text-xs text-white/70 hover:bg-black/40 ring-1 ring-white/10">
          Main ▾
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <button className="w-full rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/10">
          <div className="text-sm font-semibold">Скіни</div>
          <div className="text-xs text-white/60">Виберіть скін для зброї</div>
        </button>

        <button className="w-full rounded-2xl bg-black/20 px-4 py-3 text-left hover:bg-white/5 ring-1 ring-white/10">
          <div className="text-sm font-semibold">Агенти</div>
          <div className="text-xs text-white/60">Виберіть скін для агента</div>
        </button>
      </div>
    </div>
  );
}
