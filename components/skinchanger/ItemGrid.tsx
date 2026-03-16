'use client';

import type { SkinItem, WeaponTab } from '@/lib/skinchangerMock';

export function ItemGrid({
  items,
  tab,
  onOpenKnife,
  onPickSimple,
}: {
  items: SkinItem[];
  tab: WeaponTab;
  onOpenKnife: (knifeId: string, knifeName: string) => void;
  onPickSimple: (id: string, name: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
      {/* promo banner */}
      <div className="mb-4 rounded-3xl bg-black/25 p-4 ring-1 ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold">SKINPLUS</div>
            <div className="text-sm text-white/70">
              Доступ на 7 днів безкоштовно — без привʼязки картки
            </div>
          </div>
          <button className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110">
            Забрати безкоштовно
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-black/20 p-6 text-sm text-white/70 ring-1 ring-white/10">
          Нічого не знайдено 😕
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => {
                if (tab === 'Knife') onOpenKnife(it.id, it.name);
                else onPickSimple(it.id, it.name);
              }}
              className="group relative overflow-hidden rounded-2xl bg-black/20 p-3 text-left ring-1 ring-white/10 hover:bg-black/30 hover:ring-white/20 transition"
            >
              <div className="h-16 rounded-xl bg-white/5" />

              <div className="mt-3 text-sm text-white/80">{it.name}</div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="m-2 rounded-xl bg-white px-3 py-2 text-center text-xs font-semibold text-black">
                  {tab === 'Knife' ? 'Вибрати фініш' : 'Вибрати'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
